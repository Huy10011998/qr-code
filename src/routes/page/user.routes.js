const userController = require("../../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/profile/:id', userController.getUser);

  app.get('/generate-qr-code', userController.generateQrCode);
};