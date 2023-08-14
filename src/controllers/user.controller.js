const db = require("../models/auth.model.js");
const { formatPhoneNumber } = require("../services/helper/helper.service");
const User = db.user;

exports.getUser = (req, res) => {
  const id = req.params.id;
  try {
    User.findOne({ username: id })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "Không tìm thấy người dùng." });
        }
        res.render('./user/profile', {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          fullName_en: user.fullName_en,
          userId: user.userId,
          department: user.department,
          department_en: user.department_en,
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

