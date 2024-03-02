const { User } = require("../Model/User");

exports.createUser = (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ message: "no such email found" });
    }
    else if (user.password === req.body.password) {
      res.status(200).json({ id: user.id, email: user.email, role: user.role , addresses : user.addresses });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
