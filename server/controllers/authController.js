const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client('140471774782-jud41o6q20iqrk4as0b0psjcndeobsut.apps.googleusercontent.com');

const googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    // Проверяем токен Google с помощью OAuth2Client
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: '140471774782-jud41o6q20iqrk4as0b0psjcndeobsut.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Ищем пользователя в базе данных по email
    let user = await User.findOne({ email });

    // Если пользователь не существует, создаем нового пользователя
    if (!user) {
      user = new User({ email, password: 'defaultPassword', googleAuth: true });
      await user.save();
    }

    // Генерация JWT токена для авторизованного пользователя
    const token = jwt.sign({ userId: user._id }, "jwt_secret", {
      expiresIn: '1h',
    });

    // Отправляем токен и email на клиентскую сторону
    res.json({ token, email });
  } catch (error) {
    console.error('Error during Google authentication', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Проверяем, если пользователь с таким email уже существует
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Создаем нового пользователя
    const user = new User({ email, password });

    // Сохраняем пользователя в базе данных
    await user.save();

    // Генерация JWT токена
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Отправляем токен на клиентскую сторону
    res.status(201).json({ token, email });
  } catch (error) {
    console.error('Error during registration', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, 'jwt_secret', { expiresIn: '30d' });

    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

module.exports = { registerUser, loginUser, googleAuth };
