import React, { useState, useEffect } from 'react';
import CafeteriaInput from './components/CafeteriaInput';
import CafeteriaResult from './components/CafeteriaResult';
import RouletteGame from './components/RouletteGame';
import RestaurantPage from './components/RestaurantPage';
import { weatherAPI, cafeteriaAPI } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('location'); // location, input, result, roulette, restaurant
  const [location, setLocation] = useState('서울');
  const [userCoords, setUserCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [cafeteriaMenu, setCafeteriaMenu] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationPermission, setLocationPermission] = useState('pending'); // pending, granted, denied

  // 위치 정보 요청
  useEffect(() => {
    if (currentPage === 'location') {
      requestLocation();
    }
  }, [currentPage]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserCoords(coords);
          setLocationPermission('granted');
          
          // 위치 기반으로 지역명 설정 (간단하게 서울로 설정, 실제로는 역지오코딩 필요)
          setLocation('서울');
          
          // 날씨 정보 가져오기
          fetchWeather('서울');
          
          // 입력 페이지로 이동
          setCurrentPage('input');
        },
        (error) => {
          console.warn('위치 정보 접근 거부:', error);
          setLocationPermission('denied');
          
          // 위치 권한이 없어도 기본 위치로 진행
          setLocation('서울');
          fetchWeather('서울');
          
          // 3초 후 자동으로 입력 페이지로 이동
          setTimeout(() => {
            setCurrentPage('input');
          }, 3000);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationPermission('denied');
      setLocation('서울');
      fetchWeather('서울');
      setTimeout(() => {
        setCurrentPage('input');
      }, 3000);
    }
  };

  const fetchWeather = async (loc) => {
    try {
      const response = await weatherAPI.getWeather(loc);
      setWeather(response.data);
    } catch (err) {
      console.error('날씨 정보 가져오기 실패:', err);
    }
  };

  const handleMenuInput = async (input) => {
    setLoading(true);
    setError(null);
    setCafeteriaMenu(input.content);

    try {
      const response = await cafeteriaAPI.getRecommendation(
        location,
        input.content,
        userCoords
      );
      
      setRecommendation(response.data);
      setCurrentPage('result');
    } catch (err) {
      setError('추천을 가져오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMenu = (menuName) => {
    setSelectedMenu(menuName);
    setCurrentPage('restaurant');
  };

  const handleShowRoulette = () => {
    setCurrentPage('roulette');
  };

  const handleRouletteResult = (menuName) => {
    setSelectedMenu(menuName);
    setCurrentPage('restaurant');
  };

  const handleBack = () => {
    setCurrentPage('input');
    setRecommendation(null);
    setSelectedMenu(null);
  };

  const handleBackToResult = () => {
    setCurrentPage('result');
  };

  // 로딩 화면
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <div className="card bg-base-100 shadow-2xl p-8">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <h2 className="text-2xl font-bold mt-4">Gemini AI가 메뉴를 분석중...</h2>
            <p className="text-base-content/70 mt-2">구내식당 메뉴 기반으로 3가지 추천을 준비하고 있어요</p>
          </div>
        </div>
      </div>
    );
  }

  // 위치 권한 요청 화면
  if (currentPage === 'location') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <div className="card bg-base-100 shadow-2xl max-w-md">
          <div className="card-body items-center text-center">
            <div className="text-7xl mb-4">📍</div>
            <h2 className="card-title text-3xl">위치 정보 접근</h2>
            
            {locationPermission === 'pending' && (
              <>
                <p className="text-base-content/80 py-4">
                  날씨 정보와 주변 식당 검색을 위해<br/>
                  위치 정보가 필요합니다
                </p>
                <progress className="progress progress-primary w-56"></progress>
              </>
            )}
            
            {locationPermission === 'denied' && (
              <>
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>위치 정보 접근이 거부되었습니다</span>
                </div>
                <p className="text-base-content/70 mt-2">
                  기본 위치(서울)로 진행합니다...
                </p>
                <div className="alert alert-info mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-sm">브라우저 설정에서 위치 권한을 허용하면 더 정확한 주변 식당을 찾을 수 있습니다</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* 에러 메시지 */}
      {error && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="btn btn-sm btn-ghost">✕</button>
          </div>
        </div>
      )}

      {/* 페이지 라우팅 */}
      {currentPage === 'input' && (
        <CafeteriaInput
          onSubmit={handleMenuInput}
          weather={weather}
          location={location}
        />
      )}

      {currentPage === 'result' && (
        <CafeteriaResult
          recommendation={recommendation}
          onSelectMenu={handleSelectMenu}
          onShowRoulette={handleShowRoulette}
          onBack={handleBack}
        />
      )}

      {currentPage === 'roulette' && recommendation && (
        <RouletteGame
          menus={recommendation.recommendations}
          onResult={handleRouletteResult}
          onBack={handleBackToResult}
        />
      )}

      {currentPage === 'restaurant' && (
        <RestaurantPage
          menuName={selectedMenu}
          location={location}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;

