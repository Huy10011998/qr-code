const db = require("../models/auth.model.js");
const { formatPhoneNumber } = require("../services/helper/helper.service");
const User = db.user;

exports.getUser = (req, res) => {
  const id = req.params.id;
  try {
    User.findOne({ username: id })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "Không tìm thấy người dùng." }); z
        }
        res.render('./user/index', {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          userId: user.userId,
          department: user.department,
          email: user.email,
          image: user.image,
          phoneNumber: formatPhoneNumber(user.phoneNumber),
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

