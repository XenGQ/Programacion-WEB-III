const models = require('../models/indice');
const User = models.User;
const { passwordStrength } = require('../utils/validadores');

const login = async (req, res) => {
  const { username, password, captcha } = req.body;
  
  console.log('Login attempt:', { username, captcha, sessionCaptcha: req.session.captcha }); // Debug log
  
  //Captcha verificacion// 
  if (!req.session.captcha) {
    return res.status(400).json({ message: 'Captcha no inicializado. Recarga la página.' });
  }
  
  const expectedCode = String(req.session.captcha).trim();
  const userCode = String(captcha).trim();
  
  if (userCode !== expectedCode) {
    console.log('Captcha mismatch:', { expected: expectedCode, received: userCode });
    return res.status(400).json({ message: 'Código incorrecto. Intenta de nuevo.' });
  }
  
  delete req.session.captcha;

 //Verificacion de usuarios// 

  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

  const ok = await user.verifyPassword(password);
  if (!ok) return res.status(401).json({ message: 'Contraseña incorrecta' });

  req.session.user = { id: user.id, username: user.username, role: user.role };
  res.json({ message: 'Login OK', user: req.session.user });
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Sesión cerrada' });
  });
};

const getCaptcha = (req, res) => {
  //Generacion del captcha//
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  
  req.session.captcha = code;
  req.session.captchaTime = Date.now();
  
  console.log('Captcha generated:', code);
  
  res.json({ 
    success: true,
    code: code, 
    message: 'Ingresa los 4 dígitos que ves'
  });
};

const registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Usuario y contraseña requeridos' });

  const strength = passwordStrength(password);
  if (strength === 'weak') return res.status(400).json({ message: 'Contraseña demasiado débil' });

  const exists = await User.findOne({ where: { username } });
  if (exists) return res.status(400).json({ message: 'Usuario ya existe' });

  const user = await User.create({ username, passwordHash: password, role: role === 'admin' ? 'admin' : 'operador' });
  res.status(201).json({ message: 'Usuario creado', user: { id: user.id, username: user.username, role: user.role } });
};

module.exports = { login, logout, getCaptcha, registerUser };
