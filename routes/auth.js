const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Item = require("../models/Item"); // Додаємо Item
const router = express.Router();

// Отримати всіх користувачів
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Використання Mongoose замість MongoDB Driver
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send("Заповніть всі поля");

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send("Користувач вже існує");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });

        await user.save();
        res.redirect(`/login`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Помилка при створенні користувача");
    }
});

router.post('/login', passport.authenticate("local", {
    successRedirect: '/protected',
    failureRedirect: '/login',
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// CRUD операції для `items`
router.post('/items', async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json({ message: 'Документ додано', item });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

router.get('/items', async (req, res) => {
    try {
        const items = await Item.find({}, { name: 1, price: 1 });
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// Отримання всіх елементів через курсор
router.get("/items/cursor", async (req, res) => {
    try {
        const cursor = Item.find().cursor();
        let items = [];

        for await (const doc of cursor) {
            items.push(doc);
        }

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/items/stats", async (req, res) => {
    try {
        const stats = await Item.aggregate([
            {
                $group: {
                    _id: "$category",
                    avgPrice: { $avg: "$price" },
                    totalItems: { $sum: 1 },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
        ]);

        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
