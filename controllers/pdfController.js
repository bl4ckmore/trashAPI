const fs = require("fs");
const path = require("path");
const pool = require("../db");
const pdfParse = require("pdf-parse");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

const replaceTextInPDF = async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { searchText, replaceText } = req.body;
    if (!searchText || !replaceText) {
      return res.status(400).json({ message: "Missing search or replace text" });
    }

    const pdfBuffer = req.files.pdf.data;
    const parsed = await pdfParse(pdfBuffer);
    let textContent = parsed.text;

    if (!textContent.includes(searchText)) {
      return res.status(400).json({ message: "Text not found in PDF" });
    }

    const modifiedText = textContent.replace(new RegExp(searchText, "g"), replaceText);
    const lines = modifiedText.split(/\r?\n/);

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const lineHeight = 18;
    const margin = 30;
    const maxLinesPerPage = 40;

    let page = pdfDoc.addPage();
    let { height } = page.getSize();
    let y = height - margin;
    let lineCount = 0;

    for (const line of lines) {
      if (lineCount >= maxLinesPerPage) {
        page = pdfDoc.addPage();
        y = height - margin;
        lineCount = 0;
      }

      page.drawText(line, {
        x: margin,
        y: y - lineHeight * lineCount,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      lineCount++;
    }

    const updatedPdfBytes = await pdfDoc.save();
    const filename = `updated-${Date.now()}.pdf`;
    const outputDir = path.join(__dirname, "..", "updated_pdfs");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, updatedPdfBytes);

    await pool.query(
      "INSERT INTO pdf_logs(user_id, filename, search, replace) VALUES ($1, $2, $3, $4)",
      [req.user.id, filename, searchText, replaceText]
    );

    res.json({ message: "✅ PDF text replaced successfully", filename });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Error processing PDF", error: error.message });
  }
};

const extractTextFromPDF = async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdfBuffer = req.files.pdf.data;
    const parsed = await pdfParse(pdfBuffer);
    res.json({ text: parsed.text });
  } catch (error) {
    console.error("❌ Extract Text Error:", error);
    res.status(500).json({ message: "Error extracting text", error: error.message });
  }
};

module.exports = {
  replaceTextInPDF,
  extractTextFromPDF,
};
