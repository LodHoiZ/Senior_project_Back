const express = require('express');
const upload = require('../config/multer');
const { eventController } = require('../controllers');

const passport = require('../config/passport');
const { checkBody, checkParamId } = require('../middlewares');

const router = express.Router();

const path = '/events';

router.get(`${path}/summary`, passport.authenticate('bearer', { session: false }), eventController.eventSummary);
router.get(`${path}/term`, passport.authenticate('bearer', { session: false }), eventController.eventTerm);
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), eventController.index);
router.get(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, eventController.show);
router.post(`${path}-document-comment-prepare`, passport.authenticate('bearer', { session: false }), checkBody, eventController.createCommentPrepare);
router.post(`${path}-document-prepare`, passport.authenticate('bearer', { session: false }), checkBody, eventController.createPrepare);
router.post(`${path}-document-feedback`, passport.authenticate('bearer', { session: false }), checkBody, eventController.createFeedback);
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkBody, eventController.store);
router.put(
  `${path}-document/:id`,
  passport.authenticate('bearer', { session: false }),
  upload.single('file'),
  checkParamId,
  checkBody,
  eventController.createDocument
);
router.put(
  `${path}-document-status/:id`,
  passport.authenticate('bearer', { session: false }),
  checkParamId,
  checkBody,
  eventController.updateDocumentStatus
);
router.put(
  `${path}-document-comment/:id`,
  passport.authenticate('bearer', { session: false }),
  checkParamId,
  checkBody,
  eventController.createComment
);
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, eventController.update);
router.delete(`${path}-document-prepare/:id`, passport.authenticate('bearer', { session: false }), checkParamId, eventController.destroyPrepare);
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, eventController.destroy);

module.exports = router;
