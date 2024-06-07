const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorize } = require('../middleware');
const secretKey = 'your_secret_key'; // Substitua por uma chave secreta segura

// Criar novo usuário
router.post('/', authenticateToken, authorize(['administrativo']), async (req, res) => {
    const { nome, email, senha, perfil } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);
    const newUser = new User({ nome, email, senha: hashedSenha, perfil });
    try {
        await newUser.save();
        res.status(201).send('Usuário criado com sucesso');
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        res.status(400).send(err);
    }
});

// Rota de login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    console.log(`Tentativa de login para o email: ${email}`);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error('Usuário não encontrado');
            return res.status(400).json({ success: false, message: 'Credenciais inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            console.error('Senha inválida');
            return res.status(400).json({ success: false, message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user._id, perfil: user.perfil }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    } catch (err) {
        console.error('Erro durante o login:', err);
        res.status(500).send(err);
    }
});

// Rota para obter informações do usuário autenticado
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Listar todos os usuários (proteção de rota aplicada)
router.get('/', authenticateToken, authorize(['administrativo']), async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Obter um usuário específico (proteção de rota aplicada)
router.get('/:id', authenticateToken, authorize(['administrativo']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Atualizar usuário (proteção de rota aplicada)
router.put('/:id', authenticateToken, authorize(['administrativo']), async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send('Usuário atualizado com sucesso');
    } catch (err) {
        res.status(400).send(err);
    }
});

// Deletar usuário (proteção de rota aplicada)
router.delete('/:id', authenticateToken, authorize(['administrativo']), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send('Usuário deletado com sucesso');
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
