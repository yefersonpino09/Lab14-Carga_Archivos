
const express = require('express');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Validar el tipo de archivo
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no admitido. Solo se admiten imágenes JPEG o PNG.'));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // Límite de 5 MB
  }
});

app.post('/upload', upload.array('file', 3), (req, res) => {
  // Verificar si hay errores de validación
  if (req.fileValidationError) {
    return res.status(400).send(req.fileValidationError.message);
  }

  // Obtener detalles de los archivos cargados
  const filesInfo = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    mimetype: file.mimetype
  }));

  res.send(filesInfo);
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
