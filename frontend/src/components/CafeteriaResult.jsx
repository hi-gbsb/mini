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
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary py-8 px-4">
      {/* 상단 날씨 정보 */}
      {weather_info && (
        <div className="absolute top-4 right-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">
                  {weather_info.condition === '맑음' ? '☀️' : 
                   weather_info.condition === '구름많음' ? '⛅' : 
                   weather_info.condition === '흐림' ? '☁️' : '🌤️'}
                </div>
                <div>
                  <p className="text-sm opacity-70">{weather_info.location}</p>
                  <p className="text-2xl font-bold">{weather_info.temperature}°C</p>
                  <p className="text-xs opacity-60">{weather_summary}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="btn btn-ghost absolute top-4 left-4"
          >
            ← 뒤로가기
          </button>
          
          <h1 className="text-6xl font-bold text-base-100 mb-4 drop-shadow-lg">
            🎯 밥뭇나?! 추천
          </h1>
          
          <div className="badge badge-lg badge-neutral p-6 text-lg">
            <span className="font-semibold mr-2">오늘 구내식당 메뉴:</span> {cafeteria_menu}
          </div>
        </div>

        {/* 추천 메뉴 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {recommendations.map((item, index) => (
            <div
              key={index}
              onClick={() => handleMenuClick(item)}
              className={`card bg-base-100 shadow-2xl cursor-pointer transition-all transform hover:scale-105 ${
                selectedMenu?.menu === item.menu ? 'ring-4 ring-accent' : ''
              }`}
            >
              {/* 카드 헤더 */}
              <div className={`bg-gradient-to-r ${getTypeColor(item.type)} p-4`}>
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold text-lg">
                    {getTypeEmoji(item.type)} {item.type}
                  </span>
                  {selectedMenu?.menu === item.menu && (
                    <div className="badge badge-success text-2xl">✓</div>
                  )}
                </div>
              </div>

              {/* 카드 본문 */}
              <div className="card-body">
                <h3 className="card-title text-3xl">
                  {item.menu}
                </h3>
                <div className="flex gap-2 flex-wrap mb-2">
                  <div className="badge badge-outline">{item.category}</div>
                </div>
                
                <p className="text-base-content/80 leading-relaxed my-2">
                  {item.reason}
                </p>

                {/* 거리 정보 */}
                {item.distance && (
                  <div className="text-sm text-base-content/70 my-2">
                    🚶 도보 {item.distance.walking_min}분
                  </div>
                )}

                <div className="card-actions justify-end mt-2">
                  <div className="badge badge-primary badge-lg">
                    💰 {item.price_range}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 버튼들 */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <button
            onClick={onShowRoulette}
            className="btn btn-lg btn-outline btn-accent"
          >
            🎰 룰렛으로 결정하기
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={!selectedMenu}
            className="btn btn-lg btn-primary"
          >
            {selectedMenu ? `${selectedMenu.menu} 주변 식당 찾기 🔍` : '메뉴를 선택해주세요'}
          </button>
        </div>

        {/* 안내 메시지 */}
        {!selectedMenu && (
          <div className="text-center mt-6">
            <div className="alert alert-info inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>메뉴를 클릭해서 선택하거나, 룰렛으로 운에 맡겨보세요!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeteriaResult;

