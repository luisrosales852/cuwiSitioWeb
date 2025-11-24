# Quiz Question Generator

A React-based web application that generates customizable quiz questions from PDF documents. Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## Features

- PDF upload and processing
- Content chunking and selection
- Configurable question generation based on:
  - Educational level (Elementary, Middle, High School)
  - Bloom's Taxonomy levels
  - Depth of Knowledge (DOK)
  - Question types (Multiple choice, Open text, True/False, Numerical)
- Interactive quiz view with answer input
- PDF export functionality for exams

## Prerequisites

- Node.js (version 16 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone or download this repository

2. Navigate to the project directory:
my-react-app

3. Install dependencies:
npm install

## Running the Application

Start the development server:
npm run dev

The application will be available at a local host

## Dependencies

### Production Dependencies
- **react** (^19.2.0) - UI library
- **react-dom** (^19.2.0) - React rendering for web
- **@tailwindcss/vite** (^4.1.17) - Tailwind CSS Vite plugin
- **jspdf** (^3.0.3) - PDF generation library

### Development Dependencies
- **vite** (^7.2.2) - Build tool and dev server
- **typescript** (~5.9.3) - Type checking
- **tailwindcss** (^4.1.17) - Utility-first CSS framework
- **eslint** (^9.39.1) - Code linting
- Plus TypeScript types and ESLint plugins

## Data Flow Architecture

This application follows React's **unidirectional data flow** pattern with **lifted state** management:

### Component Hierarchy
```
App
└── Home
    └── PDFUpload (main state container)
        ├── Snackbar
        ├── ChunkCard (multiple instances)
        ├── QuestionForm
        └── QuizView
            └── QuestionDisplay
```

### How Data Flows Between Components

#### 1. State Management (Top-Down)
The **PDFUpload** component acts as the central state container and manages:
- `selectedFile` - The uploaded PDF file
- `chunks` - PDF content split into selectable chunks
- `selectedChunkIds` - User's chunk selections
- `generatedQuestions` - Questions created from selected chunks
- `currentFormData` - Question generation configuration
- `showQuizView` - View state (form vs quiz)

#### 2. Props Flow (Parent → Child)
Data flows down through props:

**PDFUpload → ChunkCard:**
```typescript
<ChunkCard
  chunk={chunkData}           // Individual chunk data
  isSelected={boolean}         // Selection state
  onToggle={callback}          // Selection handler
/>
```

**PDFUpload → QuestionForm:**
```typescript
<QuestionForm
  selectedChunks={Chunk[]}     // Selected content chunks
  onSubmit={callback}          // Form submission handler
  isGenerating={boolean}       // Loading state
  questionsGenerated={boolean} // Enable "Go to Quiz" button
  onGoToQuiz={callback}        // Navigate to quiz view
/>
```

**PDFUpload → QuizView:**
```typescript
<QuizView
  questions={Question[]}       // Generated questions
  formData={QuestionFormData}  // Original form configuration
  onBack={callback}            // Return to form view
/>
```

#### 3. Callback Flow (Child → Parent)
Child components communicate back through callback props:

1. **ChunkCard** calls `onToggle(chunkId)` when user selects/deselects a chunk
2. **QuestionForm** calls:
   - `onSubmit(formData)` when generating questions
   - `onGoToQuiz()` when navigating to quiz view
3. **QuizView** calls `onBack()` to return to the form

#### 4. Data Transformation Pipeline
```
PDF Upload
    ↓
Process File → Load Chunks (from mock data)
    ↓
User Selects Chunks
    ↓
User Configures Settings (QuestionForm)
    ↓
Generate Questions (questionService)
    ↓
Display Quiz (QuizView)
    ↓
Download PDF (pdfService)
```

### Key Design Patterns

**Lifting State Up:**
All shared state lives in PDFUpload rather than being scattered across child components. This ensures a single source of truth.

**Controlled Components:**
Form inputs in QuestionForm are controlled by React state, with values flowing down and change handlers flowing up.

**Props as Contract:**
TypeScript interfaces define the exact shape of data passed between components:
- `Chunk` - PDF content fragment
- `QuestionFormData` - User's configuration choices
- `Question` - Generated question with options and answer
- `QuestionConfiguration` - Question type settings

**Conditional Rendering:**
The PDFUpload component conditionally renders either the QuestionForm or QuizView based on `showQuizView` state.

## Project Structure

```
src/
├── components/
│   ├── PDFUpload.tsx      # Main container component
│   ├── ChunkCard.tsx      # Displays individual content chunk
│   ├── QuestionForm.tsx   # Question generation settings
│   ├── QuizView.tsx       # Quiz interface
│   ├── QuestionDisplay.tsx # Answer key display
│   └── Snackbar.tsx       # Notification component
├── pages/
│   └── Home.tsx           # Landing page
├── services/
│   ├── questionService.ts # Question generation logic
│   └── pdfService.ts      # PDF export functionality
├── types/
│   └── index.ts           # TypeScript type definitions
├── mock/
│   └── chunks.json        # Mock PDF chunk data
├── App.tsx                # Root component
├── main.tsx               # React entry point
└── index.css              # Tailwind CSS import
```

## Technology Stack

- **React 19** - Latest React with new JSX transform (no need to import React)
- **TypeScript 5.9** - Type safety with strict mode enabled
- **Vite 7** - Fast build tool with HMR
- **Tailwind CSS v4** - Utility-first styling with Vite plugin
- **jsPDF** - Client-side PDF generation

## Notes

- Currently uses mock data for PDF processing (see `src/mock/chunks.json`)
- Question generation uses mock service (`questionService.ts`)
- No routing - single page application
- No backend integration - fully client-side
- Could add context for state management

