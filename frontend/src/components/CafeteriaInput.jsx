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
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      {/* 상단 날씨 정보 */}
      {weather && (
        <div className="absolute top-4 right-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">
                  {weather.sky_condition === '맑음' ? '☀️' : 
                   weather.sky_condition === '구름많음' ? '⛅' : 
                   weather.sky_condition === '흐림' ? '☁️' : '🌤️'}
                </div>
                <div>
                  <p className="text-sm opacity-70">{location || weather.location}</p>
                  <p className="text-2xl font-bold">{weather.temperature}°C</p>
                  <p className="text-xs opacity-60">{weather.sky_condition}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-base-100 mb-4 drop-shadow-lg">
              🍱 밥뭇나?!
            </h1>
            <p className="text-base-100 text-xl mb-2 drop-shadow">
              오늘 구내식당 메뉴를 알려주세요
            </p>
            <p className="text-base-100/90 text-sm drop-shadow">
              구내식당에서 먹기 싫은 날을 위해 맛있는 외부 메뉴를 추천해드려요!
            </p>
          </div>

          {/* 입력 방법 선택 */}
          {!inputMethod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setInputMethod('text')}
                className="card bg-base-100 hover:bg-base-200 shadow-2xl transition-all transform hover:scale-105 hover:shadow-primary/50"
              >
                <div className="card-body items-center text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h2 className="card-title text-2xl">텍스트 입력</h2>
                  <p className="text-base-content/70">메뉴를 직접 입력하기</p>
                </div>
              </button>

              <button
                onClick={() => setInputMethod('image')}
                className="card bg-base-100 hover:bg-base-200 shadow-2xl transition-all transform hover:scale-105 hover:shadow-secondary/50"
              >
                <div className="card-body items-center text-center">
                  <div className="text-6xl mb-4">📸</div>
                  <h2 className="card-title text-2xl">이미지 업로드</h2>
                  <p className="text-base-content/70">식단표 사진 올리기</p>
                </div>
              </button>
            </div>
          )}

          {/* 텍스트 입력 */}
          {inputMethod === 'text' && (
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body">
                <button
                  onClick={() => setInputMethod(null)}
                  className="btn btn-ghost btn-sm self-start"
                >
                  ← 다시 선택
                </button>
                <h3 className="card-title text-2xl">오늘의 구내식당 메뉴</h3>
                <textarea
                  value={menuText}
                  onChange={(e) => setMenuText(e.target.value)}
                  placeholder="예: 제육볶음, 된장찌개, 비빔밥, 파스타..."
                  className="textarea textarea-bordered textarea-lg h-40 text-lg"
                />
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!menuText.trim()}
                    className="btn btn-primary btn-lg w-full"
                  >
                    메뉴 추천받기 🎯
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 이미지 업로드 */}
          {inputMethod === 'image' && (
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body">
                <button
                  onClick={() => setInputMethod(null)}
                  className="btn btn-ghost btn-sm self-start"
                >
                  ← 다시 선택
                </button>
                <h3 className="card-title text-2xl">식단표 사진 업로드</h3>
                
                <div className="border-4 border-dashed border-base-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  {imagePreview ? (
                    <div>
                      <img src={imagePreview} alt="식단표" className="max-h-64 mx-auto mb-4 rounded-lg" />
                      <button
                        onClick={() => {
                          setMenuImage(null);
                          setImagePreview(null);
                        }}
                        className="btn btn-error btn-sm"
                      >
                        다시 선택
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="text-6xl mb-4">📤</div>
                      <p className="text-base-content mb-2">클릭하여 이미지 업로드</p>
                      <p className="text-sm text-base-content/60">JPG, PNG 파일 지원</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="alert alert-warning mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span className="text-sm"><strong>안내:</strong> 현재 이미지 OCR 기능은 개발 중입니다. 텍스트 입력을 이용해주세요.</span>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!menuImage}
                    className="btn btn-secondary btn-lg w-full"
                  >
                    메뉴 추천받기 🎯
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CafeteriaInput;

