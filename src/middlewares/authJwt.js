import jwt from "jsonwebtoken";
import config from "../../config/auth.config.js";
import db from "../models/auth.model.js";

const { user: User, role: Role } = db;

const verifyToken = (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Không được phép truy cập" });
    }
    req.userId = decoded.userId;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.userId });
    const roles = await Role.find({ _id: { $in: user.roles } });

    const isAdmin = roles.some(role => role.name === 'admin');
    if (isAdmin) {
      next();
    } else {
      res.status(403).send({ message: 'Yêu cầu vai trò người điều hành!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Hệ thống đang bận. Thử lại sau!' });
  }
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec().then((user) => {
    if (!user) {
      res.status(404).send({ message: "Người dùng không tồn tại!" });
      return;
    }

    Role.find({ _id: { $in: user.roles } }, (err, roles) => {
      if (err) {
        res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
        return;
      }

      const isModerator = roles.some(role => role.name === 'moderator');
      if (isModerator) {
        next();
      } else {
        res.status(403).send({ message: 'Yêu cầu vai trò người điều hành!' });
      }
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).send({ message: 'Hệ thống đang bận. Thử lại sau!' });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

export default authJwt;