import tensorflow as tf
import os

input_model = "tb_model.h5"
output_model = "tb_model_light.h5"

size_awal = os.path.getsize(input_model) / (1024 * 1024)
print(f"Size: {size_awal:.2f} MB")

print("Loading...")
model = tf.keras.models.load_model(input_model)

print("Saving compressed version...")
model.save(output_model, include_optimizer=False)

size_akhir = os.path.getsize(output_model) / (1024 * 1024)
print(f"Finall size: {size_akhir:.2f} MB")
print(f"Sucessfully compressed: {size_awal - size_akhir:.2f} MB")