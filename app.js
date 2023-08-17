const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const exceljs = require('exceljs');
const fs = require('fs');

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
        httpOnly: false
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public/static'));
app.set('views', path.join(__dirname, 'public/layout'));
app.use(express.static(path.join(__dirname, 'public')));

const db = require("./src/models/auth.model.js");
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


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
app.post('/uploadfile', upload.single('uploadfile'), (req, res) => {
    const filePath = req.file.path;
    importExcelDataToMongoDB(filePath)
        .then(() => {
            res.status(200).send('Data inserted into MongoDB successfully.');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error inserting data into MongoDB.');
        });
});

// Hàm chuyển đổi dữ liệu từ tệp Excel sang JSON và nhập vào MongoDB
async function importExcelDataToMongoDB(filePath) {
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    const headerRow = worksheet.getRow(1);
    const columnKeys = headerRow.values;

    const jsonData = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            const rowData = {};
            row.eachCell((cell, cellNumber) => {
                const columnKey = columnKeys[cellNumber];
                rowData[columnKey] = cell.value;
            });
            jsonData.push(rowData);
        }
    });

    await User.insertMany(jsonData);

    // Xóa tệp tải lên sau khi hoàn thành
    await fs.unlinkSync(filePath);
}

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