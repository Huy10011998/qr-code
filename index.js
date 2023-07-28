const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dbConfig = require("./app/config/db.config");

const app = express();

let corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// model user
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    fullName: { type: String, required: true },
    department: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

mongoose.connect(`mongodb+srv://quochuy10011998:JxWsKWNmfyQz0mfm@cluster0.dodnuvv.mongodb.net/`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection to MongoDB error", err);
        process.exit();
    });

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// add user
app.get('/add-profile', (req, res) => {
    try {
        User.insertMany([{
            username: "CUONGHT",
            userId: "000010",
            fullName: "Hà Trung Cường",
            email: "cuonght@cholimexfood.com",
            department: "Trưởng phòng Công Nghệ Thông Tin",
            phoneNumber: "0903 888 840",
            createdAt: "2023-07-21T06:59:24.441Z",
            modifiedAt: "2023-07-21T06:59:24.441Z",
            image: "hinh-1.png"
        }])
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// get list user
app.get('/profile/:id', (req, res) => {
    const id = req.params.id;
    try {
        User.findOne({ _id: id })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({ message: "Không tìm thấy người dùng." });
                }
                // res.status(200).send(
                //   {
                //     code: 200,
                //     data: {
                //       id: user._id,
                //       username: user.username,
                //       fullName: user.fullName,
                //       phoneNumber: user.phoneNumber,
                //       email: user.email,
                //       userId: user.userId,
                //       department: user.department,
                //     },
                //     createdAt: user.createdAt,
                //     modifiedAt: user.modifiedAt,
                //     message: "Lấy danh sách thành công!"
                //   },
                // );
                res.render('index', {
                    id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    image: user.image,
                    userId: user.userId,
                    department: user.department,
                    createdAt: user.createdAt,
                    modifiedAt: user.modifiedAt,
                });
            });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



app.get('/generate-qr-code', (req, res) => {
    res.render('generate-qr-code', {});
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});