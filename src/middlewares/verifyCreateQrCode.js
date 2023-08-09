const db = require("../models/auth.model.js/index.js");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrUserId = (req, res, next) => {
  // username
  User.findOne({ username: req.body.username }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Lỗi! Tài khoản đã tồn tại!" });
      return;
    }

    // userId
    User.findOne({ userId: req.body.userId }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Lỗi! Mã nhân viên đã tồn tại!" });
        return;
      }
      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Lỗi! Vai trò không tồn tại!`
        });
        return;
      }
    }
  }

  next();
};

const verifyCreateQrCode = {
  checkDuplicateUsernameOrUserId,
  checkRolesExisted
};

module.exports = verifyCreateQrCode;