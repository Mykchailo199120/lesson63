const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const MongoStore = require("connect-mongo");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Підключення до бази даних
mongoose.connect(process.env.MONGO_URI,
    ).then(() => console.log("✅ Підключено до MongoDB"))
    .catch(err => console.error("❌ Помилка підключення:", err));

// Налаштування сесій
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, httpOnly: true }
}));

// Ініціалізація Passport
app.use(passport.initialize());
app.use(passport.session());

// Маршрути
app.use("/", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на http://localhost:${PORT}`);
});
