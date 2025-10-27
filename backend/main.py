from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
import uvicorn
from services.weather_service import WeatherService
from services.ai_service import AIService

app = FastAPI(
    title="AI 점심 메뉴 추천 API",
    description="날씨 기반 AI 점심 메뉴 추천 서비스",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 서비스 인스턴스
weather_service = WeatherService()
ai_service = AIService()

# Request 모델
class RecommendRequest(BaseModel):
    location: str = "서울"
    food_type: Optional[str] = "상관없음"
    mood: Optional[str] = "평범한"
    num_people: int = 1
    moods: Optional[list] = None  # 다인 모드일 때 각 사람의 기분

class RecipeRequest(BaseModel):
    menu_name: str
    num_servings: int = 1

@app.get("/")
async def root():
    return {
        "message": "AI 점심 메뉴 추천 API",
        "version": "1.0.0",
        "endpoints": {
            "weather": "/api/weather?location={location}",
            "recommend": "/api/recommend (POST)"
        }
    }

@app.get("/api/weather")
async def get_weather(location: str = "서울"):
    """날씨 정보 조회"""
    try:
        weather_data = await weather_service.get_weather(location)
        return {
            "success": True,
            "data": weather_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommend")
async def recommend_menu(request: RecommendRequest):
    """AI 메뉴 추천"""
    try:
        # 1. 날씨 정보 가져오기
        weather_data = await weather_service.get_weather(request.location)
        
        # 2. 사용자 선호도
        preferences = {
            "food_type": request.food_type,
            "mood": request.mood,
            "num_people": request.num_people,
            "moods": request.moods
        }
        
        # 3. AI 추천
        recommendation = await ai_service.recommend_lunch(weather_data, preferences)
        
        return {
            "success": True,
            "data": recommendation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recipe")
async def get_recipe(request: RecipeRequest):
    """레시피 생성"""
    try:
        recipe = await ai_service.generate_recipe(request.menu_name, request.num_servings)
        return {
            "success": True,
            "data": recipe
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

