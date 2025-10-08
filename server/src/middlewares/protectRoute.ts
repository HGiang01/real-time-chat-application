import { type Request, type Response, type NextFunction } from "express";

// Extend the session type to include 'user'
declare module "express-session" {
  interface SessionData {
    user?: any;
  }
}

export const protectRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session) {
    return res.status(401).json({
      status: "Error",
      message: "Session not found",
    });
  }

  if (!req.session.user) {
    return res.status(403).json({
      status: "Error",
      message: "You don't have permission to access this endpoint",
    });
  }

  next();
};
