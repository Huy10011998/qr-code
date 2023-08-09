exports.login = (req, res) => {
  try {
    res.render('./admin/login', {});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

exports.dashboard = (req, res) => {

  try {
    res.render('./admin/dashboard', {});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}