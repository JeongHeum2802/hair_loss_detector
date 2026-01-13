from fastapi import FastAPI, UploadFile, File, HTTPException
from contextlib import asynccontextmanager
import uvicorn
import shutil
import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
import tensorflow as tf
tf.config.threading.set_intra_op_parallelism_threads(1)
tf.config.threading.set_inter_op_parallelism_threads(1)
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
models = {}


from tensorflow.keras import layers, applications

def build_hairloss_model(input_shape=(224, 224, 3)):
    """
    Reconstruct the model architecture exactly as in train.py
    """
    base_model = applications.ResNet50(
        weights='imagenet',
        include_top=False,
        input_shape=input_shape
    )
    base_model.trainable = False
    
    x = base_model.output
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(1024, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    x = layers.Dense(512, activation='relu')(x)
    x = layers.Dropout(0.3)(x)
    output = layers.Dense(1, activation='sigmoid')(x)
    
    model = tf.keras.models.Model(inputs=base_model.input, outputs=output, name='hairloss_detector_v1')
    return model

def load_model(model_type='forehead'):
    """
    Load the model weights into the reconstructed architecture.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_filename = f'hair_loss_model_{model_type}.h5'
    model_path = os.path.join(base_dir, 'models', model_filename)

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_filename}")
    
    try:
        # Reconstruct architecture
        model = build_hairloss_model()
        # Load weights only (bypassing layer config mismatch)
        model.load_weights(model_path)
        return model
    except Exception as e:
        raise Exception(f"Failed to load model: {str(e)}")

def predict_image(model, image_path, model_type='forehead'):
    """
    Predict using the loaded model.
    """
    # 2. 이미지 전처리
    try:
        img = tf.keras.utils.load_img(image_path, target_size=(224, 224))
        img_array = tf.keras.utils.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0) # 배치 차원 추가 (1, 224, 224, 3)
    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}

    # 3. 예측
    try:
        prediction = model.predict(img_array)
        probability = float(prediction[0][0])
    except Exception as e:
         return {"error": f"Prediction failed: {str(e)}"}

    # 4. 결과 해석 (JSON 생성)
    result = {
        "probability": round(probability, 4),
        "type": model_type,
        "comment": ""
    }

    if probability > 0.5:
        result["comment"] = f"{'이마' if model_type == 'forehead' else '정수리'} 탈모가 의심됩니다. 전문의와 상담을 권장합니다."
        result["is_hairloss"] = True
    else:
        result["comment"] = "정상 범주입니다. 꾸준한 관리가 좋습니다."
        result["is_hairloss"] = False

    return result

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load models on startup
    print("Loading models...")
    print(f"TensorFlow Version: {tf.__version__}")
    try:
        print(f"Keras Version: {tf.keras.__version__}")
    except:
        print("Keras version not found in tf.keras.__version__")
    
    try:
        models['forehead'] = load_model('forehead')
        models['crown'] = load_model('crown')
        print("Models loaded successfully.")
    except Exception as e:
        print(f"Error loading models: {e}")
    yield
    # Clean up models on shutdown
    models.clear()
    print("Models cleaned up.")

app = FastAPI(lifespan=lifespan)

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인에서의 요청 허용 (실제 배포 시에는 구체적인 도메인 지정 권장)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP Method 허용 (GET, POST 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/predict/{model_type}")
async def predict(model_type: str, file: UploadFile = File(...)):
    if model_type not in ['forehead', 'crown']:
        raise HTTPException(status_code=400, detail="Invalid model type.")

    if model_type not in models:
        raise HTTPException(status_code=500, detail="Model not loaded.")

    # Determine a temporary filename
    # Use just the filename in the current directory or a specific temp dir that exists
    temp_filename = f"temp_{file.filename}" 
    
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"Saved temp file: {temp_filename}, Size: {os.path.getsize(temp_filename)}")

        # Run prediction
        result = predict_image(models[model_type], temp_filename, model_type)
        print("Prediction result:", result)
        return result

    except Exception as e:
        print(f"PREDICT ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Clean up temporary file
        if os.path.exists(temp_filename):
            try:
                os.remove(temp_filename)
                print(f"Removed temp file: {temp_filename}")
            except Exception as cleanup_error:
                print(f"Failed to remove temp file: {cleanup_error}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 25565))
    uvicorn.run(app, host="0.0.0.0", port=port)