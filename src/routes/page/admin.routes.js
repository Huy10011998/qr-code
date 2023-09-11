import PageAdminController from "../../controllers/admin.controller";
import authJwt from "../../middlewares/authJwt";

export default function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/login', PageAdminController.login);

  app.get('/dashboard', authJwt.verifyToken, authJwt.isAdmin, PageAdminController.dashboard);
}