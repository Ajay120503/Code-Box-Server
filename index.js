const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;
let codes = require('./CODE.json'); // Make sure to use let, as we are modifying this data

// Use cors middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Get all codes
app.get("/api/codes", (req, res) => {
    return res.json(codes);
});

// Get codes by question
app.get("/api/codes/:question", (req, res) => {
    const question = req.params.question;
    const matchingCodes = codes.filter((item) => item.question === question);
    if (matchingCodes.length > 0) {
        return res.json(matchingCodes);
    } else {
        return res.status(404).json({ message: "Code not found" });
    }
});

// Add new code (POST)
app.post("/api/codes", (req, res) => {
    const { id, slip_no, question, language, code } = req.body;

    if (!id || !slip_no || !question || !language || !code) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const newCode = { id, slip_no, question, language, code };
    codes.push(newCode); // Add new code entry to the array

    return res.status(201).json({ message: "New code added", data: newCode });
});

// Update code by id (PATCH)
app.patch("/api/codes/:id", (req, res) => {
    const { id } = req.params;
    const { slip_no, question, language, code } = req.body;

    // Find the code by id
    const index = codes.findIndex((item) => item.id == id);
    if (index !== -1) {
        // Update the fields that are provided in the request body
        if (slip_no) codes[index].slip_no = slip_no;
        if (question) codes[index].question = question;
        if (language) codes[index].language = language;
        if (code) codes[index].code = code;

        return res.json({ message: "Code updated", data: codes[index] });
    } else {
        return res.status(404).json({ message: "Code not found" });
    }
});

// Delete code by id (DELETE)
app.delete("/api/codes/:id", (req, res) => {
    const { id } = req.params;

    // Find the code by id and remove it from the array
    const index = codes.findIndex((item) => item.id == id);
    if (index !== -1) {
        const deletedCode = codes.splice(index, 1); // Remove the code from the array
        return res.json({ message: "Code deleted", data: deletedCode });
    } else {
        return res.status(404).json({ message: "Code not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is working on port http://localhost:${PORT}/api/codes`);
});
