import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dropout, Input, GlobalAveragePooling2D
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import os

# --- KONFIGURASI ---
DATASET_DIR = 'dataset'  # Pastikan struktur folder: dataset/Normal dan dataset/Tuberculosis
IMG_WIDTH, IMG_HEIGHT = 224, 224
BATCH_SIZE = 32
EPOCHS = 20  # Bisa dinaikin karena kita pake EarlyStopping

# Cek Folder
if not os.path.exists(DATASET_DIR):
    print(f"CRITICAL ERROR: Folder '{DATASET_DIR}' tidak ditemukan!")
    print("Struktur folder harus:")
    print("ai-model/")
    print("  ├── dataset/")
    print("  │    ├── Normal/")
    print("  │    └── Tuberculosis/")
    print("  └── training-model.py")
    exit()

# --- DATA AUGMENTATION ---
# Kita bikin variasi gambar biar model gak ngafal mati
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2
)

print("Memuat Data...")
train_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=(IMG_WIDTH, IMG_HEIGHT),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    subset='training',
    shuffle=True
)

validation_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=(IMG_WIDTH, IMG_HEIGHT),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    subset='validation'
)

print(f"Mapping Kelas: {train_generator.class_indices}")

# --- ARSITEKTUR MOBILENETV2 (Transfer Learning) ---
print("Membangun Arsitektur MobileNetV2...")

# 1. Ambil Base Model (Tanpa bagian "Top" atau kepalanya)
# weights='imagenet' artinya kita pake otak yang udah pinter
base_model = MobileNetV2(
    weights='imagenet', 
    include_top=False, 
    input_shape=(IMG_WIDTH, IMG_HEIGHT, 3)
)

# 2. Bekukan Base Model (Biar ilmu lamanya gak ilang)
base_model.trainable = False 

# 3. Bikin Kepala Baru (Custom Head)
x = base_model.output
# GlobalAveragePooling2D adalah KUNCI biar file KECIL. 
# Dia merangkum fitur tanpa Flatten yang boros parameter.
x = GlobalAveragePooling2D()(x) 
x = Dense(64, activation='relu')(x) # Dense layer kecil aja cukup
x = Dropout(0.5)(x) # Biar gak overfitting
outputs = Dense(1, activation='sigmoid')(x) # Output Binary (0 atau 1)

model = Model(inputs=base_model.input, outputs=outputs)

model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

model.summary()

# --- CALLBACKS (Fitur Pintar) ---
# 1. EarlyStopping: Berhenti otomatis kalau akurasi mentok (biar gak buang waktu)
early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

# 2. ModelCheckpoint: Selalu simpan versi TERBAIK, bukan versi terakhir
checkpoint = ModelCheckpoint('tb_model.h5', monitor='val_accuracy', save_best_only=True, mode='max')

# --- TRAINING ---
print("Training Dimulai...")
history = model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // BATCH_SIZE,
    epochs=EPOCHS,
    validation_data=validation_generator,
    validation_steps=validation_generator.samples // BATCH_SIZE,
    callbacks=[early_stop, checkpoint]
)

print("DONE! Model terbaik tersimpan sebagai 'tb_model.h5'")