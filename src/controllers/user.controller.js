import db from "../models/auth.model.js";
import { formatPhoneNumber } from "../services/helper/helper.service";
import Config from '../../config/app.conf.json';

const User = db.user;

const getUser = (req, res) => {
  const id = req.params.id;
  try {
    User.findOne({ _id: id })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "Không tìm thấy người dùng." });
        }
        res.render('./user/profile', {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          fullName_en: user.fullName_en,
          userId: user.userId,
          department: user.department,
          department_en: user.department_en,
          email: user.email,
          image: user.image,
          phoneNumber: formatPhoneNumber(user.phoneNumber),
          host: Config.host
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

const getEmployee = (req, res) => {
  try {
    const id = req.params.id;
    try {
      User.findOne({ _id: id })
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: "Không tìm thấy người dùng." });
          }
          res.render('./user/employee', {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            fullName_en: user.fullName_en,
            userId: user.userId,
            department: user.department,
            department_en: user.department_en,
            email: user.email,
            image: user.image,
            phoneNumber: formatPhoneNumber(user.phoneNumber),
            host: Config.host
          });
        });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

const userController = {
  getUser,
  getEmployee
}

export default userController;