const { User } = require("../Model/User");

exports.fetchUserById = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).exec();
    res.status(200).json({
      id : user.id,
      email: user.email,
      role:user.role,
      addresses: user.addresses,
  });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({id : docs.id , role : docs.role , addresses: docs.addresses , email: docs.email});
  } catch (err) {
    res.status(400).json(err);
  }
};
