import google.generativeai as genai
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
import json

load_dotenv()

class AIService:
    def __init__(self):
        # Gemini API 설정
        api_key = os.getenv("GEMINI_API_KEY", "AIzaSyBg5BiDftPSox4lsaI8kk4C62-qUPkk-58")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
            self.use_ai = True
            print("✅ Gemini API 연결됨")
        else:
            self.model = None
            self.use_ai = False
            print("⚠️  Gemini API 키가 없습니다. 규칙 기반 추천 로직을 사용합니다.")
    
    async def recommend_from_cafeteria_menu(
        self,
        weather: Dict,
        cafeteria_menu: str,
        location: Optional[Dict] = None
    ) -> Dict:
        """구내식당 메뉴를 기반으로 3가지 외부 메뉴 추천"""
        
        # API 키가 없으면 규칙 기반 추천 사용
        if not self.use_ai:
            return self._get_fallback_cafeteria_recommendation(weather, cafeteria_menu)
        
        try:
            prompt = f"""
당신은 구내식당을 이용하는 직장인을 위한 메뉴 추천 전문가입니다.

오늘 구내식당 메뉴: {cafeteria_menu}

현재 날씨 정보:
- 위치: {weather.get('location', '서울')}
- 기온: {weather.get('temperature', 20)}°C
- 날씨: {weather.get('sky_condition', '맑음')}
- 강수: {weather.get('precipitation', '없음')}

구내식당에서 먹기 싫은 날을 위해, 다음 3가지 카테고리로 외부 메뉴를 추천해주세요:

1. **상위호환 메뉴**: 구내식당 메뉴의 고급 버전 또는 더 맛있는 버전
2. **비슷한 카테고리**: 같은 계열이지만 다른 음식
3. **날씨 기반 예외 메뉴**: 현재 날씨에 어울리지만 완전히 다른 종류의 음식

반드시 아래 JSON 형식으로만 응답해주세요:
{{
    "cafeteria_menu": "{cafeteria_menu}",
    "recommendations": [
        {{
            "type": "상위호환",
            "menu": "메뉴명",
            "category": "음식 카테고리",
            "reason": "추천 이유 (50자 이내)",
            "price_range": "가격대 (예: 10,000-15,000원)"
        }},
        {{
            "type": "비슷한카테고리",
            "menu": "메뉴명",
            "category": "음식 카테고리",
            "reason": "추천 이유 (50자 이내)",
            "price_range": "가격대"
        }},
        {{
            "type": "날씨기반",
            "menu": "메뉴명",
            "category": "음식 카테고리",
            "reason": "추천 이유 (50자 이내)",
            "price_range": "가격대"
        }}
    ],
    "weather_summary": "날씨 요약 (30자 이내)"
}}
"""
            
            response = self.model.generate_content(prompt)
            content = response.text
            
            # JSON 추출 (마크다운 코드 블록 제거)
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            # JSON 파싱
            try:
                recommendation = json.loads(content)
            except json.JSONDecodeError as e:
                print(f"JSON 파싱 오류: {str(e)}")
                print(f"응답 내용: {content}")
                return self._get_fallback_cafeteria_recommendation(weather, cafeteria_menu)
            
            # 날씨 정보 추가
            recommendation["weather_info"] = {
                "location": weather.get("location"),
                "temperature": weather.get("temperature"),
                "condition": weather.get("sky_condition"),
                "precipitation": weather.get("precipitation")
            }
            
            return recommendation
            
        except Exception as e:
            print(f"AI 추천 오류: {str(e)}")
            import traceback
            traceback.print_exc()
            return self._get_fallback_cafeteria_recommendation(weather, cafeteria_menu)
    
    def _build_prompt(self, weather: Dict, preferences: Optional[Dict]) -> str:
        """프롬프트 생성"""
        temp = weather.get("temperature", 20)
        condition = weather.get("sky_condition", "맑음")
        location = weather.get("location", "서울")
        
        prompt = f"""
        현재 날씨 정보:
        - 위치: {location}
        - 기온: {temp}°C
        - 날씨: {condition}
        - 강수: {weather.get("precipitation", "없음")}
        """
        
        if preferences:
            food_type = preferences.get("food_type", "상관없음")
            mood = preferences.get("mood", "평범한")
            num_people = preferences.get("num_people", 1)
            moods = preferences.get("moods", [])
            
            prompt += f"""
        
        사용자 정보:
        - 인원: {num_people}명
        - 음식 종류: {food_type}
        - 기분: {mood}
            """
            
            if moods and len(moods) > 1:
                prompt += f"\n        - 각 사람의 기분: {', '.join(moods)}"
        
        prompt += """
        
        위 정보를 바탕으로 직장인에게 적합한 점심 메뉴를 추천해주세요.
        날씨가 추우면 따뜻한 음식, 더우면 시원한 음식을 추천하고,
        비가 오면 국물 요리를, 맑은 날은 다양한 선택지를 제안해주세요.
        기분 상태도 고려해서 추천해주세요.
        """
        
        return prompt
    
    async def generate_recipe(self, menu_name: str, num_servings: int = 1) -> Dict:
        """레시피 생성"""
        if not self.use_ai:
            return self._get_fallback_recipe(menu_name, num_servings)
        
        try:
            prompt = f"""
'{menu_name}' 메뉴의 {num_servings}인분 레시피를 작성해주세요.

다음 형식으로 JSON 응답해주세요:
{{
    "menu_name": "메뉴명",
    "servings": {num_servings},
    "ingredients": [
        {{"name": "재료명", "amount": "양"}},
    ],
    "steps": [
        "1단계 설명",
        "2단계 설명",
    ],
    "cooking_time": "조리 시간",
    "difficulty": "쉬움/보통/어려움"
}}
"""
            
            response = self.model.generate_content(prompt)
            content = response.text
            
            # JSON 추출
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            try:
                recipe = json.loads(content)
                return recipe
            except json.JSONDecodeError:
                return self._get_fallback_recipe(menu_name, num_servings)
                
        except Exception as e:
            print(f"레시피 생성 오류: {str(e)}")
            return self._get_fallback_recipe(menu_name, num_servings)
    
    def _get_fallback_recipe(self, menu_name: str, num_servings: int) -> Dict:
        """기본 레시피"""
        return {
            "menu_name": menu_name,
            "servings": num_servings,
            "ingredients": [
                {"name": "주재료", "amount": f"{num_servings * 200}g"},
                {"name": "양파", "amount": f"{num_servings}개"},
                {"name": "마늘", "amount": f"{num_servings * 3}쪽"},
                {"name": "간장", "amount": f"{num_servings * 2}큰술"},
                {"name": "식용유", "amount": f"{num_servings}큰술"},
            ],
            "steps": [
                "재료를 깨끗이 씻어 준비합니다.",
                "양파와 마늘을 적당한 크기로 썰어줍니다.",
                "팬에 식용유를 두르고 마늘을 볶아 향을 냅니다.",
                "주재료를 넣고 중불에서 볶아줍니다.",
                "간장으로 간을 맞추고 완성합니다.",
            ],
            "cooking_time": "약 30분",
            "difficulty": "보통",
            "note": "AI API 연동 시 더 상세한 레시피가 제공됩니다."
        }
    
    def _get_smart_recommendation(self, weather: Dict, preferences: Optional[Dict] = None) -> Dict:
        """규칙 기반 스마트 추천"""
        temp = weather.get("temperature", 20)
        condition = weather.get("sky_condition", "맑음")
        precipitation = weather.get("precipitation", "없음")
        
        # 음식 데이터베이스
        menu_db = {
            "한식": {
                "따뜻한": [
                    {"name": "김치찌개", "spicy": "매움", "reason": "얼큰한 국물로 몸을 녹이기 좋습니다"},
                    {"name": "된장찌개", "spicy": "안 매움", "reason": "구수한 맛이 일품인 건강 메뉴입니다"},
                    {"name": "부대찌개", "spicy": "보통", "reason": "든든하고 푸짐한 한 끼입니다"},
                    {"name": "갈비탕", "spicy": "안 매움", "reason": "영양 만점 보양식입니다"},
                    {"name": "육개장", "spicy": "매움", "reason": "얼큰하고 시원한 국물이 속을 풀어줍니다"},
                ],
                "시원한": [
                    {"name": "냉면", "spicy": "안 매움", "reason": "시원한 육수가 더위를 식혀줍니다"},
                    {"name": "비빔냉면", "spicy": "매움", "reason": "새콤달콤 매콤한 맛이 일품입니다"},
                    {"name": "콩국수", "spicy": "안 매움", "reason": "고소하고 시원한 여름 별미입니다"},
                ],
                "중간": [
                    {"name": "비빔밥", "spicy": "보통", "reason": "영양 균형이 잡힌 건강식입니다"},
                    {"name": "불고기", "spicy": "안 매움", "reason": "달콤한 양념이 식욕을 돋웁니다"},
                    {"name": "제육볶음", "spicy": "매움", "reason": "매콤한 맛이 밥도둑입니다"},
                ]
            },
            "중식": {
                "따뜻한": [
                    {"name": "짬뽕", "spicy": "매움", "reason": "얼큰한 국물로 추위를 날립니다"},
                    {"name": "짜장면", "spicy": "안 매움", "reason": "부담 없이 즐기는 국민 메뉴입니다"},
                    {"name": "마라탕", "spicy": "아주 매움", "reason": "얼얼한 맛이 중독성 있습니다"},
                ],
                "시원한": [
                    {"name": "냉짬뽕", "spicy": "매움", "reason": "시원하고 얼큰한 맛의 조화입니다"},
                    {"name": "냉짜장", "spicy": "안 매움", "reason": "시원하게 즐기는 짜장면입니다"},
                ],
                "중간": [
                    {"name": "볶음밥", "spicy": "보통", "reason": "간단하고 맛있는 한 끼입니다"},
                    {"name": "탕수육", "spicy": "안 매움", "reason": "바삭하고 달콤한 인기 메뉴입니다"},
                ]
            },
            "일식": {
                "중간": [
                    {"name": "초밥", "spicy": "안 매움", "reason": "신선한 재료로 깔끔한 한 끼"},
                    {"name": "돈카츠", "spicy": "안 매움", "reason": "바삭하고 든든한 식사"},
                    {"name": "라멘", "spicy": "보통", "reason": "진한 국물이 일품인 면 요리"},
                    {"name": "우동", "spicy": "안 매움", "reason": "부드럽고 담백한 면 요리"},
                ]
            },
            "양식": {
                "중간": [
                    {"name": "파스타", "spicy": "안 매움", "reason": "다양한 소스로 즐기는 면 요리"},
                    {"name": "스테이크", "spicy": "안 매움", "reason": "육즙 가득한 고급 식사"},
                    {"name": "리조또", "spicy": "안 매움", "reason": "크리미하고 고소한 맛"},
                ]
            },
            "분식": {
                "따뜻한": [
                    {"name": "떡볶이", "spicy": "매움", "reason": "매콤달콤 간식 같은 한 끼"},
                    {"name": "라볶이", "spicy": "매움", "reason": "라면과 떡볶이의 환상 조합"},
                ],
                "중간": [
                    {"name": "김밥", "spicy": "안 매움", "reason": "간편하고 든든한 한 끼"},
                    {"name": "우동", "spicy": "안 매움", "reason": "담백하고 부드러운 면 요리"},
                ]
            }
        }
        
        # 선호도 가져오기
        pref_type = preferences.get("food_type", "상관없음") if preferences else "상관없음"
        pref_mood = preferences.get("mood", "평범한") if preferences else "평범한"
        num_people = preferences.get("num_people", 1) if preferences else 1
        
        # 온도에 따른 카테고리 선택
        if temp < 10:
            temp_category = "따뜻한"
        elif temp > 25:
            temp_category = "시원한"
        else:
            temp_category = "중간"
        
        # 비 오는 날은 국물 요리
        if precipitation != "없음":
            temp_category = "따뜻한"
        
        # 음식 종류 필터링
        if pref_type != "상관없음":
            available_types = [pref_type]
        else:
            available_types = list(menu_db.keys())
        
        # 후보 메뉴 수집
        candidates = []
        for food_type in available_types:
            if temp_category in menu_db[food_type]:
                for item in menu_db[food_type][temp_category]:
                    item["category"] = food_type
                    candidates.append(item)
            elif "중간" in menu_db[food_type]:
                for item in menu_db[food_type]["중간"]:
                    item["category"] = food_type
                    candidates.append(item)
        
        # 기분에 따른 필터링
        import random
        
        # 기분별 추천 메뉴 조정
        mood_preferences = {
            "기쁜": ["분식", "양식"],  # 가벼운 음식
            "슬픈": ["한식", "중식"],  # 위로되는 음식
            "화난": ["한식", "중식"],  # 매운 음식
            "피곤한": ["한식", "일식"],  # 든든한 음식
            "스트레스": ["중식", "한식"],  # 얼큰한 음식
            "평범한": None  # 제한 없음
        }
        
        if pref_mood in mood_preferences and mood_preferences[pref_mood]:
            mood_types = mood_preferences[pref_mood]
            mood_filtered = [c for c in candidates if c["category"] in mood_types]
            if mood_filtered:
                candidates = mood_filtered
        
        if candidates:
            selected = random.choice(candidates)
        else:
            # 기본 메뉴
            selected = {
                "name": "비빔밥",
                "category": "한식",
                "spicy": "보통",
                "reason": "영양 균형이 잡힌 건강식입니다"
            }
        
        # 대체 메뉴 생성
        alternatives = [c["name"] for c in candidates if c["name"] != selected["name"]][:3]
        if not alternatives:
            alternatives = ["김치찌개", "짜장면", "돈카츠"]
        
        # 온도 매칭 설명
        if temp < 10:
            temp_match = f"쌀쌀한 날씨({temp}°C)에 따뜻한 음식으로 몸을 녹이세요"
        elif temp > 25:
            temp_match = f"더운 날씨({temp}°C)에 시원한 음식으로 더위를 식히세요"
        else:
            temp_match = f"적당한 날씨({temp}°C)에 어떤 메뉴든 좋습니다"
        
        if precipitation != "없음":
            temp_match += f". {precipitation}가 내리니 따뜻한 국물 요리가 제격입니다"
        
        return {
            "menu": selected["name"],
            "category": selected["category"],
            "reason": selected["reason"],
            "temperature_match": temp_match,
            "alternatives": alternatives,
            "weather_info": {
                "location": weather.get("location"),
                "temperature": weather.get("temperature"),
                "condition": weather.get("sky_condition")
            }
        }
    
    def _get_fallback_cafeteria_recommendation(self, weather: Dict, cafeteria_menu: str) -> Dict:
        """API 오류 시 기본 추천"""
        temp = weather.get("temperature", 20)
        
        # 간단한 규칙 기반 추천
        recommendations = [
            {
                "type": "상위호환",
                "menu": "프리미엄 한정식",
                "category": "한식",
                "reason": "구내식당보다 고급스러운 한식 코스",
                "price_range": "15,000-20,000원"
            },
            {
                "type": "비슷한카테고리",
                "menu": "김치찌개",
                "category": "한식",
                "reason": "구수하고 든든한 한식",
                "price_range": "8,000-10,000원"
            },
            {
                "type": "날씨기반",
                "menu": "냉면" if temp > 25 else "칼국수",
                "category": "한식",
                "reason": f"{'더운' if temp > 25 else '쌀쌀한'} 날씨에 어울리는 메뉴",
                "price_range": "8,000-12,000원"
            }
        ]
        
        return {
            "cafeteria_menu": cafeteria_menu,
            "recommendations": recommendations,
            "weather_summary": f"{temp}°C, {weather.get('sky_condition', '맑음')}",
            "weather_info": {
                "location": weather.get("location"),
                "temperature": weather.get("temperature"),
                "condition": weather.get("sky_condition"),
                "precipitation": weather.get("precipitation")
            }
        }
    
    def _get_fallback_recommendation(self, weather: Dict) -> Dict:
        """API 오류 시 기본 추천 (간단 버전)"""
        temp = weather.get("temperature", 20)
        
        if temp < 10:
            menu = "김치찌개"
            reason = "추운 날씨에 따뜻한 국물 요리가 좋습니다."
        elif temp < 20:
            menu = "비빔밥"
            reason = "적당한 날씨에 영양 균형 잡힌 메뉴입니다."
        else:
            menu = "냉면"
            reason = "더운 날씨에 시원한 면 요리가 제격입니다."
        
        return {
            "menu": menu,
            "category": "한식",
            "reason": reason,
            "temperature_match": f"{temp}°C에 적합한 메뉴입니다.",
            "alternatives": ["불고기", "갈비탕"],
            "weather_info": weather
        }

