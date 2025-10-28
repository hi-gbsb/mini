import React, { useState } from 'react';

const CafeteriaInput = ({ onSubmit, weather, location }) => {
  const [inputMethod, setInputMethod] = useState(null); // 'text' or 'image'
  const [menuText, setMenuText] = useState('');
  const [menuImage, setMenuImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMenuImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (inputMethod === 'text' && menuText.trim()) {
      onSubmit({ method: 'text', content: menuText });
    } else if (inputMethod === 'image' && menuImage) {
      // 이미지의 경우 OCR이 필요하지만, 현재는 텍스트로 입력받도록 안내
      alert('이미지 업로드 기능은 개발 중입니다. 텍스트로 입력해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      {/* 상단 날씨 정보 */}
      {weather && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">
              {weather.sky_condition === '맑음' ? '☀️' : 
               weather.sky_condition === '구름많음' ? '⛅' : 
               weather.sky_condition === '흐림' ? '☁️' : '🌤️'}
            </div>
            <div>
              <p className="text-sm text-gray-600">{location || weather.location}</p>
              <p className="text-2xl font-bold text-gray-800">{weather.temperature}°C</p>
              <p className="text-xs text-gray-500">{weather.sky_condition}</p>
            </div>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              🍱 구내식당 메뉴 입력
            </h1>
            <p className="text-white text-lg mb-2">
              오늘 구내식당 메뉴를 알려주세요
            </p>
            <p className="text-white/80 text-sm">
              구내식당에서 먹기 싫은 날을 위해 맛있는 외부 메뉴를 추천해드려요!
            </p>
          </div>

          {/* 입력 방법 선택 */}
          {!inputMethod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setInputMethod('text')}
                className="bg-white hover:bg-blue-50 rounded-2xl shadow-2xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">텍스트 입력</h2>
                <p className="text-gray-600">메뉴를 직접 입력하기</p>
              </button>

              <button
                onClick={() => setInputMethod('image')}
                className="bg-white hover:bg-purple-50 rounded-2xl shadow-2xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-4">📸</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">이미지 업로드</h2>
                <p className="text-gray-600">식단표 사진 올리기</p>
              </button>
            </div>
          )}

          {/* 텍스트 입력 */}
          {inputMethod === 'text' && (
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <button
                onClick={() => setInputMethod(null)}
                className="text-gray-500 hover:text-gray-700 mb-4"
              >
                ← 다시 선택
              </button>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">오늘의 구내식당 메뉴</h3>
              <textarea
                value={menuText}
                onChange={(e) => setMenuText(e.target.value)}
                placeholder="예: 제육볶음, 된장찌개, 비빔밥, 파스타..."
                className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-lg"
              />
              <button
                onClick={handleSubmit}
                disabled={!menuText.trim()}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                메뉴 추천받기 🎯
              </button>
            </div>
          )}

          {/* 이미지 업로드 */}
          {inputMethod === 'image' && (
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <button
                onClick={() => setInputMethod(null)}
                className="text-gray-500 hover:text-gray-700 mb-4"
              >
                ← 다시 선택
              </button>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">식단표 사진 업로드</h3>
              
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="식단표" className="max-h-64 mx-auto mb-4 rounded-lg" />
                    <button
                      onClick={() => {
                        setMenuImage(null);
                        setImagePreview(null);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      다시 선택
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="text-6xl mb-4">📤</div>
                    <p className="text-gray-600 mb-2">클릭하여 이미지 업로드</p>
                    <p className="text-sm text-gray-400">JPG, PNG 파일 지원</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  💡 <strong>안내:</strong> 현재 이미지 OCR 기능은 개발 중입니다. 
                  텍스트 입력을 이용해주세요.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!menuImage}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                메뉴 추천받기 🎯
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CafeteriaInput;

