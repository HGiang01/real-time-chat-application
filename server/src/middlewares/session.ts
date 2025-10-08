import session from "express-session";
import MongoStore from "connect-mongo";

export const sessionMiddleware = () => {
  return session({
    name: "sid",
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI!,
      collectionName: "sessions",
      autoRemove: "native",
    }),
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  });
};

export const sessionPromisify = (func: (callback: (err?: any) => void) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    func((error) => {
      if (error) reject(error);
      resolve();
    })
  })
};