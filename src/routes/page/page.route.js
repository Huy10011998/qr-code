const pageUser = require("./user.routes");
const pageAdmin = require("./admin.routes");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/', pageUser);

  app.get('/', pageAdmin);
};