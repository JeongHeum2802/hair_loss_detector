import tensorflow as tf
from tensorflow.keras import layers, models, applications
from tensorflow.keras.optimizers import Adam
import os

def build_hairloss_model(input_shape=(224, 224, 3)):
    """
    단일 이미지 입력을 위한 표준 ResNet50 분류기를 생성합니다.
    """
    # 1. 사전 학습된 ResNet50 로드
    base_model = applications.ResNet50(
        weights='imagenet',
        include_top=False,
        input_shape=input_shape
    )
    
    # 기본 모델 동결 (학습되지 않도록 설정)
    base_model.trainable = False
    
    # 2. 사용자 정의 분류 헤드 추가
    x = base_model.output
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(1024, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    x = layers.Dense(512, activation='relu')(x)
    x = layers.Dropout(0.3)(x)
    
    # 출력: 1개의 뉴런 (이진 분류: 정상(0) vs 탈모(1) 또는 그 반대)
    output = layers.Dense(1, activation='sigmoid')(x)
    
    model = models.Model(inputs=base_model.input, outputs=output, name='hairloss_detector_v1')
    return model

import argparse

def train():
    parser = argparse.ArgumentParser(description='Train Hair Loss Detection Model')
    parser.add_argument('--type', type=str, required=True, choices=['forehead', 'crown'],
                        help='Type of model to train: forehead or crown')
    args = parser.parse_args()
    
    model_type = args.type
    
    # 설정
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    # 데이터셋 경로 분리: dataSet/forehead 또는 dataSet/crown
    DATA_DIR = os.path.join(BASE_DIR, 'dataSet', model_type)
    IMG_SIZE = (224, 224)
    BATCH_SIZE = 32
    EPOCHS = 50
    # 모델 저장 경로 분리: hair_loss_model_forehead.h5 또는 hair_loss_model_crown.h5
    MODEL_SAVE_PATH = os.path.join(BASE_DIR, f'hair_loss_model_{model_type}.h5')

    print(f"Training Model Type: {model_type}")
    print(f"Data Directory: {DATA_DIR}")
    print(f"Model Save Path: {MODEL_SAVE_PATH}")

    # 데이터 디렉토리가 존재하는지 확인
    if not os.path.exists(DATA_DIR):
        print(f"Error: Dataset directory '{DATA_DIR}' not found.")
        print(f"Please create '{DATA_DIR}' and add 'normal' and 'hairloss' subfolders.")
        return

    print("Checking dataset...")
    # 3. 자동 리사이징 및 증강을 포함한 데이터 로드
    try:
        # 학습 데이터 로드 (80%)
        train_ds = tf.keras.utils.image_dataset_from_directory(
            DATA_DIR,
            validation_split=0.2,
            subset="training",
            seed=123,
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            label_mode='binary', # 0 또는 1
            class_names=['normal', 'hairloss'] # normal=0, hairloss=1 로 고정
        )
        
        # 검증 데이터 로드 (20%)
        val_ds = tf.keras.utils.image_dataset_from_directory(
            DATA_DIR,
            validation_split=0.2,
            subset="validation",
            seed=123,
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            label_mode='binary', # 0 또는 1
            class_names=['normal', 'hairloss'] # normal=0, hairloss=1 로 고정
        )
        
        class_names = train_ds.class_names
        print(f"Detected Classes (0->1): {class_names}")
        # 참고: 보통 알파벳 순서입니다. 예: ['hairloss', 'normal'] -> hairloss=0, normal=1 (확인 필요)

    except Exception as e:
        print(f"Failed to load dataset: {e}")
        print(f"Make sure '{DATA_DIR}' contains 'hairloss' and 'normal' folders with images.")
        return

    # 4. 모델 생성 및 컴파일
    model = build_hairloss_model()
    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    model.summary()

    # 5. 학습
    print("\nStarting Training...")
    try:
        history = model.fit(
            train_ds,
            validation_data=val_ds,
            epochs=EPOCHS
        )
        
        # 6. 모델 저장
        model.save(MODEL_SAVE_PATH)
        print(f"\nModel saved to {MODEL_SAVE_PATH}")
        print(f"Class mapping: {class_names}")
        
    except Exception as e:
        print(f"\nTraining Error: {e}")

if __name__ == '__main__':
    train()


