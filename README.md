# 🫁 PulmoAI - Intelligent Tuberculosis Detection System

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)
![TensorFlow](https://img.shields.io/badge/AI%20Core-MobileNetV2-orange?logo=tensorflow&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Accuracy](https://img.shields.io/badge/Model%20Accuracy-99.65%25-brightgreen)

**PulmoAI** is a robust full-stack web application designed to assist in the early detection of **Tuberculosis (TB)** from Chest X-Ray images. It leverages a transfer-learning approach using **MobileNetV2**, optimized for high accuracy and low latency deployment.

---

## 🚀 Key Features

* **High-Performance AI:** Utilizing **MobileNetV2** architecture, achieved **99.65% Validation Accuracy** and **100% Training Accuracy**.
* **Real-time Analysis:** Inference time < 200ms on standard CPUs.
* **Modern Stack:** Decoupled architecture with a React (Vite) frontend and Flask REST API backend.
* **Security Aware:** Implemented strict file type validation and environment isolation to prevent common web vulnerabilities.
* **Deployment Ready:** Optimized model size (~9MB) suitable for edge deployment.

## 🏗️ Tech Stack Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + TypeScript + Vite | Responsive UI with TailwindCSS for styling. |
| **Backend** | Flask (Python) | RESTful API to handle image uploads and model inference. |
| **AI Engine** | TensorFlow / Keras | MobileNetV2 (Pre-trained on ImageNet, Fine-tuned for TB). |
| **Data Processing** | NumPy & Pillow | Image preprocessing and tensor conversion. |

---

## 🛠️ Installation & Setup Guide

Follow these steps to run the project locally.

### Prerequisites
* Python 3.8+
* Node.js & npm
* Git

### 1. Clone Repository
```bash
git clone [https://github.com/darflashxd/PulmoAI.git](https://github.com/darflashxd/PulmoAI.git)
cd PulmoAI

2. Backend Setup (Flask API)
cd backend

# Create Virtual Environment
python -m venv venv

# Activate Environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Run the API Server
python app.py
The server will start at http://127.0.0.1:5000

3. Frontend Setup (React UI)
Open a new terminal window:

cd frontend

# Install Node Modules
npm install

# Start Development Server
npm run dev

Access the application at http://localhost:5173

📊 Model Performance Metrics
The AI model was trained on a balanced dataset of 7,000+ Chest X-Ray images (Normal vs. Tuberculosis).

Architecture: MobileNetV2 (Transfer Learning)

Optimizer: Adam

Loss Function: Binary Crossentropy

Final Metrics:

Training Accuracy: 100%

Validation Accuracy: 99.65%

Validation Loss: 0.0102

Note: We replaced the legacy CNN architecture with MobileNetV2 to reduce model size by 90% (from ~100MB to ~9MB) while significantly improving generalization on unseen data.

📂 Project Structure
PulmoAI/
├── ai-model/           # AI Training Scripts & Dataset Management
│   ├── training-model.py
│   └── dataset/        # (Not uploaded to save space)
├── backend/            # Flask API Server
│   ├── app.py
│   ├── tb_model.h5     # The Trained AI Model (Binary)
│   └── requirements.txt
├── frontend/           # React Application
│   ├── src/
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md           # Documentation

🤝 Contribution & Credits
This project is a collaborative effort.

System Refactoring & AI Optimization: darflashxd

Original Concept: agileorc, darflashxd

⚠️ Disclaimer
This tool is intended for educational and research purposes only. It should not be used as a substitute for professional medical diagnosis.
