import express from 'express';
import auth from '../../middlewares/auth';
import { ChatController } from './chat.controller';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();

router.route("/")
  .post(
    auth(USER_ROLES.CUSTOMER),
    async (req, res, next) => {
      try {
        req.body = [req.user.id, req.body.participant];
        next();
      } catch (error) {
        res.status(400).json({ message: "Failed to create chat" });
      }
    },
    ChatController.createChat
  )
  .get(
    auth(USER_ROLES.CUSTOMER, USER_ROLES.VENDOR),
    ChatController.getChat
  );

export const ChatRoutes = router;
