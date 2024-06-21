import express from "express";
import cors from "cors";
import multer from "multer";
import { spawnSync } from "child_process";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 5050;
const app = express();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), (req, res) => {
  
  const regions = JSON.parse(req.body.regions);
  const {x,y,width,height} = regions[0]
  const Y0 = y;
  const Y1 = y+height;
  const X0 = x;
  const X1 = x+width;
  console.log(X0 + " " + Y0 + " " + X1 + " " + Y1) 
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  console.log(req.file.path);
  const pythonProcess = spawnSync('python', ['script.py', req.file.path, X0, Y0, X1, Y1]);

  if (pythonProcess.error) {
    console.error(`Error executing python script: ${pythonProcess.error.message}`);
    return res.status(500).send({ error: 'Error executing python script' });
  }

  const output = pythonProcess.stdout.toString().trim();
  console.log(output);
  res.json({ output: output });
});


app.post('/youtube-upload',  (req, res) => {

  
  const url = req.body.url
  const regions = req.body.regions;
  const {x,y,width,height} = regions[0]
  const Y0 = y;
  const Y1 = y+height;
  const X0 = x;
  const X1 = x+width;
  console.log(X0 + " " + Y0 + " " + X1 + " " + Y1) 
  
  console.log(url);
  
  const pythonProcess = spawnSync('python', ['script_youtube.py', url, X0, Y0, X1, Y1]);

  if (pythonProcess.error) {
    console.error(`Error executing python script: ${pythonProcess.error.message}`);
    return res.status(500).send({ error: 'Error executing python script' });
  }

  const output = pythonProcess.stdout.toString().trim();
  console.log(output);
  res.json({ output: output });
  
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
