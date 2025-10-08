import type { NextFunction, Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";

import { User } from "../models/user.model.js";
import { sessionPromisify } from "../middlewares/session.js";
import { AppError } from "../utils/appError.js";

interface SignUpForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginFormData {
  email: string;
  password: string;
}
export const signupController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let { username, email, password, confirmPassword }: SignUpForm = req.body;

  username = username.trim();
  email = email.trim();
  password = password.trim();
  confirmPassword = confirmPassword.trim();

  // Fields validation
  if (!username || !email || !password || !confirmPassword) {
    throw new AppError(400, "[Signup] All fields are required");
  }

  if (!validator.isAlphanumeric(username, "en-US", { ignore: "_-" })) {
    throw new AppError(400, "[Signup] Invalid username");
  }

  if (!validator.isEmail(email)) {
    throw new AppError(400, "[Signup] Invalid email");
  }

  const isEmailExisted = await User.findOne({ email });
  if (isEmailExisted) {
    throw new AppError(400, "[Signup] Email already in use");
  }

  if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new AppError(
      400,
      "[Signup] Password must be at least 8 characters with uppercase, lowercase and number"
    );
  }

  if (confirmPassword !== password) {
    throw new AppError(400, "[Signup] Confirm password is incorrect");
  }

  // Hashing password
  const hashPassword = await bcrypt.hash(password, 10);

  // Storing user
  const user = new User({
    username,
    email,
    password: hashPassword,
  });

  await user.save();

  return res.status(201).json({
    status: "Success",
    message: "Account created successfully",
  });
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let { email, password }: LoginFormData = req.body;

  email = email.trim();
  password = password.trim();

  // Fields validation
  if (!email || !password) {
    throw new AppError(400, "[Login] All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(401, "[Login] Invalid email or password");
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    throw new AppError(401, "[Login] Invalid email or password");
  }

  // Create new session (automatically clears old session)
  await sessionPromisify(req.session.regenerate.bind(req.session));

  const responseUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  req.session.user = responseUser;

  return res.status(200).json({
    status: "Success",
    message: "Login successfully",
    user: responseUser,
  });4
};

export const logoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Clear session object in db
  await sessionPromisify(req.session.destroy.bind(req.session));

  // Clear cookie in browser
  res.clearCookie("sid");

  return res.status(200).json({
    status: "Success",
    message: "Logout successfully",
  });
};

export const getMeController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).json({
    status: "Success",
    user: req.session.user,
  });
};
