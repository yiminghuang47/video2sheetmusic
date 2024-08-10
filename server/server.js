import express from "express";
import cors from "cors";
import multer from "multer";
import { spawnSync } from "child_process";

import { spawn } from "child_process";
import bodyParser from "body-parser";
import { generateUploadURL } from "./s3.js";

const PORT = process.env.PORT || 5050;
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "videos/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage });



app.options('*', cors())
var corsOptions = {
    origin: "*",
};
app.use(cors(corsOptions));

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://extract-sheet-music-from-video.vercel.app/"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Testing ok");
});

app.get("/s3Url", async (req, res) => {
    const url = await generateUploadURL();

    res.send({ url });
});



app.post("/upload-local", upload.single("file"), async (req, res) => {
    try {
        const regions = JSON.parse(req.body.regions);
        const { x, y, width, height } = regions[0];
        const Y0 = y;
        const Y1 = y + height;
        const X0 = x;
        const X1 = x + width;

        if (!req.file) {
            return res.status(400).send({ error: "No file uploaded" });
        }

        const pythonProcess = spawn("python", [
            "script.py",
            req.file.path,
            X0,
            Y0,
            X1,
            Y1,
        ]);

        let stdoutData = [];
        let stderrData = [];

        pythonProcess.stdout.on("data", (data) => {
            stdoutData.push(data);
        });

        pythonProcess.stderr.on("data", (data) => {
            stderrData.push(data);
        });

        pythonProcess.on("close", async (code) => {
            if (code !== 0) {
                const stderrOutput = Buffer.concat(stderrData).toString();
                return res.status(500).send({ error: "Error executing python script", details: stderrOutput });
            }

            const output = Buffer.concat(stdoutData);
            if (output.length === 0) {
                return res.status(500).send({ error: "No PDF generated" });
            }

            res.setHeader("Content-Type", "application/pdf");
            res.send(output);
        });
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error", details: error.message });
    }
});


app.post("/upload-s3", async (req, res) => {
    try {
        const regions = JSON.parse(req.body.regions);
        const { x, y, width, height } = regions[0];
        const Y0 = y;
        const Y1 = y + height;
        const X0 = x;
        const X1 = x + width;

        const videoUrl = req.body.videoUrl;

        const pythonProcess = spawn("python", [
            "script.py",
            videoUrl,
            X0,
            Y0,
            X1,
            Y1,
        ]);

        let stdoutData = [];
        let stderrData = [];

        pythonProcess.stdout.on("data", (data) => {
            stdoutData.push(data);
        });

        pythonProcess.stderr.on("data", (data) => {
            stderrData.push(data);
        });

        pythonProcess.on("close", async (code) => {
            if (code !== 0) {
                const stderrOutput = Buffer.concat(stderrData).toString();
                return res.status(500).send({ error: "Error executing python script", details: stderrOutput });
            }

            const output = Buffer.concat(stdoutData);
            if (output.length === 0) {
                return res.status(500).send({ error: "No PDF generated" });
            }

            res.setHeader("Content-Type", "application/pdf");
            res.send(output);
        });
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error", details: error.message });
    }
});

app.post("/youtube-upload", async (req, res) => {
    try {
        const url = req.body.url;
        const regions = JSON.parse(req.body.regions);
        const { x, y, width, height } = regions[0];
        const Y0 = y;
        const Y1 = y + height;
        const X0 = x;
        const X1 = x + width;

        const pythonProcess = spawn("python", [
            "script_youtube.py",
            url,
            X0,
            Y0,
            X1,
            Y1,
        ]);

        let stdoutData = [];
        let stderrData = [];

        pythonProcess.stdout.on("data", (data) => {
            stdoutData.push(data);
        });

        pythonProcess.stderr.on("data", (data) => {
            stderrData.push(data);
        });

        pythonProcess.on("close", async (code) => {
            if (code !== 0) {
                const stderrOutput = Buffer.concat(stderrData).toString();
                return res.status(500).send({ error: "Error executing python script", details: stderrOutput });
            }

            const output = Buffer.concat(stdoutData);
            if (output.length === 0) {
                return res.status(500).send({ error: "No PDF generated" });
            }

            res.setHeader("Content-Type", "application/pdf");
            res.send(output);
        });
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error", details: error.message });
    }
});
// start the Express server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
