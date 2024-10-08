import Config from '../../config/app.conf.json';

const login = (req, res) => {
  try {
    if (req.cookies.token) {
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
};

const dashboard = (req, res) => {
  try {
    res.render('./admin/dashboard', {
      host: Config.host
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
const adminController = {
  login,
  dashboard,
};

export default adminController;