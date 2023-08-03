const db = require("../models/auth.model.js");
const User = db.user;

exports.generateQrCode = (req, res) => {
  try {
    res.render('./user/generate-qr-code', {});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

exports.getUser = (req, res) => {
  const id = req.params.id;
  try {
    User.findOne({ _id: id })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "Không tìm thấy người dùng." });
        }
        res.render('./user/index', {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          userId: user.userId,
          department: user.department,
          email: user.email,
          image: user.image,
          phoneNumber: user.phoneNumber,
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

