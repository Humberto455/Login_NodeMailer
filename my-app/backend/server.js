const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // Asegúrate de importar bcrypt

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

// Configuración de nodemailer con el correo de Google
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usamos el servicio de Gmail
  auth: {
    user: 'craptor455@gmail.com',
    pass: 'miah ndag xhsq gltj' // Aquí deberías usar una contraseña de aplicación, no tu contraseña de Gmail
  }
});

// Función para enviar correos de verificación
const sendVerificationEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'craptor455@gmail.com',
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};

// Endpoint para solicitar la recuperación de contraseña
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email }, 'secretKey', { expiresIn: '1h' });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  const subject = 'Restablecimiento de contraseña';
  const text = `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`;

  sendVerificationEmail(email, subject, text)
    .then(() => {
      res.status(200).json({ message: 'Correo de restablecimiento enviado' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error al enviar el correo' });
    });
});

// Función para validar la contraseña
const validatePassword = (password) => {
  // Expresión regular para validar la contraseña
  const regex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
  return regex.test(password);
};

// Endpoint para registrar usuarios
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Validar la contraseña
  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'La contraseña debe contener al menos 8 caracteres, 1 mayúscula y 1 número' });
  }

  try {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Endpoint para restablecer la contraseña
app.post('/api/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  // Validar la nueva contraseña
  if (!validatePassword(newPassword)) {
    return res.status(400).json({ message: 'La contraseña debe contener al menos 8 caracteres, 1 mayúscula y 1 número' });
  }

  jwt.verify(token, 'secretKey', async (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const email = decoded.email;
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Encripta la nueva contraseña

      const query = 'UPDATE users SET password = ? WHERE username = ?';
      db.query(query, [hashedPassword, email], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error al restablecer la contraseña' });
        }
        res.status(200).json({ message: 'Contraseña restablecida correctamente' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });
});


// Endpoint para iniciar sesión
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    if (results.length > 0) {
      const user = results[0];
      if (bcrypt.compareSync(password, user.password)) {
        res.json({ message: 'Inicio de sesión exitoso' });
      } else {
        res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
