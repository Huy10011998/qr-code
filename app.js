'use strict'

import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";
import path from "path";
import multer from "multer";
import excelJs from "exceljs";
import fs from "fs";
import bcrypt from "bcryptjs";
import moment from "moment-timezone";
import host from "./config/app.conf.json";
import rateLimit from "express-rate-limit";
import authJwt from "./src/middlewares/authJwt";
import mongoose from "mongoose";
import db from "./src/models/auth.model.js";
import dbConfig from "./config/db.config";
//api
import authRoutes from "./src/routes/api/auth.routes";
//page
import userRoutes from "./src/routes/page/user.routes";
import adminRoutes from "./src/routes/page/admin.routes";

(async () => {
    try {
        const apiLimiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 1000,
        });

        mongoose.set('strictQuery', false);

        moment.tz.setDefault('Asia/Ho_Chi_Minh');

        const app = express();

        let corsOptions = {
            // origin: `${host}`
            origins: '*',
            // credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            // headers: ['X-Requested-With'],
            // allowedHeaders: Object.keys(this.requestModel.headers),
            preflightContinue: false,
            optionsSuccessStatus: 204
        };

        app.use(apiLimiter);

        app.use(cors(corsOptions));

        // parse requests of content-type - application/json
        app.use(express.json());

        // parse requests of content-type - application/x-www-form-urlencoded
        app.use(express.urlencoded({ extended: true }));

        app.use(
            cookieSession({
                name: "token",
                secret: "COOKIE_SECRET", // should use as secret environment variable
                httpOnly: false
            })
        );

        app.use(
            bodyParser.urlencoded({
                extended: true,
            })
        );

        app.use(bodyParser.json());
        app.set('view engine', 'ejs');
        app.use('/static', express.static(__dirname + '/public/static'));
        app.set('views', path.join(__dirname, 'public/layout'));
        app.use(express.static(path.join(__dirname, 'public')));

        //connect mongodb
        const User = db.user
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

        //import file excel
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './public/uploads');
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        });

        const upload = multer({ storage: storage });
        app.post('/uploadfile', authJwt.verifyToken, authJwt.isAdmin, upload.single('uploadfile'), (req, res) => {
            const filePath = req.file.path;
            importExcelDataToMongoDB(filePath)
                .then(() => {
                    res.redirect("/dashboard")
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error inserting data into MongoDB.');
                });
        });

        // Function to convert data from Excel file to JSON and import to MongoDB
        async function importExcelDataToMongoDB(filePath) {
            const workbook = new excelJs.Workbook();
            await workbook.xlsx.readFile(filePath);

            const worksheet = workbook.getWorksheet(1);

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const rowData = {};
                    row.eachCell((cell, cellNumber) => {
                        switch (cellNumber) {
                            case 2: {
                                rowData["userId"] = cell.value;
                                break;
                            }
                            case 3: {
                                rowData["username"] = cell.value;
                                break;
                            }
                            case 4: {
                                rowData["fullName"] = cell.value;
                                break;
                            }
                            case 5: {
                                rowData["fullName_en"] = cell.value;
                                break;
                            }
                            case 6: {
                                rowData["phoneNumber"] = cell.value;
                                break;
                            }
                            case 7: {
                                rowData["email"] = cell.value;
                                break;
                            }
                            case 8: {
                                rowData["department"] = cell.value;
                                break;
                            }
                            case 9: {
                                rowData["department_en"] = cell.value;
                                break;
                            }
                            case 10: {
                                rowData["image"] = cell.value;
                                break;
                            }
                            default:
                                break;
                        }
                    });
                    rowData["password"] = bcrypt.hashSync("1", 8);
                    rowData["roles"] = "64c8ac29ed7c1ebd4726d28a";
                    console.log('rowData', rowData);

                    User.findOne({ userId: rowData["userId"] }).then(async (user) => {
                        if (!user) {
                            const user = new User(rowData);
                            user.save();
                        }
                    });
                }
            });

            // Delete the uploaded file once done
            fs.unlinkSync(filePath);
        }

        // routes api
        authRoutes(app);

        // routes page
        userRoutes(app);
        adminRoutes(app);

        // set port, listen for requests
        const PORT = process.env.PORT || 8888;
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


    } catch (ex) {
        console.error(ex.stack)
        process.exit(1)
    }
})();

