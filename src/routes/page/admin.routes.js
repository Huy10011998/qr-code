const adminController = require("../../controllers/admin.controller");
const authJwt = require("../../middlewares/authJwt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/login', adminController.login)

  app.get('/dashboard', authJwt.verifyToken, authJwt.isAdmin, adminController.dashboard)
};