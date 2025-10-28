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
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="btn btn-ghost absolute top-4 left-4"
          >
            ← 뒤로가기
          </button>
          
          <h1 className="text-6xl font-bold text-base-100 mb-4 drop-shadow-lg">
            🎰 밥뭇나?! 룰렛
          </h1>
          <p className="text-base-100 text-xl drop-shadow">
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
              className="w-full h-full rounded-full shadow-2xl transition-transform duration-[4000ms] ease-out overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`
              }}
            >
              {/* 룰렛 섹션들 */}
              {menus.map((menu, index) => {
                const degreePerItem = 360 / menus.length;
                const startAngle = index * degreePerItem;
                const endAngle = startAngle + degreePerItem;
                const color = colors[index % colors.length];

                // 원의 중심에서 시작하여 호를 그리는 polygon 생성
                const points = ['50% 50%']; // 중심점
                
                // 시작 각도부터 끝 각도까지 여러 점을 생성하여 부드러운 호 만들기
                const segments = 20;
                for (let i = 0; i <= segments; i++) {
                  const angle = startAngle + (degreePerItem * i / segments) - 90;
                  const x = 50 + 50 * Math.cos(angle * Math.PI / 180);
                  const y = 50 + 50 * Math.sin(angle * Math.PI / 180);
                  points.push(`${x}% ${y}%`);
                }

                return (
                  <div
                    key={index}
                    className={`absolute w-full h-full ${color}`}
                    style={{
                      clipPath: `polygon(${points.join(', ')})`,
                    }}
                  >
                    <div
                      className="absolute text-white font-bold text-sm md:text-base drop-shadow-lg whitespace-nowrap"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${startAngle + degreePerItem / 2}deg) translate(-50%, -130px)`,
                        transformOrigin: '0 0'
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
              className="btn btn-lg btn-primary text-2xl px-12 py-6"
            >
              {isSpinning ? (
                <>
                  <span className="loading loading-spinner"></span>
                  돌리는 중...
                </>
              ) : (
                '🎲 룰렛 돌리기!'
              )}
            </button>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="card-title text-4xl justify-center mb-4">
                {result.menu}
              </h2>
              <div className="flex gap-2 justify-center mb-4">
                <div className="badge badge-lg badge-outline">{result.category}</div>
                <div className="badge badge-lg badge-primary">{result.price_range}</div>
              </div>
              <p className="text-base-content/80 mb-6 leading-relaxed">
                {result.reason}
              </p>
              <div className="card-actions justify-center gap-4">
                <button
                  onClick={spin}
                  className="btn btn-ghost"
                >
                  🔄 다시 돌리기
                </button>
                <button
                  onClick={() => onResult(result.menu)}
                  className="btn btn-success"
                >
                  ✓ 이 메뉴로 결정!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 메뉴 목록 */}
        {!result && (
          <div className="card bg-base-100/20 backdrop-blur-sm shadow-xl mt-8">
            <div className="card-body">
              <h3 className="card-title text-base-100">📋 후보 메뉴</h3>
              <div className="grid grid-cols-3 gap-3">
                {menus.map((menu, index) => (
                  <div
                    key={index}
                    className="card bg-base-100 shadow"
                  >
                    <div className="card-body p-3 text-center">
                      <p className="font-semibold">{menu.menu}</p>
                      <p className="text-xs opacity-70">{menu.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteGame;

