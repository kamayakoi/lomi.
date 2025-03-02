import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());


// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "..", "..", "dist")));

// Handle all other routes by serving the index.html file
app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "dist", "index.html"));
});

app.listen(4242, () => console.log("Node server listening on port 4242! Visit http://localhost:4242 in your browser."));
