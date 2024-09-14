const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/api/upload', upload.single('image'), async (req, res) => {
  const degree = parseInt(req.body.degree);  
  try {
   
    const rotatedImage = await sharp(req.file.buffer)
      .rotate(degree)
      .toBuffer();

   
    res.set('Content-Type', 'image/png');
    res.send(rotatedImage);
  } catch (error) {
    res.status(500).json({ message: 'Error processing image' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
