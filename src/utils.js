import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
export const JWT_CLIENT_ID = process.env.JWT_CLIENT_ID;
export const JWT_CLIENT_SECRET = process.env.JWT_CLIENT_SECRET;
export const SECRET_PASS = process.env.SECRET_PASS;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const SIGNED_COOKIE_KEY = process.env.SIGNED_COOKIE_KEY;

export const PORT = 8080;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/img`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const uploader = multer({ storage });

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

/* JWT */
export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({error:info.messages?info.messages:info.toString()})
      }
      req.user = user;
      next();
    }) (req, res, next);
  }
}
