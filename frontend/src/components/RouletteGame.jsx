import React, { useState, useRef } from 'react';

const RouletteGame = ({ menus, onResult, onBack }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // 랜덤 결과 선택
    const selectedIndex = Math.floor(Math.random() * menus.length);
    const selectedMenu = menus[selectedIndex];

    // 회전 각도 계산 (최소 5바퀴 + 랜덤 각도)
    const degreePerItem = 360 / menus.length;
    const targetRotation = 360 * 5 + (360 - (selectedIndex * degreePerItem + degreePerItem / 2));
    
    setRotation(rotation + targetRotation);

    // 애니메이션 완료 후 결과 표시
    setTimeout(() => {
      setIsSpinning(false);
      setResult(selectedMenu);
    }, 4000);
  };

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-white transition-all"
          >
            ← 뒤로가기
          </button>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            🎰 메뉴 룰렛
          </h1>
          <p className="text-white text-lg">
            운명에 맡겨보세요!
          </p>
        </div>

        {/* 룰렛 컨테이너 */}
        <div className="relative flex items-center justify-center mb-8">
          {/* 화살표 포인터 */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg"></div>
          </div>

          {/* 룰렛 휠 */}
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            <div
              className="w-full h-full rounded-full shadow-2xl transition-transform duration-[4000ms] ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                background: 'white'
              }}
            >
              {/* 룰렛 섹션들 */}
              {menus.map((menu, index) => {
                const degreePerItem = 360 / menus.length;
                const startAngle = index * degreePerItem;
                const color = colors[index % colors.length];

                return (
                  <div
                    key={index}
                    className={`absolute w-full h-full ${color}`}
                    style={{
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((startAngle + degreePerItem - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle + degreePerItem - 90) * Math.PI / 180)}%)`,
                      borderRadius: '50%'
                    }}
                  >
                    <div
                      className="absolute text-white font-bold text-sm md:text-base"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${startAngle + degreePerItem / 2}deg) translate(0, -100px)`,
                        transformOrigin: '0 0',
                        width: '100px',
                        textAlign: 'center'
                      }}
                    >
                      {menu.menu}
                    </div>
                  </div>
                );
              })}

              {/* 중앙 원 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-gray-300 flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 또는 결과 */}
        {!result ? (
          <div className="text-center">
            <button
              onClick={spin}
              disabled={isSpinning}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-12 py-6 rounded-full font-bold text-2xl shadow-2xl transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSpinning ? '돌리는 중...' : '🎲 룰렛 돌리기!'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {result.menu}
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              {result.category} · {result.price_range}
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              {result.reason}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={spin}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all"
              >
                🔄 다시 돌리기
              </button>
              <button
                onClick={() => onResult(result.menu)}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-bold transition-all"
              >
                ✓ 이 메뉴로 결정!
              </button>
            </div>
          </div>
        )}

        {/* 메뉴 목록 */}
        {!result && (
          <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-3">📋 후보 메뉴</h3>
            <div className="grid grid-cols-3 gap-3">
              {menus.map((menu, index) => (
                <div
                  key={index}
                  className="bg-white/90 rounded-lg p-3 text-center"
                >
                  <p className="font-semibold text-gray-800">{menu.menu}</p>
                  <p className="text-xs text-gray-500">{menu.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteGame;

