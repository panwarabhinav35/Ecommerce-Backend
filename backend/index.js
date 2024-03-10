const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require('dotenv').config();

const productsRouter = require("./Routes/Products");
const categoriesRouter = require("./Routes/Category");
const brandsRouter = require("./Routes/Brands");
const usersRouter = require("./Routes/User");
const authRouter = require("./Routes/Auth");
const cartRouter = require("./Routes/Cart");
const orderRouter = require("./Routes/Order");
const { User } = require("./Model/User");
const { isAuth, sanitizeUser, cookieExTractor } = require("./Services/common");
const cookieParser = require("cookie-parser");
const server = express();
const SECRET_KEY = process.env.SECRET_KEY;
const Razorpay = require("razorpay");

//JWT options
var opts = {};
opts.jwtFromRequest = cookieExTractor;
opts.secretOrKey = SECRET_KEY; //TODO : shoul not be in code

//middle-wares

server.use(express.static("build"));
server.use(cookieParser());
server.use(
  session({
    secret: "keyboard cat",
    resave: false, //dont save session if unmodified
    saveUninitialized: false, //dont create session untill something stored
  })
);

server.use(passport.authenticate("session"));

server.use(cors());
server.use(express.json()); // to parse request body
server.use("/products", isAuth(), productsRouter.router);
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/users", isAuth(), usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/carts", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);

// PassPort Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    //by default passport uses username
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        return done(null, false, { message: "no such user email" });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        31000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          } else {
            const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
            done(null, {
              id: user.id,
              role: user.role,
              addresses: user.addresses,
              email: user.email,
              token,
            });
          }
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      // const user =await User.findOne({ _id: jwt_payload.sub })
      const user = await User.findOne({ email: jwt_payload.email });
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

//this create session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log("serialise", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

// this changes session variable req.user when called from authorised request
passport.deserializeUser(function (user, cb) {
  console.log("de-serialise------------", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

//Payments

const instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_API_KEY,
  key_secret: process.env.RAZOR_PAY_API_SECRET,
});

server.get("/getKey", (req, res) => {
  res.status(200).json({ key: process.env.RAZOR_PAY_API_KEY });
});

server.post("/razorpay", async (req, res) => {
  const options = {
    amount: Number(req.body.amount) * 100,
    currency: "INR",
  };
  try {
    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
});
server.post("/paymentVerification", async (req, res) => {
  res.status(200).json({ success: true });
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}

main().catch((err) => console.log(err));

server.get("/", (req, res) => {
  res.json({ success : true });
});

server.listen(8080, () => {
  console.log("Server started");
});
