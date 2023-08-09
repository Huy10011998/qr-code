const { verifyCreateQrCode, authJwt } = require("../../middlewares");
const controller = require("../../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/createQrCode", authJwt.verifyToken, authJwt.isAdmin, verifyCreateQrCode.checkDuplicateUsernameOrUserId, verifyCreateQrCode.checkRolesExisted, controller.createQrCode);

  app.post("/api/auth/login", controller.login);

  app.post("/api/auth/logout", controller.logout);

  app.post("/api/auth/listQrCode", authJwt.verifyToken, authJwt.isAdmin, controller.listQrCode)
};
