import authJwt from "../../middlewares/authJwt";
import verifyCreateQrCode from "../../middlewares/verifyCreateQrCode";
import PageAuthController from "../../controllers/auth.controller";

export default function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/auth/downloadAllExcel", authJwt.verifyToken, authJwt.isAdmin, PageAuthController.downloadAllExcel)

  app.put("/api/auth/updateQrCode/:id", authJwt.verifyToken, authJwt.isAdmin, PageAuthController.updateQrCode);

  app.post("/api/auth/createQrCode", authJwt.verifyToken, authJwt.isAdmin, verifyCreateQrCode.checkDuplicateUserIdOrUserId, verifyCreateQrCode.checkRolesExisted, PageAuthController.createQrCode);

  app.post("/api/auth/getQrCode", authJwt.verifyToken, authJwt.isAdmin, PageAuthController.getQrCode);

  app.post("/api/auth/listQrCode", authJwt.verifyToken, authJwt.isAdmin, PageAuthController.listQrCode);

  app.delete("/api/auth/deleteQrCode", authJwt.verifyToken, authJwt.isAdmin, PageAuthController.deleteQrCode);

  app.post("/api/auth/login", PageAuthController.login);

  app.post("/api/auth/logout", PageAuthController.logout);
}