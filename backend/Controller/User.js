const { User } = require("../Model/User");

exports.fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id, "name email id role addresses").exec();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
