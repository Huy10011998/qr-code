const Config = require('../../config/app.conf.json');

exports.login = (req, res) => {
  try {
    if (req.session.token) {
      res.redirect("/dashboard", {
        host: Config.host
      });
    } else {
      res.render('./admin/login', {
        host: Config.host
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

exports.dashboard = (req, res) => {
  try {
    res.render('./admin/dashboard', {
      host: Config.host
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

