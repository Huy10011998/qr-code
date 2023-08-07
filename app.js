const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dbConfig = require("./config/db.config");

const app = express();

let corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: "token",
        secret: "COOKIE_SECRET", // should use as secret environment variable
        httpOnly: true
    })
);

app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public/static'));
app.set('views', path.join(__dirname, 'public/layout'));
app.use(express.static(path.join(__dirname, 'public')));

const db = require("./src/models/auth.model.js");
const Role = db.role;

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection to MongoDB error", err);
        process.exit();
    });

// routes
require("./src/routes/api/auth.routes")(app);
require("./src/routes/page/user.routes")(app);
require("./src/routes/page/admin.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}