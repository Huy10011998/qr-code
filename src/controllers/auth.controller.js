const config = require("../../config/auth.config");
const db = require("../models/auth.model.js");
const User = db.user;
const Role = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    fullName: req.body.fullName,
    userId: req.body.userId,
    department: req.body.department,
    email: req.body.email,
    image: req.body.image,
    phoneNumber: req.body.phoneNumber,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
              return;
            }

            res.send({ message: "Người dùng đã được đăng ký thành công!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
            return;
          }

          res.send({ message: "Người dùng đã được đăng ký thành công!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({ userId: req.body.userId, })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
        return;
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Mật khẩu không hợp lệ!" });
      }

      let token = jwt.sign({ userId: user.userId }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).json(
        {
          code: 200,
          token: token,
          data: {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            userId: req.body.userId,
            department: user.department,
            email: user.email,
            phoneNumber: user.phoneNumber,
            image: user.image,
            roles: authorities,
          },
          createdAt: user.createdAt,
          modifiedAt: user.modifiedAt,
          message: "Đăng nhập tài khoản thành công!"
        },
      );
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "Bạn đã đăng xuất!" });
  } catch (err) {
    this.next(err);
  }
};


