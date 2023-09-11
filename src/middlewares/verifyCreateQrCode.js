import db from "../models/auth.model.js";
const User = db.user;
const ROLES = db.ROLES;

const checkDuplicateUserIdOrUserId = (req, res, next) => {
  // userId
  User.findOne({ userId: req.body.userId }).exec((err, user) => {
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

const checkRolesExisted = (req, res, next) => {
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
  checkDuplicateUserIdOrUserId,
  checkRolesExisted
};

export default verifyCreateQrCode;