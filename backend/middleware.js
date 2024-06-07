const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Substitua por uma chave secreta segura

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Acesso negado. Nenhum token fornecido.');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send('Token inválido.');
        req.user = user;
        next();
    });
};

// Middleware de autorização
const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.perfil)) {
            return res.status(403).send('Acesso negado.');
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorize
};
