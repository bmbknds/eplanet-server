import passport from "passport";
import { Schema } from "bodymen";
import { BasicStrategy } from "passport-http";
import LocalStrategy from "passport-local";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { jwtSecret, masterKey } from "../../config";
import User, { schema } from "../../api/user/model";

export const password = () => (req, res, next) => {
  return passport.authenticate(
    "password",
    { session: false },
    (err, user, info) => {
      if (err && err.param) {
        return res.status(400).json(err);
      } else if (err || !user) {
        return res.status(401).end();
      }
      req.logIn(user, { session: false }, (err) => {
        if (err) return res.status(401).end();
        next();
      });
    }
  )(req, res, next);
};

export const master = () => passport.authenticate("master", { session: false });

export const token =
  ({ required, roles = User.roles } = {}) =>
  (req, res, next) => {
    return passport.authenticate(
      "token",
      { session: false },
      (err, user, info) => {
        if (
          err ||
          (required && !user) ||
          (required && !~roles.indexOf(user.role))
        ) {
          if (roles.indexOf(user.role) === -1) {
            return res.status(403).end();
          }
          return res.status(401).end();
        }
        req.logIn(user, { session: false }, (err) => {
          if (err) return res.status(401).end();
          // console.log(user);
          next();
        });
      }
    )(req, res, next);
  };

passport.use(
  "password",
  new BasicStrategy((email, password, done) => {
    const userSchema = new Schema({
      email: schema.tree.email,
      password: schema.tree.password,
    });

    userSchema.validate({ email, password }, (err) => {
      if (err) done(err);
    });

    User.findOne({ email }).then((user) => {
      if (!user) {
        done(true);
        return null;
      }
      return user
        .authenticate(password, user.password)
        .then((user) => {
          done(null, user);
          return null;
        })
        .catch(done);
    });
  })
);

passport.use(
  "master",
  new BearerStrategy((token, done) => {
    if (token === masterKey) {
      done(null, {});
    } else {
      done(null, false);
    }
  })
);

passport.use(
  "token",
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter("access_token"),
        ExtractJwt.fromBodyField("access_token"),
        ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
      ]),
    },
    ({ _id }, done) => {
      User.findById(_id)
        .then((user) => {
          done(null, user);
          return null;
        })
        .catch(done);
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    }
  )
);
