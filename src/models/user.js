const mongoose = require('../database');
const bcrypt = require('bcryptjs');

// campos da tabela de usuários do banco de dados
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    birthDate: {
        type: Date,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
});


UserSchema.pre('save', async function(next) {

    // concatena à esquerda da senha varios caracteres alem de encriptar a mesma.
    const hash = await bcrypt.hash(this.password, 10);

    // agora a senha a ser guardada no bando de dados é a encriptada
    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;