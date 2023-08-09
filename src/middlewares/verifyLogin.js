const db = require("../models/auth.model.js/index.js");
const Role = db.role;
const User = db.user;

checkRoleUserId = (req, res, next) => {
  // userId
  User.findOne({ userId: req.body.userId }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "Sai tài khoản hoặc mật khẩu!" });
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).json({ message: "Hệ thống đang bận. Thử lại sau!" });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(400).json({ message: "Lỗi! Không có quyền truy cập!" });
        return;
      }
    );
  });
};

const verifyLogin = {
  checkRoleUserId,
};

module.exports = verifyLogin;
