import PageUserController from "../../controllers/user.controller";

export default function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/profile/:id', PageUserController.getUser);

  app.get('/employee/:id', PageUserController.getEmployee)
};