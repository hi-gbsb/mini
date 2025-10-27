import React, { useEffect, useState } from 'react';

const RestaurantPage = ({ menuName, location, onBack }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 카카오맵 API 스크립트 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY&libraries=services&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
        initMap();
      });
    };

    script.onerror = () => {
      setError('카카오맵을 불러올 수 없습니다.');
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [menuName, location]);

  const initMap = () => {
    const container = document.getElementById('map');
    if (!container) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 기본 좌표
      level: 3
    };

    const map = new window.kakao.maps.Map(container, options);
    
    // 장소 검색 객체 생성
    const ps = new window.kakao.maps.services.Places();

    // 키워드로 장소 검색
    ps.keywordSearch(menuName, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 검색 결과를 지도에 표시
        data.slice(0, 5).forEach((place, index) => {
          const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
          
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map: map
          });

          // 인포윈도우 생성
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${index + 1}. ${place.place_name}</div>`
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
          });
        });

        // 첫 번째 결과로 지도 중심 이동
        if (data.length > 0) {
          const firstPlace = data[0];
          map.setCenter(new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x));
        }
      }
    });
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 text-white hover:text-gray-200 flex items-center bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
        >
          <span className="mr-2">←</span> 뒤로가기
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <h2 className="text-3xl font-bold mb-2">🗺️ {menuName} 맛집 찾기</h2>
            <p className="text-white/90">주변의 {menuName} 음식점을 찾아보세요</p>
          </div>

          {/* 지도 */}
          <div className="relative">
            {error ? (
              <div className="h-96 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">{error}</p>
                  <p className="text-sm text-gray-500">
                    카카오맵 API 키가 필요합니다.<br/>
                    설정 후 다시 시도해주세요.
                  </p>
                </div>
              </div>
            ) : !isMapLoaded ? (
              <div className="h-96 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">지도를 불러오는 중...</p>
                </div>
              </div>
            ) : (
              <div id="map" className="w-full h-96"></div>
            )}
          </div>

          {/* 안내 메시지 */}
          <div className="p-6 bg-gray-50">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">💡 Tip:</span> 지도에서 마커를 클릭하면 식당 정보를 확인할 수 있습니다.
              </p>
            </div>
            
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">⚠️ 참고:</span> 카카오맵 API 키를 설정하면 실제 주변 식당 정보가 표시됩니다.
              </p>
            </div>
          </div>

          {/* 다시 검색 버튼 */}
          <div className="p-6">
            <button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-bold text-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              다른 메뉴 추천받기 🔄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;

