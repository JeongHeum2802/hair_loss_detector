// 내 컴퓨터의 IP 주소 (터미널에서 ipconfig 로 확인)
// 모바일 테스트 시 'localhost' 대신 이 IP를 사용하세요.
const YOUR_IP_ADDRESS = 'localhost'; // 예: '192.168.0.5'

export const API_BASE_URL = `http://${YOUR_IP_ADDRESS}:3000`;
export const AI_API_BASE_URL = `http://${YOUR_IP_ADDRESS}:8000`;
