from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

print("⏳ Sedang memuat model AI 'tb_model.h5'...")
try:
    model = tf.keras.models.load_model('tb_model.h5')
    print("✅ BERHASIL! Model AI siap menerima gambar.")
except Exception as e:
    print("❌ ERROR FATAL: File 'tb_model.h5' tidak ditemukan!")
    print("   Pastikan kamu sudah copy file .h5 dari folder ai-model ke folder backend.")
    print(f"   Detail Error: {e}")

def prepare_image(image):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize((224, 224))
    image = np.array(image)
    
    image = image / 255.0
    image = np.expand_dims(image, axis=0)
    
    return image

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file gambar yang dikirim'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nama file kosong'}), 400

    try:
        image = Image.open(io.BytesIO(file.read()))
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
            'message': 'Analisis berhasil'
        })
        
    except Exception as e:
        print(f"Error saat prediksi: {e}")
        return jsonify({'error': 'Gagal memproses gambar', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)