import "better-auth";
import "express";

declare module "better-auth" {
  interface User {
    role?: string | null | undefined;
  }
}

declare module "express" {
  interface Request {
    session?: {
      user: {
        id: string;
        role?: string | null | undefined;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
}

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name?: string;
        email: string;
        role?: string | null | undefined;
      };
    }
  }
}

export {};