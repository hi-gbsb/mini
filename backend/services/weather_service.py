import httpx
from typing import Dict, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("WEATHER_API_KEY")
        self.base_url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0"
    
    def get_grid_coords(self, location: str) -> tuple:
        """위치명을 기상청 격자 좌표로 변환 (간단한 예시)"""
        location_grid = {
            "서울": (60, 127),
            "강남": (61, 126),
            "여의도": (58, 126),
            "판교": (62, 123),
            "부산": (98, 76),
            "대구": (89, 90),
            "인천": (55, 124),
            "광주": (58, 74),
            "대전": (67, 100),
            "울산": (102, 84),
            "세종": (66, 103),
        }
        return location_grid.get(location, (60, 127))  # 기본값: 서울
    
    async def get_weather(self, location: str = "서울") -> Dict:
        """기상청 API로 날씨 정보 조회"""
        try:
            nx, ny = self.get_grid_coords(location)
            
            # 현재 시각 기준으로 base_date, base_time 설정
            now = datetime.now()
            base_date = now.strftime("%Y%m%d")
            base_time = "0500"  # 기상청 발표 시간 (05시, 11시, 17시, 23시)
            
            # 현재 시간에 따라 적절한 base_time 선택
            hour = now.hour
            if hour < 5:
                base_time = "2300"
                # 전날 날짜로 변경 필요
            elif hour < 11:
                base_time = "0500"
            elif hour < 17:
                base_time = "1100"
            elif hour < 23:
                base_time = "1700"
            else:
                base_time = "2300"
            
            params = {
                "serviceKey": self.api_key,
                "pageNo": "1",
                "numOfRows": "100",
                "dataType": "JSON",
                "base_date": base_date,
                "base_time": base_time,
                "nx": nx,
                "ny": ny
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/getVilageFcst",
                    params=params,
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # 데이터 파싱
                    if "response" in data and "body" in data["response"]:
                        items = data["response"]["body"]["items"]["item"]
                        
                        # 필요한 정보 추출
                        weather_data = {
                            "location": location,
                            "temperature": None,
                            "sky_condition": None,
                            "precipitation": None,
                            "humidity": None,
                        }
                        
                        for item in items:
                            category = item["category"]
                            value = item["fcstValue"]
                            
                            if category == "TMP":  # 기온
                                weather_data["temperature"] = float(value)
                            elif category == "SKY":  # 하늘 상태
                                sky_codes = {
                                    "1": "맑음",
                                    "3": "구름많음",
                                    "4": "흐림"
                                }
                                weather_data["sky_condition"] = sky_codes.get(value, "알 수 없음")
                            elif category == "PTY":  # 강수 형태
                                pty_codes = {
                                    "0": "없음",
                                    "1": "비",
                                    "2": "비/눈",
                                    "3": "눈",
                                    "4": "소나기"
                                }
                                weather_data["precipitation"] = pty_codes.get(value, "없음")
                            elif category == "REH":  # 습도
                                weather_data["humidity"] = int(value)
                        
                        return weather_data
                
                # API 호출 실패 시 더미 데이터 반환
                return self._get_dummy_weather(location)
                
        except Exception as e:
            print(f"날씨 API 오류: {str(e)}")
            # 오류 발생 시 더미 데이터 반환
            return self._get_dummy_weather(location)
    
    def _get_dummy_weather(self, location: str) -> Dict:
        """테스트용 더미 날씨 데이터"""
        return {
            "location": location,
            "temperature": 15.0,
            "sky_condition": "맑음",
            "precipitation": "없음",
            "humidity": 60,
            "note": "실제 API 연동 후 정확한 데이터가 제공됩니다."
        }

