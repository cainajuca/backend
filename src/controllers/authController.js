const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {

        const { email } = req.body;

        // checks if the user's email is already registered
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'This e-mail has already been used.' });

        const user = await User.create(req.body);

        // prevent the password to come back in response
        user.password = undefined;
    
        return res.send({ user });
    } catch(err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});


router.post('/authenticate', async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user)
            return res.status(400).send({ error: 'User not found.' });

        // compara senhas criptografadas
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Invalid password.' })

        // prevent the password to come back in response
        user.password = undefined;

        const token = jwt.sign({ id: user.id }, {  });

        res.send({ user });

    } catch(err) {

        // acertar isso depois

        console.log('erou:');
        console.log(err);
        return res.status(400).send({ error: 'Eroou' });
    }
});


// repassa router para o app com o prefixo /auth
// tds as rotas definidas acima serao entao prefixadas com /auth
module.exports = app => app.use('/auth', router);