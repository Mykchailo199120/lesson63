const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const MongoStore = require("connect-mongo");
const {MongoClient, ServerApiVersion} = require("mongodb");
const connectDB = require('./config/db')
require("dotenv").config();

const DB_URI = 'mongodb+srv://admin:admin@cluster0.8imeo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
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

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


mongoose.connect(DB_URI)
    .then(() => console.log("✅ Підключено до MongoDB"))
    .catch(err => console.error("❌ Помилка підключення:", err));

server.use(session({
    secret: process.env.SESSION_SECRET || "superset",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: DB_URI }),
    cookie: { secure: false, httpOnly: true }
}));

server.use(passport.initialize());
server.use(passport.session());

server.use("/api", authRoutes, require("./routes/items"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Сервер працює на http://localhost:${PORT}`);
});
