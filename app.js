const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const MongoStore = require("connect-mongo");
const { MongoClient, ServerApiVersion} = require("mongodb");
const { Schema, model } = mongoose;

require("dotenv").config();

const DB_URI = 'mongodb+srv://admin:admin@cluster0.8imeo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = "myDataBaseName";

const client = new MongoClient(DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const ItemSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
});

const Item = model("Item", ItemSchema);

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);



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
