# 🍱 AI 점심 메뉴 추천 서비스

직장인을 위한 날씨 기반 AI 점심 메뉴 추천 서비스입니다.

## 🚀 기술 스택

### 백엔드
- Python 3.11
- FastAPI
- OpenAI GPT API
- 기상청 공공데이터 API

### 프론트엔드
- React 18
- Vite
- TailwindCSS
- Axios

## 📋 사전 준비

### 1. API 키 발급
- **OpenAI API Key** (선택사항): https://platform.openai.com/api-keys
  - 없어도 규칙 기반 추천 시스템으로 작동
- **기상청 API Key** (선택사항): https://www.data.go.kr/ (공공데이터포털)
  - "기상청_단기예보 ((구)_동네예보) 조회서비스" 신청
  - 없으면 더미 날씨 데이터 사용
- **카카오맵 API Key** (선택사항): https://developers.kakao.com/
  - 음식점 검색 기능 사용 시 필요
  - `frontend/src/components/RestaurantPage.jsx`에서 설정

### 2. Miniforge 설치
```bash
# Windows에서 Miniforge 설치
# https://github.com/conda-forge/miniforge/releases
```

## 🛠️ 설치 및 실행

### 백엔드 설정
```bash
# 가상환경 생성 및 활성화
conda env create -f environment.yml
conda activate ai_x2

# 환경변수 설정
cd backend
cp .env.example .env
# .env 파일에 API 키 입력

# 서버 실행
python main.py
# 또는
uvicorn main:app --reload --port 8000
```

### 프론트엔드 설정
```bash
# 패키지 설치
cd frontend
npm install

# 개발 서버 실행
npm run dev
```

## 🌐 접속
- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## 📁 프로젝트 구조
```
ai_x2/
├── backend/
│   ├── main.py
│   ├── services/
│   │   ├── weather_service.py
│   │   └── ai_service.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── services/
│   └── package.json
└── environment.yml
```

## 🎯 주요 기능

### 1인 모드
- 개인 선호도 기반 메뉴 추천
- 기분 상태 고려
- 레시피 제공 (1인분)
- 주변 음식점 검색 (카카오맵)

### 다인 모드 (최대 10명)
- 다수의 기분 상태 고려
- 그룹 선호도 반영
- 레시피 제공 (N인분)
- 주변 음식점 검색

### 공통 기능
- 실시간 날씨 정보 표시
- 날씨 기반 스마트 추천
- 음식점 찾기 (카카오맵 API)
- 레시피 생성 (AI)
- 기분 카테고리별 맞춤 추천

