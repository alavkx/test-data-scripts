#!/usr/bin/env tsx

import { jsPDF } from "jspdf";
import { readFileSync } from "fs";
import { join } from "path";

// Sample text content for pages (same as DOCX version)
const sampleParagraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
  "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
  "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
];

// Image file names (same as DOCX version)
const imageFiles = [
  "sample1.png",
  "sample2.png",
  "sample3.png",
  "sample4.png",
  "sample5.png",
];

interface LoadedImage {
  data: string; // base64 data
  format: string;
}

function loadImageAsBase64(imagePath: string): LoadedImage {
  const imageBuffer = readFileSync(imagePath);
  const base64 = imageBuffer.toString("base64");
  const format = imagePath.toLowerCase().endsWith(".png") ? "PNG" : "JPEG";
  return { data: base64, format };
}

function wrapText(text: string, maxWidth: number, doc: jsPDF): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth =
      (doc.getStringUnitWidth(testLine) * doc.getFontSize()) /
      doc.internal.scaleFactor;

    if (textWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function generatePageContent(
  doc: jsPDF,
  pageNumber: number,
  images: { [key: string]: LoadedImage }
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36; // 0.5 inch margin (72 points per inch / 2)
  const maxWidth = pageWidth - margin * 2;

  let currentY = margin + 20;

  // Page title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`Page ${pageNumber}`, margin, currentY);
  currentY += 25;

  // Add an image to each page
  const imageIndex = (pageNumber - 1) % imageFiles.length;
  const imageFileName = imageFiles[imageIndex];
  const image = images[imageFileName];

  if (image) {
    const imageWidth = 120; // 120 points width
    const imageHeight = 90; // 90 points height
    const imageX = margin;

    try {
      doc.addImage(
        image.data,
        image.format,
        imageX,
        currentY,
        imageWidth,
        imageHeight
      );
      currentY += imageHeight + 20;
    } catch (error) {
      console.warn(
        `Failed to add image ${imageFileName} to page ${pageNumber}:`,
        error
      );
      currentY += 20;
    }
  }

  // Generate 2-3 paragraphs per page to fill it up
  const numParagraphs = 2 + (pageNumber % 2); // Vary between 2-3 paragraphs

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  for (let i = 0; i < numParagraphs; i++) {
    if (currentY > pageHeight - 100) break; // Stop if we're running out of space

    const textIndex = (pageNumber + i) % sampleParagraphs.length;
    const paragraphText = sampleParagraphs[textIndex];

    const wrappedLines = wrapText(paragraphText, maxWidth, doc);

    for (const line of wrappedLines) {
      if (currentY > pageHeight - 50) break; // Stop if we're running out of space
      doc.text(line, margin, currentY);
      currentY += 15; // Line spacing
    }

    currentY += 10; // Paragraph spacing
  }

  // Add additional content with formatting variety
  if (currentY < pageHeight - 100) {
    doc.setFont("helvetica", "normal");
    doc.text("Additional content with ", margin, currentY);

    const normalTextWidth =
      (doc.getStringUnitWidth("Additional content with ") * doc.getFontSize()) /
      doc.internal.scaleFactor;

    doc.setFont("helvetica", "bold");
    doc.text("bold formatting", margin + normalTextWidth, currentY);

    const boldTextWidth =
      (doc.getStringUnitWidth("bold formatting") * doc.getFontSize()) /
      doc.internal.scaleFactor;

    doc.setFont("helvetica", "normal");
    doc.text(" and ", margin + normalTextWidth + boldTextWidth, currentY);

    const andTextWidth =
      (doc.getStringUnitWidth(" and ") * doc.getFontSize()) /
      doc.internal.scaleFactor;

    doc.setFont("helvetica", "italic");
    doc.text(
      "italic text",
      margin + normalTextWidth + boldTextWidth + andTextWidth,
      currentY
    );

    const italicTextWidth =
      (doc.getStringUnitWidth("italic text") * doc.getFontSize()) /
      doc.internal.scaleFactor;

    doc.setFont("helvetica", "normal");
    doc.text(
      ` for variety on page ${pageNumber}.`,
      margin + normalTextWidth + boldTextWidth + andTextWidth + italicTextWidth,
      currentY
    );
  }
}

async function generatePdf(): Promise<void> {
  console.log("🚀 Starting PDF generation...");
  console.log("📄 Target: 500 pages");

  // Load sample images
  console.log("🖼️  Loading sample images...");
  const images: { [key: string]: LoadedImage } = {};
  for (const imageFile of imageFiles) {
    try {
      const imagePath = join(process.cwd(), "images", imageFile);
      images[imageFile] = loadImageAsBase64(imagePath);
    } catch (error) {
      console.warn(`Failed to load image ${imageFile}:`, error);
    }
  }

  // Create PDF document with Letter size (8.5" x 11")
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  // Generate content for 500 pages
  for (let page = 1; page <= 500; page++) {
    if (page % 50 === 0) {
      console.log(`📝 Generated ${page} pages...`);
    }

    // Add a new page (except for the first page)
    if (page > 1) {
      doc.addPage();
    }

    // Generate page content
    generatePageContent(doc, page, images);
  }

  console.log("💾 Generating PDF file...");

  // Generate and save the document
  const outputPath = join(process.cwd(), "output.pdf");
  doc.save(outputPath);

  console.log(`✅ Successfully generated 500-page PDF file: ${outputPath}`);

  // Estimate file size (jsPDF doesn't provide direct buffer access for size calculation)
  try {
    const fs = require("fs");
    const stats = fs.statSync(outputPath);
    console.log(`📊 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.log(
      "📊 File generated successfully (size calculation unavailable)"
    );
  }

  console.log(
    `🖼️  Each page contains one of ${imageFiles.length} rotating sample images`
  );
}

// Main execution
if (require.main === module) {
  generatePdf().catch((error) => {
    console.error("❌ Error generating PDF:", error);
    process.exit(1);
  });
}
