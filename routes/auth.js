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

router.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Це захищенний марщрут!');
    }else {
        res.redirect('/login');
    }
})

module.exports = router;