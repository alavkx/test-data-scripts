# DOCX Generator

A TypeScript script that generates a 500-page DOCX file using the `docx` library with proper page breaks and images.

## Features

- ✅ Generates exactly 500 pages with **proper page breaks**
- 🖼️ **Images on every page** - 5 rotating sample images
- 📝 Variable content with Lorem ipsum text
- 🎨 Mixed formatting (bold, italic, different sizes)
- ⚡ Fast generation with progress indicators
- 🔧 Executable with `tsx` (TypeScript executor)
- 📄 Each page in separate section for proper page separation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup

1. **Install dependencies:**

```bash
npm install
```

_(Sample images are already included in the repository)_

## Usage

### Method 1: Using npm script

```bash
npm run generate
```

### Method 2: Direct execution with tsx

```bash
npx tsx generate-docx.ts
```

### Method 3: Make executable and run directly

```bash
chmod +x generate-docx.ts
./generate-docx.ts
```

## Output

The script will generate a file named `output.docx` in the current directory containing:

- **500 pages of content with proper page breaks**
- **At least one image per page** (5 different colored sample images rotating)
- Varied paragraph content using Lorem ipsum text
- Different text formatting for visual appeal
- Page titles and structured content
- File size: ~2.3 MB (with images)

## File Structure

```
├── package.json          # Dependencies and scripts
├── generate-docx.ts      # Main TypeScript script
├── images/              # Directory containing sample images
│   ├── sample1.png      # Blue sample image
│   ├── sample2.png      # Red sample image
│   ├── sample3.png      # Green sample image
│   ├── sample4.png      # Orange sample image
│   └── sample5.png      # Purple sample image
├── output.docx          # Generated 500-page document
└── README.md            # This file
```

## Dependencies

- `docx`: Library for creating and manipulating DOCX files
- `tsx`: TypeScript executor for Node.js
- `typescript`: TypeScript compiler
- `@types/node`: Node.js type definitions
- `canvas`: For generating sample images programmatically

## Customization

You can modify the script to:

- Change the number of pages (modify the loop condition in `generateDocx`)
- Adjust content per page (modify `generatePageContent` function)
- Change formatting and styling
- Replace sample images with your own (in `images/` directory)
- Customize image placement and sizing
- Add headers, footers, or other document elements

## Technical Details

- **Page breaks**: Each page is created as a separate section to ensure proper page separation
- **Images**: 5 rotating sample images (400x300px) are generated and embedded
- **Performance**: Includes progress indicators every 50 pages for large documents
- **File size**: ~2.3 MB for 500 pages with images
