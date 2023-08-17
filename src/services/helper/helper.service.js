exports.formatToken = (input) => {
  const regex = /token=([^;]+)/;
  const matches = input.match(regex);

  if (matches && matches.length > 1) {
    const token = matches[1];
    return token;
  }
  return;
};

exports.formatPhoneNumber = (phoneNumber) => {
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

  if (numericPhoneNumber.length === 10) {
    const formattedPhoneNumber = numericPhoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    return formattedPhoneNumber;
  }

  return phoneNumber;
}

exports.formatRole = (req, res, user, Role) => {
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
}