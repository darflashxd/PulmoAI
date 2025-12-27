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
