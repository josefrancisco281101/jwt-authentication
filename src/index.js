import express from 'express';
import jwt from 'jsonwebtoken';


const app = express();
const PORT = 3000;

app.use(express.json());

const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

const JWT_SECRET = '281101';
const TOKEN_EXPIRATION_TIME = '30m'; 

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION_TIME });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: 'usuario o clave incorrecta' });
    }
});

app.get('/verify', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ message: 'Token is valid', decoded });
    } catch (err) {
        return res.status(401).json({ message: 'Token is invalid or has expired' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
