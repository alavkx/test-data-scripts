#!/usr/bin/env tsx

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  PageBreak,
  Media,
  ImageRun,
} from "docx";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

// Sample text content for pages
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

// Image file names
const imageFiles = [
  "sample1.png",
  "sample2.png",
  "sample3.png",
  "sample4.png",
  "sample5.png",
];

function generatePageContent(
  pageNumber: number,
  images: { [key: string]: any }
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Page title
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Page ${pageNumber}`,
          bold: true,
          size: 32,
        }),
      ],
      spacing: { after: 400 },
    })
  );

  // Add an image to each page
  const imageIndex = (pageNumber - 1) % imageFiles.length;
  const imageFileName = imageFiles[imageIndex];

  paragraphs.push(
    new Paragraph({
      children: [
        new ImageRun({
          data: images[imageFileName],
          transformation: {
            width: 300,
            height: 225,
          },
        }),
      ],
      spacing: { after: 300 },
    })
  );

  // Generate 2-3 paragraphs per page to fill it up (reduced since we have images now)
  const numParagraphs = 2 + (pageNumber % 2); // Vary between 2-3 paragraphs

  for (let i = 0; i < numParagraphs; i++) {
    const textIndex = (pageNumber + i) % sampleParagraphs.length;
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: sampleParagraphs[textIndex],
            size: 24,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // Add some additional content with different formatting
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Additional content with ",
          size: 24,
        }),
        new TextRun({
          text: "bold formatting",
          bold: true,
          size: 24,
        }),
        new TextRun({
          text: " and ",
          size: 24,
        }),
        new TextRun({
          text: "italic text",
          italics: true,
          size: 24,
        }),
        new TextRun({
          text: ` for variety on page ${pageNumber}.`,
          size: 24,
        }),
      ],
      spacing: { after: 200 },
    })
  );

  return paragraphs;
}

async function generateDocx(): Promise<void> {
  console.log("🚀 Starting DOCX generation...");
  console.log("📄 Target: 500 pages");

  // Load sample images
  console.log("🖼️  Loading sample images...");
  const images: { [key: string]: Buffer } = {};
  for (const imageFile of imageFiles) {
    const imagePath = join(process.cwd(), "images", imageFile);
    images[imageFile] = readFileSync(imagePath);
  }

  // Create sections array - each page will be in a separate section for proper page breaks
  const sections = [];

  // Generate content for 500 pages
  for (let page = 1; page <= 500; page++) {
    if (page % 50 === 0) {
      console.log(`📝 Generated ${page} pages...`);
    }

    // Generate page content
    const pageContent = generatePageContent(page, images);

    // Create a section for each page (this ensures proper page breaks)
    sections.push({
      properties: {
        page: {
          margin: {
            top: 720, // 0.5 inch in twips (20th of a point)
            right: 720,
            bottom: 720,
            left: 720,
          },
        },
      },
      children: pageContent,
    });
  }

  // Create the document with separate sections for each page
  const doc = new Document({
    sections: sections,
  });

  console.log("💾 Generating DOCX file...");

  // Generate and save the document
  const buffer = await Packer.toBuffer(doc);
  const outputPath = join(process.cwd(), "output.docx");

  writeFileSync(outputPath, buffer);

  console.log(`✅ Successfully generated 500-page DOCX file: ${outputPath}`);
  console.log(`📊 File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `🖼️  Each page contains one of ${imageFiles.length} rotating sample images`
  );
}

// Main execution
if (require.main === module) {
  generateDocx().catch((error) => {
    console.error("❌ Error generating DOCX:", error);
    process.exit(1);
  });
}
