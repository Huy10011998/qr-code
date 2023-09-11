import pageUser from "./user.routes";
import pageAdmin from "./admin.routes";

export default function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/', pageUser);

  app.get('/', pageAdmin);
}