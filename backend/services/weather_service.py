import httpx
from typing import Dict, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class WeatherService:
    def __init__(self):
        # Open-Meteo는 API 키가 필요 없습니다!
        self.base_url = "https://api.open-meteo.com/v1/forecast"
        print("✅ Open-Meteo 날씨 서비스 초기화 (무료, API 키 불필요)")
    
    def get_location_coords(self, location: str) -> tuple:
        """한국 주요 도시 좌표 (위도, 경도)"""
        location_coords = {
            "서울": (37.5665, 126.9780),
            "강남": (37.4979, 127.0276),
            "여의도": (37.5219, 126.9245),
            "판교": (37.3944, 127.1109),
            "부산": (35.1796, 129.0756),
            "대구": (35.8714, 128.6014),
            "인천": (37.4563, 126.7052),
            "광주": (35.1595, 126.8526),
            "대전": (36.3504, 127.3845),
            "울산": (35.5384, 129.3114),
            "세종": (36.4800, 127.2890),
            "수원": (37.2636, 127.0286),
            "창원": (35.2272, 128.6811),
            "고양": (37.6584, 126.8320),
            "용인": (37.2411, 127.1776),
        }
        return location_coords.get(location, (37.5665, 126.9780))  # 기본값: 서울
    
    async def get_weather(self, location: str = "서울") -> Dict:
        """Open-Meteo API로 날씨 정보 조회 (무료, API 키 불필요)"""
        try:
            lat, lon = self.get_location_coords(location)
            
            params = {
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,weather_code,precipitation,cloud_cover,wind_speed_10m",
                "timezone": "Asia/Seoul"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.base_url,
                    params=params,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                
                current = data["current"]
                weather_code = current["weather_code"]
                
                weather_data = {
                    "location": location,
                    "temperature": round(current["temperature_2m"]),
                    "sky_condition": self._weather_code_to_korean(weather_code),
                    "precipitation": "있음" if current["precipitation"] > 0 else "없음",
                    "humidity": current["relative_humidity_2m"],
                    "cloud_cover": current["cloud_cover"],
                    "wind_speed": current["wind_speed_10m"],
                    "weather_code": weather_code
                }
                
                print(f"✅ {location} 날씨 조회 성공: {weather_data['temperature']}°C, {weather_data['sky_condition']}")
                return weather_data
                
        except Exception as e:
            print(f"⚠️ Open-Meteo API 오류: {str(e)}")
            # 오류 발생 시 더미 데이터 반환
            return self._get_dummy_weather(location)
    
    def _weather_code_to_korean(self, code: int) -> str:
        """WMO Weather Code를 한글로 변환
        
        Open-Meteo는 WMO(세계기상기구) 표준 날씨 코드를 사용합니다.
        참고: https://open-meteo.com/en/docs
        """
        weather_codes = {
            0: "맑음",
            1: "대체로 맑음",
            2: "구름조금",
            3: "구름많음",
            45: "안개",
            48: "짙은 안개",
            51: "가랑비",
            53: "보통 가랑비",
            55: "강한 가랑비",
            56: "약한 어는 가랑비",
            57: "강한 어는 가랑비",
            61: "약한 비",
            63: "비",
            65: "강한 비",
            66: "약한 어는 비",
            67: "강한 어는 비",
            71: "약한 눈",
            73: "눈",
            75: "강한 눈",
            77: "진눈깨비",
            80: "약한 소나기",
            81: "소나기",
            82: "강한 소나기",
            85: "약한 눈",
            86: "강한 눈",
            95: "뇌우",
            96: "약한 우박을 동반한 뇌우",
            99: "강한 우박을 동반한 뇌우"
        }
        return weather_codes.get(code, "맑음")
    
    def _get_dummy_weather(self, location: str) -> Dict:
        """테스트용 더미 날씨 데이터"""
        return {
            "location": location,
            "temperature": 15,
            "sky_condition": "맑음",
            "precipitation": "없음",
            "humidity": 60,
            "cloud_cover": 20,
            "wind_speed": 3.5,
            "weather_code": 0,
            "note": "Open-Meteo API 연결 실패 시 더미 데이터입니다."
        }

