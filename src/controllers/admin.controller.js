const Config = require('../../config/app.conf.json');

exports.login = (req, res) => {
  try {
    console.log("===token", req.session.token);
    if (req.session.token) {
      res.redirect("/dashboard");
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

