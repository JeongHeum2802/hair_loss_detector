import tensorflow as tf
import numpy as np
import json
import sys
import os

def load_and_predict(image_path, model_path=None):
    # 기본 모델 경로 설정 (이 파일과 같은 폴더에 있다고 가정)
    if model_path is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, 'hair_loss_model.h5')

    # 1. 모델 로드
    if not os.path.exists(model_path):
        return {"error": "Model file not found"}
    
    try:
        model = tf.keras.models.load_model(model_path)
    except Exception as e:
        return {"error": f"Failed to load model: {str(e)}"}

    # 2. 이미지 전처리
    try:
        img = tf.keras.utils.load_img(image_path, target_size=(224, 224))
        img_array = tf.keras.utils.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0) # 배치 차원 추가 (1, 224, 224, 3)
    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}

    # 3. 예측
    prediction = model.predict(img_array)
    probability = float(prediction[0][0])

    # 4. 결과 해석 (JSON 생성)
    # 가정: 0에 가까우면 정상, 1에 가까우면 탈모 (학습 데이터 클래스 순서에 따라 달라질 수 있음)
    # 실제 학습 로그의 'class_names'를 확인해야 정확함. 
    # 일단 threshold를 0.5로 설정
    
    result = {
        "probability": round(probability, 4),
        "comment": ""
    }

    if probability > 0.5:
        result["comment"] = "탈모가 의심됩니다. 전문의와 상담을 권장합니다."
        result["is_hairloss"] = True
    else:
        result["comment"] = "정상 범주입니다. 꾸준한 관리가 좋습니다."
        result["is_hairloss"] = False

    return result

if __name__ == "__main__":
    # 테스트용: python ai/predict.py 경로/이미지.jpg
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
        print(json.dumps(load_and_predict(img_path), ensure_ascii=False, indent=2))
    else:
        print("사용법: python ai/predict.py <이미지경로>")
