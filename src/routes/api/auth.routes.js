const { verifySignUp, verifySignIn } = require("../../middlewares");
const controller = require("../../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup", verifySignUp.checkDuplicateUsernameOrUserId, verifySignUp.checkRolesExisted, controller.signup);

  app.post("/api/auth/signin", verifySignIn.checkRoleUserId, controller.signin);

  app.post("/api/auth/signout", controller.signout);
};
