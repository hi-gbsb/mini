# 🍱 AI 점심 메뉴 추천 서비스 (구내식당 버전)

구내식당을 이용하는 직장인을 위한 AI 기반 외부 메뉴 추천 서비스입니다.

## ✨ 주요 기능

### 1️⃣ 위치 정보 인증
- 앱 시작 시 위치 정보 권한 요청
- 날씨 정보와 주변 식당 검색을 위한 위치 기반 서비스

### 2️⃣ 구내식당 메뉴 입력
- **텍스트 입력**: 오늘의 구내식당 메뉴를 직접 입력
- **이미지 업로드**: 식단표 사진 업로드 (개발 중)

### 3️⃣ AI 기반 3가지 메뉴 추천 (Gemini 2.0 Flash)
- **상위호환 메뉴**: 구내식당 메뉴의 고급 버전
- **비슷한 카테고리**: 같은 계열의 다른 음식
- **날씨 기반 예외**: 현재 날씨에 어울리는 완전히 다른 음식

### 4️⃣ 룰렛 게임
- 메뉴 선택이 어려울 때 룰렛으로 랜덤 선택
- 애니메이션과 함께 재미있는 선택 경험

### 5️⃣ 카카오맵 연동
- 선택한 메뉴의 주변 식당 검색 (반경 2km)
- 지도에 식당 위치 표시 및 정보 제공

## 🚀 기술 스택

### 백엔드
- Python 3.12
- FastAPI
- **Google Gemini 2.0 Flash API** (무료 사용 가능)
- 기상청 공공데이터 API

### 프론트엔드
- React 18
- Vite
- TailwindCSS
- Axios
- Kakao Map API

## 📋 사전 준비

### 1. API 키 발급
- **Gemini API Key**: https://aistudio.google.com/app/apikey
  - 무료로 사용 가능 (프로젝트에 기본 키 포함)
  - 본인의 키를 사용하려면 `backend/.env`에 설정
- **기상청 API Key** (선택사항): https://www.data.go.kr/
  - "기상청_단기예보 ((구)_동네예보) 조회서비스" 신청
  - 없으면 더미 날씨 데이터 사용
- **카카오맵 API Key** (필수): https://developers.kakao.com/
  - 음식점 검색 기능에 필요
  - Web 플랫폼에 `http://localhost:5173` 등록
  - 프로젝트에 기본 키 포함됨

### 2. Miniforge 설치
```bash
# Windows에서 Miniforge 설치
# https://github.com/conda-forge/miniforge/releases
```

## 🛠️ 설치 및 실행

### 백엔드 설정
```bash
# 1. 가상환경 생성 및 활성화
conda env create -f environment.yml
conda activate ai_x2

# 2. 백엔드 디렉토리로 이동
cd backend

# 3. 패키지 설치 (environment.yml에 없는 경우)
pip install google-generativeai

# 4. 서버 실행
python main.py
# 또는
uvicorn main:app --reload --port 8000
```

**참고**: Gemini API 키는 코드에 기본값으로 포함되어 있어 별도 설정 없이 바로 사용 가능합니다.

### 프론트엔드 설정
```bash
# 1. 패키지 설치
cd frontend
npm install

# 2. 개발 서버 실행
npm run dev
```

**참고**: 카카오맵 API 키도 코드에 기본값으로 포함되어 있습니다.

## 🌐 접속
- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## 📱 사용 흐름

1. **위치 권한 허용** → 날씨 정보 자동 로드
2. **구내식당 메뉴 입력** → 텍스트 또는 이미지로 입력
3. **AI 추천 확인** → 3가지 카테고리별 메뉴 추천
4. **메뉴 선택** → 직접 선택 또는 룰렛으로 결정
5. **식당 검색** → 카카오맵으로 주변 식당 찾기

## 📁 프로젝트 구조
```
ai_x2/
├── backend/
│   ├── main.py                          # FastAPI 메인 서버
│   ├── services/
│   │   ├── weather_service.py          # 날씨 API 서비스
│   │   └── ai_service.py               # Gemini AI 서비스
│   ├── requirements.txt
│   └── .env                            # 환경변수 (Gemini API Key)
├── frontend/
│   ├── src/
│   │   ├── App.jsx                     # 메인 앱
│   │   ├── components/
│   │   │   ├── CafeteriaInput.jsx      # 메뉴 입력 화면
│   │   │   ├── CafeteriaResult.jsx     # 추천 결과 화면
│   │   │   ├── RouletteGame.jsx        # 룰렛 게임
│   │   │   └── RestaurantPage.jsx      # 카카오맵 식당 검색
│   │   └── services/
│   │       └── api.js                  # API 클라이언트
│   ├── package.json
│   └── .env                            # 환경변수 (Kakao API Key)
└── environment.yml
```

## 🎨 화면 구성

### 1. 위치 권한 요청 화면
- 위치 정보 접근 권한 요청
- 거부 시 기본 위치(서울)로 진행

### 2. 메뉴 입력 화면
- 텍스트 입력 또는 이미지 업로드 선택
- 날씨 정보 표시

### 3. 추천 결과 화면
- 3가지 카테고리별 메뉴 카드
- 룰렛 게임 버튼
- 메뉴 선택 및 식당 찾기

### 4. 룰렛 게임 화면
- 애니메이션 룰렛
- 결과 표시 및 재도전 가능

### 5. 식당 검색 화면
- 카카오맵 지도
- 주변 2km 내 식당 마커
- 식당 정보 (주소, 전화번호)

## 🔧 주요 API 엔드포인트

### `/api/weather` (GET)
현재 날씨 정보 조회
```json
{
  "location": "서울",
  "temperature": 15,
  "sky_condition": "맑음",
  "precipitation": "없음"
}
```

### `/api/recommend-from-cafeteria` (POST)
구내식당 메뉴 기반 추천
```json
{
  "location": "서울",
  "cafeteria_menu": "제육볶음, 된장찌개, 비빔밥",
  "user_location": {"latitude": 37.5665, "longitude": 126.9780}
}
```

응답:
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
    },
    // ... 2개 더
  ],
  "weather_summary": "15°C, 맑음"
}
```

## 💡 개발 포인트

- **Gemini 2.0 Flash**: OpenAI 대신 무료 Gemini API 사용
- **구내식당 특화**: 직장인의 실제 니즈에 맞춘 기능
- **룰렛 게임**: 선택 피로도를 줄이는 재미있는 UX
- **위치 기반**: 실시간 날씨와 주변 식당 검색
- **반응형 디자인**: Tailwind CSS를 활용한 모던 UI

