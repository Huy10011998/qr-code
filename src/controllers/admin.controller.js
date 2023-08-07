const { formatToken } = require("../services/helper/helper.service");

exports.login = (req, res) => {
  try {
    res.render('./admin/login', {});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

exports.dashboard = (req, res) => {
  const token = formatToken(req.headers.cookie);

  try {
    res.render('./admin/dashboard', {
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}