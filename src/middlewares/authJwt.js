const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const db = require("../models/auth.model.js");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.session.token;
  if (!token) {
    return res.status(403).send({ message: "Chưa có token!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Không được phép truy cập" });
    };
    req.username = decoded.username;
    next();
  });
};

checkRoleUserName = (req, res, next) => {
  // username
  User.findOne({ username: req.body.username }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "Không tìm thấy người dùng!" });
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

isAdmin = (req, res, next) => {
  User.findOne({ username: req.username }).then((user) => {
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

        res.status(403);
        return;
      }
    );
  }).catch((err) => {
    console.error(err)
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec().then((err, user) => {
    if (err) {
      res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name == "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Yêu cầu vai trò người điều hành!" });
        return;
      }
    );
  }).catch((err) => {
    console.error(err)
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  checkRoleUserName
};
module.exports = authJwt;