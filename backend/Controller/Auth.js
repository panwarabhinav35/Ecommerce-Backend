const { User } = require("../Model/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../Services/common");
const { serializeUser } = require("passport");
const SECRET_KEY = "SECRET_KEY";
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      31000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();
        req.login(sanitizeUser(doc), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
            res.cookie("jwt", token, {
              expires: new Date(Date.now() + 3600000),
              httpOnly: true,
            });
            res
              .status(201)
              .json({
                id: doc.id,
                role: doc.role,
                addresses: doc.addresses,
                email: doc.email,
                token,
              });
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({
      id: user.id,
      role: user.role,
      addresses: user.addresses,
      email: user.email,
      token: user.token,
    });
};
exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(sanitizeUser(req.user));
  } else {
    res.sendStatus(401);
  }
};
