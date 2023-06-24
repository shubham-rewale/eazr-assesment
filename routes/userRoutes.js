import express from "express";

// eslint-disable-next-line import/extensions
import * as userControllers from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.route("/signUp").post(userControllers.signUp);
userRouter.route("/login").post(userControllers.login);

export default userRouter;
