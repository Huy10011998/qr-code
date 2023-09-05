const config = require("../../config/auth.config");
const db = require("../models/auth.model.js");
const User = db.user;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.updateQrCode = async (req, res) => {
  const id = req.params.id;
  const { fullName, username, password, department, email, image, phoneNumber, roles, userId, department_en, fullName_en } = req.body;

  try {
    const user = await User.findOne({ userId: id });

    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại!' });
    }

    user.fullName = fullName;
    user.username = username;
    user.department = department;
    user.email = email;
    user.image = image;
    user.phoneNumber = phoneNumber;
    user.userId = userId;
    user.fullName_en = fullName_en,
      user.department_en = department_en,
      user.modifiedAt = new Date();

    user.save((err, user) => {
      if (password != user.password) {
        user.password = bcrypt.hashSync(password, 8);
      }

      if (err) {
        res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
        return;
      }

      if (roles) {
        Role.find(
          {
            name: { $in: roles },
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
          });
        });
      }
    });

    return res.status(200).json({ code: 200, message: 'Cập nhật mã Qr Code thành công!', user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

exports.getQrCode = async (req, res) => {
  const userId = req.body.userId;
  try {
    User.findOne({ userId: userId }).populate("roles", "-__v").exec((err, user) => {

      if (err) {
        res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Không tìm thấy người dùng." });
      }

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name);
      }

      res.status(200).json({
        code: 200,
        data: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          fullName_en: user.fullName_en,
          userId: user.userId,
          password: user.password,
          department: user.department,
          department_en: user.department_en,
          email: user.email,
          image: user.image,
          roles: authorities,
          phoneNumber: user.phoneNumber,
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

exports.deleteQrCode = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    await User.findOneAndDelete({ userId: userId });

    res.status(200).json({ code: 200, message: 'Người dùng đã được xóa thành công.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.listQrCode = (req, res) => {
  try {
    const { page, limit, field, value, orderBy } = req.body;

    let perPage = limit || 15;
    let sortOption = {};

    if (orderBy === "ASC") {
      sortOption = { createdAt: 1 };
    } else if (orderBy === "DESC") {
      sortOption = { createdAt: -1 };
    }

    const query = User.find();

    if (field && value && field.length === value.length) {
      for (let i = 0; i < field.length; i++) {
        const currentField = field[i];
        const currentValue = value[i];

        if (currentField === "fullName") {
          query.where({ fullName: { $regex: currentValue, $options: "i" } });
        } else if (currentField === "userId") {
          query.where({ userId: { $regex: currentValue, $options: "i" } });
        }
      }
    }

    query
      .sort(sortOption)
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
            message: "Lấy danh sách Qr Code thành công!",
          });
        });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createQrCode = (req, res) => {
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
      createdAt: new Date(),
      modifiedAt: new Date(),
      fullName_en: req.body.fullName_en,
      department_en: req.body.department_en
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
    res.status(500).json({ message: err.message });
  }
};

exports.createQrCode = createQrCode;

exports.login = (req, res) => {
  try {
    User.findOne({ userId: req.body.userId })
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
          return;
        }

        if (!user) {
          return res.status(404).send({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
          return res.status(401).send({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        let authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
          authorities.push(user.roles[i].name.toUpperCase());
        }

        if (!authorities.includes("ADMIN")) {
          return res.status(403).send({ message: "Quyền truy cập bị từ chối!" });
        }

        let token = jwt.sign({ userId: user.userId }, config.secret, {
          expiresIn: 2592000 // 30 days
        });

        req.session.token = token;

        res.status(200).json({
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
        });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: err.message });
  }
};

