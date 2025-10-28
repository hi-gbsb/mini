import React, { useState } from 'react';

const CafeteriaResult = ({ recommendation, onSelectMenu, onShowRoulette, onBack }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);

  if (!recommendation || !recommendation.recommendations) {
    return null;
  }

  const { cafeteria_menu, recommendations, weather_summary, weather_info } = recommendation;

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleConfirm = () => {
    if (selectedMenu) {
      onSelectMenu(selectedMenu.menu);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case '상위호환':
        return 'from-yellow-500 to-orange-500';
      case '비슷한카테고리':
        return 'from-green-500 to-teal-500';
      case '날씨기반':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeEmoji = (type) => {
    switch (type) {
      case '상위호환':
        return '⭐';
      case '비슷한카테고리':
        return '🍽️';
      case '날씨기반':
        return '🌤️';
      default:
        return '🍴';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 py-8 px-4">
      {/* 상단 날씨 정보 */}
      {weather_info && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">
              {weather_info.condition === '맑음' ? '☀️' : 
               weather_info.condition === '구름많음' ? '⛅' : 
               weather_info.condition === '흐림' ? '☁️' : '🌤️'}
            </div>
            <div>
              <p className="text-sm text-gray-600">{weather_info.location}</p>
              <p className="text-2xl font-bold text-gray-800">{weather_info.temperature}°C</p>
              <p className="text-xs text-gray-500">{weather_summary}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-white transition-all"
          >
            ← 뒤로가기
          </button>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            🎯 AI 메뉴 추천
          </h1>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-white text-lg">
              <span className="font-semibold">오늘 구내식당 메뉴:</span> {cafeteria_menu}
            </p>
          </div>
        </div>

        {/* 추천 메뉴 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {recommendations.map((item, index) => (
            <div
              key={index}
              onClick={() => handleMenuClick(item)}
              className={`bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
                selectedMenu?.menu === item.menu ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              {/* 카드 헤더 */}
              <div className={`bg-gradient-to-r ${getTypeColor(item.type)} p-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-lg">
                    {getTypeEmoji(item.type)} {item.type}
                  </span>
                  {selectedMenu?.menu === item.menu && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
              </div>

              {/* 카드 본문 */}
              <div className="p-6">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {item.menu}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {item.category}
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {item.reason}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold">
                    💰 {item.price_range}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 버튼들 */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <button
            onClick={onShowRoulette}
            className="bg-white hover:bg-gray-100 text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105"
          >
            🎰 룰렛으로 결정하기
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={!selectedMenu}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedMenu ? `${selectedMenu.menu} 주변 식당 찾기 🔍` : '메뉴를 선택해주세요'}
          </button>
        </div>

        {/* 안내 메시지 */}
        {!selectedMenu && (
          <div className="text-center mt-6">
            <p className="text-white/80 text-sm">
              💡 메뉴를 클릭해서 선택하거나, 룰렛으로 운에 맡겨보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeteriaResult;

