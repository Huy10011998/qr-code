import config from "../../config/auth.config";
import db from "../models/auth.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import unidecode from "unidecode";
import XLSX from 'xlsx';
import fs from "fs";
import path from 'path';

const User = db.user;
const Role = db.role;

const downloadAllExcel = async (req, res) => {
  try {
    Role.findOne({ name: "user" }, async (err, userRole) => {
      if (err) {
        res.status(500).json({ message: "Hệ thống đang bận. Thử lại sau!" });
        return;
      }

      const userRoleId = userRole._id;
      const total = await User.countDocuments({ roles: userRoleId });

      User.find({ roles: userRoleId })
        .sort({ createdAt: -1 })
        .exec((err, users) => {
          if (err) {
            res.status(500).json({ message: "Hệ thống đang bận. Thử lại sau!" });
            return;
          }

          const formattedUsers = users.map(user => {
            return {
              fullName: user.fullName,
              department: user.department,
              userId: user.userId,
              email: user.email,
              phoneNumber: user.phoneNumber,
            };
          });

          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(formattedUsers);

          XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

          const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

          const excelFilePath = path.join(__dirname, 'users.xlsx');
          fs.writeFileSync(excelFilePath, excelBuffer);

          res.status(200).json({
            code: 200,
            data: {
              total: total,
              data: formattedUsers,
              excelFilePath: excelFilePath,
            },
            message: "Lấy danh sách Excel thành công!",
          });
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

const updateQrCode = async (req, res) => {
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

const getQrCode = async (req, res) => {
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

const deleteQrCode = async (req, res) => {
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

const listQrCode = (req, res) => {
  try {
    const { page, limit, field, value, fromDate, toDate, orderBy } = req.body;
    const perPage = limit;
    let sortOption = {};

    if (orderBy === "ASC") {
      sortOption = { createdAt: 1 };
    } else if (orderBy === "DESC") {
      sortOption = { createdAt: -1 };
    }

    const query = User.find();

    for (let i = 0; i < field.length; i++) {
      const currentField = field[i];
      const currentValue = value[i];

      if (currentField === "fullName") {
        const normalizedValue = unidecode(currentValue);
        const regexValue = new RegExp(normalizedValue, "i");

        query.or([
          { fullName: { $regex: currentValue, $options: "i" } },
          { fullName: regexValue }
        ]).collation({ locale: "vi", strength: 2, alternate: "shifted" });
      } else if (currentField === "userId") {
        query.where({ userId: { $regex: currentValue, $options: "i" } });
      }
    }

    if (fromDate && toDate) {
      query.where({
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate)
        }
      });
    }

    query
      .sort(sortOption)
      .exec((err, users) => {
        if (err) {
          res.status(500).json({ message: "Hệ thống đang bận. Thử lại sau!" });
          return;
        }

        User.countDocuments((err, count) => {
          if (err) {
            res.status(500).json({ message: "Hệ thống đang bận. Thử lại sau!" });
            return;
          }

          const totalItems = users.length;
          const startItem = (page - 1) * perPage + 1;
          const endItem = Math.min(startItem + perPage - 1, totalItems);
          const currentPageUsers = users.slice((page - 1) * perPage, page * perPage);

          res.status(200).json({
            code: 200,
            data: {
              totalPages: Math.ceil(totalItems / perPage),
              totalItems: totalItems,
              currentPage: page,
              limit: perPage,
              startItem: startItem,
              endItem: endItem,
              data: currentPageUsers,
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

const login = (req, res) => {
  try {
    // Kiểm tra userId và password không rỗng
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).send({ message: "Tài khoản và mật khẩu không được để trống!" });
    }

    User.findOne({ userId })
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          return res.status(500).send({ message: "Hệ thống đang bận. Thử lại sau!" });
        }

        if (!user) {
          return res.status(404).send({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        let passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
          return res.status(401).send({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        let authorities = user.roles.map(role => role.name.toUpperCase());

        if (!authorities.includes("ADMIN")) {
          return res.status(403).send({ message: "Quyền truy cập bị từ chối!" });
        }

        let token = jwt.sign({ userId: user.userId }, config.secret, { expiresIn: 2592000 });

        // Thiết lập cookie
        res.cookie('token', token, {
          maxAge: 2592000000, // 30 days in milliseconds
          httpOnly: true, // Cookie chỉ có thể được truy cập bởi server
          secure: process.env.NODE_ENV === 'production', // Sử dụng HTTPS trong môi trường production
          sameSite: 'Strict' // Ngăn gửi cookie trong các yêu cầu cross-site
        });

        // Gửi phản hồi
        return res.status(200).json({
          code: 200,
          data: {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            userId: user.userId,
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
    return res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    // Set the token cookie to expire in the past, effectively removing it
    res.cookie('token', '', {
      maxAge: 0, // Set maxAge to 0 to expire the cookie immediately
      httpOnly: true, // Keep other options the same
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    return res.status(200).json({
      code: 200,
      message: "Bạn đã đăng xuất thành công!"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const authController = {
  downloadAllExcel, updateQrCode, getQrCode, deleteQrCode, listQrCode, createQrCode, login, logout
}

export default authController;