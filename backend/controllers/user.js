const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const db = require('../models');
const User = db.User;
const { Op } = db.Sequelize;

const findByEmail = async (value, include = []) => {
  const where = {
    id: { [Op.ne]: value.id },
    email: value.email,
  };
  const data = await User.findOne({
    where,
    include,
  });
  return data;
};
const findById = async (id, include = [], attributes = []) => {
  const options = {
    include,
  };
  if (attributes.length > 0) {
    options.attributes = attributes;
  }
  const data = await User.findByPk(id, options);
  console.log(data)
  return data;
};

module.exports = {
  index: async (req, res, next) => {
    const { page, size, q, role } = req.query;
    let where = { active: true };
    where = q
      ? {
          ...where,
          [Op.or]: [{ email: { [Op.like]: `%${q}%` } }, { firstname: { [Op.like]: `%${q}%` } }, { lastname: { [Op.like]: `%${q}%` } }],
        }
      : where;

    const { limit, offset } = db.getPagination(page, size);
    try {
      const lists = await User.findAndCountAll({
        include,
        where,
        limit,
        offset,
        distinct: true,
      });
      return res.status(200).json(db.getPagingData(lists, page, limit));
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  show: async (req, res, next) => {
    const { id } = req.params;
    try {
      let data = await findById(id);
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
    const data = req.body;
    try {
      const checkEmail = findByEmail(data);
      if (checkEmail) {
        return res.status(403).json({ email: !!checkEmail });
      }
      const newData = await db.sequelize.transaction((t) => {
        return User.create(data, {
          transaction: t,
        });
      });
      return res.status(201).json(newData);
    } catch (e) {
      e.message = 'Error: ' + e;
      next(e);
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    try {
      if (data.password) {
        const salt = bcryptjs.genSaltSync(10);
        data.salt = salt;
        data.password = bcryptjs.hashSync(data.password, salt);
      }
      await db.sequelize.transaction((t) => {
        return User.update(
          data,
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
  destroy: async (req, res, next) => {
    const id = req.params.id;
    try {
      await db.sequelize.transaction((t) => {
        return User.destroy(
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
      e.message = 'Error: ' + e;
      next(e);
    }
  },
};
