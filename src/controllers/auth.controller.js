const config = require("../../config/auth.config");
const db = require("../models/auth.model.js");
const User = db.user;
const Role = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.listQrCode = async (req, res) => {
  try {
    const { limit, page } = req.body;

    let perPage = limit || 10;
    User
      .find()
      .sort({ createdAt: -1 })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec((err, user) => {
        User.countDocuments((err, count) => {
          if (err) return next(err);
          res.status(200).json({
            code: 200,
            data: {
              totalPages: Math.ceil(count / perPage),
              totalItems: count,
              currentPage: page,
              limit: perPage,
              data: user,
            },
            message: "Lấy danh sách Qr Code thành công!"
          });
        });
      });
  } catch (err) {
    console.log(err);
  }
};

exports.createQrCode = (req, res) => {
  try {
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

              res.status(200).json({ code: 200, message: "Người dùng đã được đăng ký thành công!" });
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

            res.status(200).json({ code: 200, message: "Người dùng đã được đăng ký thành công!" });
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.login = (req, res) => {
  try {
    User.findOne({ username: req.body.username, })
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
          return;
        }

        if (!user) {
          return res.status(404).send({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        let passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        let token = jwt.sign({ username: user.username }, config.secret, {
          expiresIn: 2592000 // 30 day
        });

        let authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
          authorities.push(user.roles[i].name.toUpperCase());
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
  } catch (err) {
    console.log(err);
  }
};

exports.logout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).json({
      code: 200,
      message: "Bạn đã đăng xuất!"
    });
  } catch (err) {
    console.log(err);
  }
};


