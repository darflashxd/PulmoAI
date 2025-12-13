import os
import io
import logging
import magic
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from werkzeug.utils import secure_filename
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
Talisman(app, force_https=False, content_security_policy=None)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024 

allowed_origins = [origin.strip() for origin in os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')]

CORS(app, 
     origins=allowed_origins,
     methods=["POST", "GET", "OPTIONS"],
     allow_headers=["Content-Type"],
     supports_credentials=False,
     max_age=3600)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

print("Loading AI model")
try:
    model_path = os.path.join(os.getcwd(), 'backend', 'tb_model.h5')
    if not os.path.exists(model_path):
        model_path = os.path.join(os.getcwd(), 'tb_model.h5')
    model = tf.keras.models.load_model(model_path)
    print("AI ready!")
except Exception as e:
    logger.critical(f"Failed to load model: {e}")
    model = None

ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png']

def validate_image(file_stream):
    header = file_stream.read(2048)
    file_stream.seek(0) 
    
    mime = magic.Magic(mime=True)
    file_type = mime.from_buffer(header)
    
    if file_type not in ALLOWED_MIME_TYPES:
        raise ValueError(f"File extension not allowed: {file_type}")

    try:
        img = Image.open(file_stream)
        img.verify()
        file_stream.seek(0)
    except Exception:
        raise ValueError("File corrupted or not a valid image")

def prepare_image(image):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize((224, 224))
    image = np.array(image)
    image = image / 255.0
    image = np.expand_dims(image, axis=0)
    return image

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "server_ready",
        "message": "PulmoAI Backend Secure API"
    })

@app.route('/predict', methods=['POST'])
@limiter.limit("10 per minute")
def predict():
    if not model:
        return jsonify({'error': 'Model AI not available'}), 503

    if 'file' not in request.files:
        return jsonify({'error': 'No image file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'File name is empty'}), 400

    filename = secure_filename(file.filename)

    try:
        file_stream = io.BytesIO(file.read())
        validate_image(file_stream)
        
        # Proses Gambar
        image = Image.open(file_stream)
        processed_image = prepare_image(image)
        
        prediction = model.predict(processed_image)
        score = float(prediction[0][0])
    
        if score > 0.5:
            label = "Tuberculosis"
            confidence = score * 100 
        else:
            label = "Normal"
            confidence = (1 - score) * 100
        
        return jsonify({
            'label': label,
            'confidence': f"{confidence:.2f}%",
            'raw_score': score,
            'message': 'Analysis successful'
        })
        
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({'error': 'An error occurred while processing the image'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)