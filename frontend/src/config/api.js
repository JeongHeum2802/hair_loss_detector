// 내 컴퓨터의 IP 주소
const YOUR_IP_ADDRESS = '192.168.219.101';

// 개발 환경(npm run dev)에서는 IP:3000 사용, 배포/빌드 환경에서는 현재 도메인 그대로 사용(빈 문자열)
const isDev = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDev ? `http://${YOUR_IP_ADDRESS}:3000` : '';

const AI_CLOUD_URL = 'https://hair-loss-detector-ai-186015486455.asia-northeast3.run.app';
//export const AI_API_BASE_URL = isDev ? `http://${YOUR_IP_ADDRESS}:8000` : AI_CLOUD_URL;
export const AI_API_BASE_URL = "http://116.35.37.208:25565";