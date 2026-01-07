import tensorflow as tf
import numpy as np
import json
import sys
import os

def load_model(model_type='forehead'):
    """
    Load the model for the given type.
    model_type: 'forehead' or 'crown'
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_filename = f'hair_loss_model_{model_type}.h5'
    model_path = os.path.join(base_dir, 'models', model_filename)

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_filename}")
    
    try:
        model = tf.keras.models.load_model(model_path)
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


## 테스트용 코드
def load_and_predict(image_path, model_type='forehead'):
    """
    model_type: 'forehead' or 'crown'
    Legacy function that loads model every time.
    """
    try:
        model = load_model(model_type)
        return predict_image(model, image_path, model_type)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import argparse
    # 테스트용: python ai/predict.py 경로/이미지.jpg --type forehead
    
    parser = argparse.ArgumentParser(description='Predict Hair Loss')
    parser.add_argument('image_path', type=str, help='Path to the image file')
    parser.add_argument('--type', type=str, default='forehead', choices=['forehead', 'crown'], 
                        help='Type of prediction: forehead or crown')
    
    args = parser.parse_args()

    print(json.dumps(load_and_predict(args.image_path, args.type), ensure_ascii=False, indent=2))
