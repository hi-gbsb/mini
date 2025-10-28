# 🍱 밥뭇나?! - AI 점심 메뉴 추천

구내식당을 이용하는 직장인을 위한 AI 기반 외부 메뉴 추천 서비스

## ✨ 주요 기능

- 📍 **위치 기반 날씨 조회** - 실시간 날씨 정보
- 📝 **구내식당 메뉴 입력** - 텍스트 또는 이미지
- 🤖 **AI 메뉴 추천** - 상위호환, 비슷한 카테고리, 날씨 기반 3가지
- 🎰 **룰렛 게임** - 선택이 어려울 때
- 🗺️ **주변 식당 검색** - 카카오맵 연동

## 🚀 기술 스택

### 백엔드
- Python 3.12 + FastAPI
- Google Gemini 2.0 Flash (무료)
- Open-Meteo Weather API (무료)

### 프론트엔드
- React 18 + Vite
- TailwindCSS + DaisyUI
- Kakao Map API

## 🛠️ 설치 및 실행

### 1. 백엔드
```bash
# 가상환경 생성 및 활성화
conda env create -f environment.yml
conda activate ai_x2

# 백엔드 실행
cd backend
python main.py
```

### 2. 프론트엔드
```bash
# 패키지 설치 및 실행
cd frontend
npm install
npm run dev
```

### 3. 접속
- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## 📱 사용 흐름

1. 위치 권한 허용 → 날씨 정보 로드
2. 구내식당 메뉴 입력
3. AI 추천 확인 (3가지)
4. 메뉴 선택 또는 룰렛
5. 주변 식당 검색

## 📁 프로젝트 구조

```
ai_x2/
├── backend/
│   ├── main.py                     # FastAPI 서버
│   ├── services/
│   │   ├── weather_service.py     # 날씨 API
│   │   └── ai_service.py          # Gemini AI
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # 메인 앱
│   │   ├── components/            # 화면 컴포넌트
│   │   └── services/api.js        # API 클라이언트
│   └── package.json
└── environment.yml
```

## 🔧 API 엔드포인트

### GET `/api/weather`
날씨 정보 조회

```bash
GET /api/weather?location=서울
```

**응답:**
```json
{
  "success": true,
  "data": {
    "location": "서울",
    "temperature": 15,
    "sky_condition": "맑음",
    "precipitation": "없음"
  }
}
```

### POST `/api/recommend-from-cafeteria`
AI 메뉴 추천

**요청:**
```json
{
  "location": "서울",
  "cafeteria_menu": "제육볶음, 된장찌개, 비빔밥",
  "prefer_external": true
}
```

**응답:**
```json
{
  "cafeteria_menu": "제육볶음, 된장찌개, 비빔밥",
  "recommendations": [
    {
      "type": "상위호환",
      "menu": "프리미엄 한정식",
      "category": "한식",
      "reason": "구내식당보다 고급스러운 한식 코스",
      "price_range": "15,000-20,000원"
    }
    // ... 2개 더
  ],
  "weather_summary": "15°C, 맑음"
}
```

## 💡 핵심 특징

### CAM 모드 (Cafeteria Avoidance Mode)
- 구내식당 회피 시 외부식당 우선 추천
- 도보 0~15분 거리 제한
- 스코어링: 맛, 영양, 실용성 가중치

### 날씨 기반 추천
- 더운 날씨 (25℃+): 냉면, 샐러드
- 추운 날씨 (10℃-): 국물 요리
- 비/눈: 실내 음식, 전골

### 완전 무료
- Gemini API 무료
- Open-Meteo 무료 (API 키 불필요)
- Kakao Map 무료

## 📝 참고

- Gemini API: https://aistudio.google.com/app/apikey
- Open-Meteo: https://open-meteo.com/en/docs
- Kakao Map: https://developers.kakao.com/
- 모든 API 키는 코드에 기본값 포함 (즉시 사용 가능)
