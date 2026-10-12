# PulmoAI

Web application for screening Tuberculosis (TB) from chest X-ray images using transfer learning with MobileNetV2.

## Overview

PulmoAI classifies chest radiographs into Normal or Tuberculosis cases. The system pairs a lightweight fine-tuned MobileNetV2 model with a Flask REST API and a React frontend.

- Architecture: MobileNetV2 backbone (ImageNet pre-trained) with custom classification head (GlobalAveragePooling2D, Dense, Dropout).
- Input: 224x224 RGB chest X-ray image.
- Model Size: ~9MB (optimized for low-latency CPU inference).
- Validation Accuracy: ~99.65%.

## Tech Stack

- Backend: Python 3.10+, Flask, TensorFlow, Pillow, python-magic, Flask-Limiter, Flask-Talisman
- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Axios
- Model: Keras / MobileNetV2

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

Server runs on `http://127.0.0.1:5000`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Client runs on `http://localhost:5173`.

## API Reference

### POST `/predict` (or `/api/predict`)

Uploads an X-ray image for diagnosis.

- Content-Type: `multipart/form-data`
- Body Parameter: `file` (image format: JPEG or PNG, max 10MB)
- Rate Limit: 10 requests per minute

#### Response (200 OK)

```json
{
  "label": "Tuberculosis",
  "confidence": "98.40%",
  "raw_score": 0.984012,
  "message": "Analysis successful"
}
```

#### Error Response (400 / 500)

```json
{
  "error": "File extension not allowed: text/plain"
}
```

## Repository Structure

```text
PulmoAI/
├── ai-model/           # Model training scripts and pipeline
│   └── training-model.py
├── backend/            # Flask REST API and saved weights
│   ├── app.py
│   ├── tb_model.h5
│   └── requirements.txt
├── frontend/           # Vite + React client
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Disclaimer

This software is an educational and research prototype. It is not certified for clinical diagnostic use and must not replace evaluation by a qualified medical professional.
