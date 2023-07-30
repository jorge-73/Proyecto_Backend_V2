import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { userModel } from "../dao/models/users.model.js";
import bcrypt from "bcrypt";
import {
  JWT_CLIENT_ID,
  JWT_CLIENT_SECRET,
  PRIVATE_KEY,
  SIGNED_COOKIE_KEY,
  createHash,
  generateToken,
  isValidPassword,
} from "../utils.js";

const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

let token = null;
const cookieExtractor = (req) => {
  token =
    req && req.signedCookies ? req.signedCookies[SIGNED_COOKIE_KEY] : null;
  return token;
};

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          if (
            newUser.email === "adminCoder@coder.com" &&
            bcrypt.compareSync("adminCod3r123", newUser.password)
          ) {
            newUser.role = "Admin";
          }
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          console.log(error);
          return done("Error creating user: " + error.message);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user || !isValidPassword(user, password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          console.log(error);
          return done("Error getting user");
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: JWT_CLIENT_ID,
        clientSecret: JWT_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/jwt/githubcallback",
      },
      async (accessTocken, refreshToken, profile, done) => {
        try {
          // console.log(profile);
          const userName = profile.displayName || profile.username;
          const userEmail = profile._json.email;

          const existingUser = await userModel.findOne({ email: userEmail });
          if (existingUser) {
            // Si el usuario ya existe en la base de datos, generamos el token
          const token = generateToken(existingUser);
            // Enviamos el token como una cookie en la respuesta
          return done(null, existingUser, { token });
          }
          const newUser = {
            first_name: userName,
            last_name: " ",
            email: userEmail,
            password: " ",
          };
          const result = await userModel.create(newUser);
          // Generamos el token para el nuevo usuario
          const token = generateToken(result);
          // Enviamos el token como una cookie en la respuesta
          return done(null, result, { token });
        } catch (error) {
          console.log(error);
          return done("Error getting user");
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});

export default initializePassport;
