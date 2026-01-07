from fastapi import FastAPI, UploadFile, File, HTTPException
from contextlib import asynccontextmanager
import uvicorn
import shutil
import os
from predict import load_model, predict_image

models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load models on startup
    print("Loading models...")
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

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/predict/{model_type}")
async def predict(model_type: str, file: UploadFile = File(...)):
    if model_type not in ['forehead', 'crown']:
        raise HTTPException(status_code=400, detail="Invalid model type. Choose 'forehead' or 'crown'.")
    
    if model_type not in models:
        raise HTTPException(status_code=500, detail="Model not loaded.")

    # Save uploaded file temporarily
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        result = predict_image(models[model_type], temp_filename, model_type)
        return result
    finally:
        # Clean up temporary file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)