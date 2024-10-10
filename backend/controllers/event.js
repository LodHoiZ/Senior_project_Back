const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const db = require('../models');
const Event = db.Event;
const User = db.User;
const EventComment = db.EventComment;
const EventDocument = db.EventDocument;
const EventSuggestion = db.EventSuggestion;
const EventFeedback = db.EventFeedback;
const EventPrepare = db.EventPrepare;
const Prepare = db.Prepare;
const { Op, fn, literal } = db.Sequelize;

const generateCode = async () => {
  const event = await Event.findAll({
    where: {
      created_at: {
        [Op.gte]: new Date().setHours(0, 0, 0, 0),
        [Op.lte]: new Date().setHours(23, 59, 59, 0),
      },
    },
    order: [['createdAt', 'desc']],
  });
  return 'AC' + dayjs().format('YYMMDD') + ('000' + (event.length + 1) ?? 1).slice(-3);
};

module.exports = {
  index: async (req, res, next) => {
    const { year, month } = req.query;
    let where = {};
    where =
      year || month
        ? {
            ...where,
            year: Number(year),
            month: Number(month),
          }
        : where;

    try {
      const lists = await Event.findAll({
        where,
        include: [
          { model: User, attributes: ['email', 'firstname', 'lastname'] },
          EventFeedback,
          { model: EventPrepare, attributes: ['comment'], include: [{ model: Prepare, attributes: ['id', 'prepare'] }] },
        ],
        distinct: true,
      });
      return res.status(200).json(lists);
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  eventSummary: async (req, res, next) => {
    try {
      const where = {
        completed: {
          [Op.and]: [{ number_file_success: { [Op.gt]: 0 } }, { number_file_reject: 0 }],
        },
        revising: {
          [Op.and]: [{ number_file_success: 0 }, { number_file_reject: 0 }],
        },
        rejected: {
          [Op.and]: [{ number_file_reject: { [Op.gt]: 0 } }],
        },
      };

      const completedCount = await Event.count({ where: where.completed });
      const revisingCount = await Event.count({ where: where.revising });
      const rejectedCount = await Event.count({ where: where.rejected });

      return res.status(200).json({
        completed: completedCount,
        revising: revisingCount,
        rejected: rejectedCount,
      });
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  eventTerm: async (req, res, next) => {
    try {
      const formatLabel = (term, year) => `${term}/${year}`;
      const results = await Event.findAll({
        attributes: [
          'term',
          'year',
          [fn('SUM', literal('CASE WHEN number_file_success >= 0 OR number_file_reject >= 0 THEN 1 ELSE 0 END')), 'eventCount'],
        ],
        group: ['term', 'year'],
        raw: true,
      });

      // Prepare the data
      const labels = results.map((result) => formatLabel(result.term, result.year));
      const data = results.map((result) => parseInt(result.eventCount));

      return res.status(200).json({
        labels,
        data,
      });
    } catch (e) {
      console.log(e);

      e.message = 'Error: ' + e;
      next(e);
    }
  },
  show: async (req, res, next) => {
    const { id } = req.params;
    try {
      let data = await Event.findOne({
        where: { id },
        include: [
          { model: User, attributes: ['firstname', 'lastname'] },
          { model: EventComment, attributes: ['comment', 'name', 'created_at'], include: [{ model: User, attributes: ['firstname', 'lastname'] }] },
          EventDocument,
          EventSuggestion,
        ],
      });
      if (data) {
        return res.status(200).json(data);
      }
      return res.status(404).json({
        message: 'Not Found',
      });
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  store: async (req, res, next) => {
    const body = req.body;
    try {
      const data = {
        ...body,
        code: await generateCode(),
        user_id: req.user.id,
        status: 'Event Proposal Document (revising)',
        event_date: new Date(body.event_date),
      };
      const newData = await db.sequelize.transaction((t) => {
        return Event.create(data, {
          transaction: t,
        });
      });
      return res.status(201).json(newData);
    } catch (e) {
      console.log(e);
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const oldFile = await Event.findOne({ where: { id } });
      await db.sequelize.transaction((t) => {
        return Event.update(
          {
            ...data,
            number_file_success:
              data.status === 'completed'
                ? oldFile.number_file_success + 1
                : data.status === 'rejected'
                ? oldFile.number_file_success - 1
                : oldFile.number_file_success,
            number_file_reject:
              data.status === 'rejected'
                ? oldFile.number_file_reject + 1
                : data.status === 'completed'
                ? oldFile.number_file_success - 1
                : oldFile.number_file_reject,
          },
          {
            where: {
              id,
            },
          },
          {
            transaction: t,
          }
        );
      });
      return res.status(200).json(data);
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  createDocument: async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const doc = await EventDocument.findOne({ where: { event_id: id, name: data.name } });
      if (doc) {
        const filePath = path.join('static/uploads', doc.url);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      }
      const newData = await db.sequelize.transaction((t) => {
        return EventDocument.create(
          {
            ...data,
            url: req.file.filename,
            status: 'revising',
            event_id: id,
            type_document: req.file.mimetype,
          },
          {
            transaction: t,
          }
        );
      });
      return res.status(200).json(newData);
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  createComment: async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const newData = await db.sequelize.transaction((t) => {
        return EventComment.create(
          {
            ...data,
            event_id: id,
            user_id: req.user.id,
          },
          {
            transaction: t,
          }
        );
      });
      return res.status(200).json(newData);
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  createFeedback: async (req, res, next) => {
    const data = req.body;
    try {
      const check = await EventFeedback.findOne({ where: { event_id: data.event_id } });
      if (check) {
        await db.sequelize.transaction((t) => {
          return EventFeedback.update(
            {
              ...data,
            },
            { where: { id: check.id } }
          );
        });
        return res.status(200).json(check);
      } else {
        const newData = await db.sequelize.transaction((t) => {
          return EventFeedback.create(
            {
              ...data,
              event_id: data.event_id,
              user_id: req.user.id,
            },
            {
              transaction: t,
            }
          );
        });
        return res.status(200).json(newData);
      }
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  createCommentPrepare: async (req, res, next) => {
    const data = req.body;
    try {
      const check = await EventPrepare.findOne({ where: { event_id: data.event_id } });
      if (check) {
        await db.sequelize.transaction((t) => {
          return EventPrepare.update(
            {
              ...data,
            },
            { where: { id: check.id } }
          );
        });
        return res.status(200).json(check);
      } else {
        const newData = await db.sequelize.transaction((t) => {
          return EventPrepare.create(
            {
              ...data,
              event_id: data.event_id,
              user_id: req.user.id,
            },
            {
              transaction: t,
            }
          );
        });
        return res.status(200).json(newData);
      }
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  createPrepare: async (req, res, next) => {
    const data = req.body;
    try {
      const check = await EventPrepare.findOne({ where: { event_id: data.event_id } });
      if (check) {
        const newData = await db.sequelize.transaction((t) => {
          return Prepare.create(
            {
              ...data,
              event_prepare_id: check.id,
            },
            {
              transaction: t,
            }
          );
        });
        return res.status(200).json(newData);
      } else {
        const eventPrepare = await db.sequelize.transaction((t) => {
          return EventPrepare.create(
            {
              comment: null,
              event_id: data.event_id,
              user_id: req.user.id,
            },
            {
              transaction: t,
            }
          );
        });
        const newData = await db.sequelize.transaction((t) => {
          return Prepare.create(
            {
              ...data,
              event_prepare_id: eventPrepare.id,
            },
            {
              transaction: t,
            }
          );
        });
        return res.status(200).json(newData);
      }
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  updateDocumentStatus: async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const oldFile = await Event.findOne({ where: { id } });

      await db.sequelize.transaction((t) => {
        return Event.update(
          {
            status: `${data.name} (${data.status})`,
            number_file_success:
              data.status === 'completed'
                ? oldFile.number_file_success + 1
                : data.status === 'rejected'
                ? oldFile.number_file_success - 1
                : oldFile.number_file_success,
            number_file_reject:
              data.status === 'rejected'
                ? oldFile.number_file_reject + 1
                : data.status === 'completed'
                ? oldFile.number_file_success - 1
                : oldFile.number_file_reject,
          },
          {
            where: {
              id,
            },
          },
          {
            transaction: t,
          }
        );
      });
      await db.sequelize.transaction((t) => {
        return EventDocument.update(
          data,
          {
            where: {
              event_id: id,
              name: data.name,
            },
          },
          {
            transaction: t,
          }
        );
      });
      return res.status(200).json(data);
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  destroy: async (req, res, next) => {
    const id = req.params.id;
    try {
      const doc = await EventDocument.findOne({ where: { event_id: id } });
      if (doc) {
        const filePath = path.join('static/uploads', doc.url);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      }
      await db.sequelize.transaction((t) => {
        return EventDocument.destroy(
          {
            where: {
              event_id: id,
            },
          },
          {
            transaction: t,
          }
        );
      });
      await db.sequelize.transaction((t) => {
        return EventSuggestion.destroy(
          {
            where: {
              event_id: id,
            },
          },
          {
            transaction: t,
          }
        );
      });
      await db.sequelize.transaction((t) => {
        return EventComment.destroy(
          {
            where: {
              event_id: id,
            },
          },
          {
            transaction: t,
          }
        );
      });
      await db.sequelize.transaction((t) => {
        return Event.destroy(
          {
            where: {
              id,
            },
          },
          {
            transaction: t,
          }
        );
      });
      return res.status(204).send();
    } catch (e) {
      console.log(e);
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  destroyPrepare: async (req, res, next) => {
    const id = req.params.id;
    try {
      await db.sequelize.transaction((t) => {
        return Prepare.destroy(
          {
            where: {
              id,
            },
          },
          {
            transaction: t,
          }
        );
      });
      return res.status(200).json();
    } catch (e) {
      console.log(e);
      e.message = 'Error: ' + e;
      next(e);
    }
  },
};
