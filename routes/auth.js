const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/User');

//Реєстрація
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Заповніть всі поля");

    const existingUser = await User.findOne({ email });
    if (existingUser) return  res.status(400).send("Користувач вже існує");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });

    await user.save();
    res.redirect(`/login`);
});

//Вхід
router.post('/login', passport.authenticate("local",{
    successRedirect: '/protected',
    failureRedirect: '/login',
    failureFlash: true,
}));

//Вихід
router.get('/logout', (req, res) => {
    req.logout(err =>{
        if(err) return res.status(500).send("Помилка виходу");
        res.redirect('/');
    });
});

router.get('/', (req, res) => {
    res.send('Це корньовий роут');

})
// 🟢 Створення одного документа
router.post('/items', async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json({ message: 'Документ додано', item });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🟢 Створення кількох документів
router.post('/items/many', async (req, res) => {
    try {
        const items = await Item.insertMany(req.body);
        res.status(201).json({ message: 'Документи додано', items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🟡 Оновлення одного документа
router.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.updateOne({ _id: req.params.id }, { $set: req.body });
        res.json({ message: 'Документ оновлено', updatedItem });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🟡 Оновлення багатьох документів
router.put('/items', async (req, res) => {
    try {
        const result = await Item.updateMany(req.body.filter, { $set: req.body.update });
        res.json({ message: 'Документи оновлено', result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🔵 Заміна документа
router.put('/items/replace/:id', async (req, res) => {
    try {
        const replacedItem = await Item.replaceOne({ _id: req.params.id }, req.body);
        res.json({ message: 'Документ замінено', replacedItem });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🔴 Видалення одного документа
router.delete('/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.deleteOne({ _id: req.params.id });
        res.json({ message: 'Документ видалено', deletedItem });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🔴 Видалення багатьох документів
router.delete('/items', async (req, res) => {
    try {
        const result = await Item.deleteMany(req.body);
        res.json({ message: 'Документи видалено', result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🟢 Читання даних
router.get('/items', async (req, res) => {
    try {
        const items = await Item.find({}, { name: 1, price: 1 }); // Використання проекції
        res.json(items);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.use('/api', router);


module.exports = router;