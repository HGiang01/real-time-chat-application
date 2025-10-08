import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../utils/appError.js";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);

  if (error instanceof AppError) {

    return res.status(error.statusCode).json({
      status: "Error",
      message: error.message.slice(error.message.indexOf("]") + 2),
    });
  }

  return res.status(500).json({
    status: "Error",
    message: "Internal Server Error",
  });
};
  