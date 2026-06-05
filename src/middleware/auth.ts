import { auth } from "../lib/auth.js";
import type { NextFunction, Request, Response } from "express";
import type { Session } from "better-auth";
import { fromNodeHeaders } from "better-auth/node";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
      // file?: any
    }
  }
}


export const  isAuthUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
   const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
  if (!session) {
    return res.status(401).json({ message: "Please login" });
  }
  req.user = session.user;
  req.session = session;
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user?.role === "ADMIN") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
};

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user?.role === "OWNER" || req.user?.role === "ADMIN")) {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
}; 