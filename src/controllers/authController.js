const express = require('express');

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

// repassa router para o app com o prefixo /auth
// tds as rotas definidas acima serao entao prefixadas com /auth
module.exports = app => app.use('/auth', router);