import React, { useEffect, useState } from 'react';

const RestaurantPage = ({ menuName, location, onBack }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 카카오맵 API 스크립트 로드
    const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY || '97530b44b3984f6777b7a8897d33e173';
    console.log('🗺️ 카카오맵 API 키:', KAKAO_API_KEY);
    
    // 이미 로드된 스크립트가 있으면 제거
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      console.log('✅ 카카오맵 스크립트 로드 성공');
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('✅ 카카오맵 초기화 성공');
          setIsMapLoaded(true);
          // initMap()은 별도 useEffect에서 실행
        });
      } else {
        console.error('❌ window.kakao.maps가 없습니다');
        setError('카카오맵 API를 초기화할 수 없습니다.');
      }
    };

    script.onerror = (e) => {
      console.error('❌ 카카오맵 스크립트 로드 실패:', e);
      setError('카카오맵을 불러올 수 없습니다. API 키를 확인해주세요.');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [menuName, location]);

  // isMapLoaded가 true가 되면 지도 초기화
  useEffect(() => {
    if (isMapLoaded) {
      console.log('🗺️ DOM 렌더링 대기 중...');
      // DOM이 렌더링될 시간을 주기 위해 setTimeout 사용
      const timer = setTimeout(() => {
        initMap();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isMapLoaded]);

  const initMap = () => {
    console.log('🗺️ initMap 실행, 검색어:', menuName);
    const container = document.getElementById('map');
    if (!container) {
      console.error('❌ map 컨테이너를 찾을 수 없습니다');
      return;
    }

    try {
      // 기본 좌표 (서울)
      let defaultLat = 37.5665;
      let defaultLng = 126.9780;

      const options = {
        center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
        level: 4 // 조금 더 넓은 범위
      };

      const map = new window.kakao.maps.Map(container, options);
      console.log('✅ 지도 생성 성공');
      
      // 사용자 현재 위치 가져오기
      if (navigator.geolocation) {
        console.log('📍 현재 위치 가져오는 중...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log(`✅ 현재 위치: ${lat}, ${lng}`);
            
            const locPosition = new window.kakao.maps.LatLng(lat, lng);
            map.setCenter(locPosition);
            
            // 현재 위치 마커 표시
            const currentMarker = new window.kakao.maps.Marker({
              position: locPosition,
              map: map
            });
            
            const infowindow = new window.kakao.maps.InfoWindow({
              content: '<div style="padding:5px;font-size:12px;color:#4F46E5;">📍 현재 위치</div>'
            });
            infowindow.open(map, currentMarker);
            
            // 현재 위치 기준으로 음식점 검색
            searchPlaces(map, lat, lng);
          },
          (error) => {
            console.warn('⚠️ 위치 정보를 가져올 수 없습니다:', error.message);
            console.log('📍 기본 위치(서울)로 검색합니다');
            // 위치 권한이 없으면 서울 중심으로 검색
            searchPlaces(map, defaultLat, defaultLng);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        console.warn('⚠️ 브라우저가 위치 정보를 지원하지 않습니다');
        searchPlaces(map, defaultLat, defaultLng);
      }
      
    } catch (error) {
      console.error('❌ 지도 초기화 중 오류:', error);
      setError('지도를 초기화하는 중 오류가 발생했습니다.');
    }
  };

  const searchPlaces = (map, lat, lng) => {
    // 장소 검색 객체 생성
    const ps = new window.kakao.maps.services.Places();
    
    // 현재 위치 기준으로 반경 내 검색
    const searchOption = {
      location: new window.kakao.maps.LatLng(lat, lng),
      radius: 2000, // 2km 반경
      size: 10 // 최대 10개
    };

    // 키워드로 장소 검색
    console.log('🔍 장소 검색 시작:', menuName, `(반경 2km)`);
    ps.keywordSearch(menuName, (data, status) => {
      console.log('🔍 검색 결과 상태:', status);
      console.log('🔍 검색 결과 데이터:', data);
      
      if (status === window.kakao.maps.services.Status.OK) {
        console.log(`✅ ${data.length}개의 장소를 찾았습니다`);
        
        // 검색 결과를 지도에 표시
        data.forEach((place, index) => {
          const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
          
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map: map
          });

          // 인포윈도우 생성
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:8px;font-size:12px;">
              <strong>${index + 1}. ${place.place_name}</strong><br/>
              <span style="font-size:11px;color:#666;">${place.road_address_name || place.address_name}</span><br/>
              <span style="font-size:11px;color:#FF6B35;">📞 ${place.phone || '전화번호 없음'}</span>
            </div>`
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
          });
          
          // 첫 번째 마커는 기본으로 정보창 표시
          if (index === 0) {
            infowindow.open(map, marker);
          }
        });

        // 검색 결과가 있으면 첫 번째 결과 주변으로 지도 범위 조정
        if (data.length > 0) {
          const bounds = new window.kakao.maps.LatLngBounds();
          
          // 현재 위치 포함
          bounds.extend(new window.kakao.maps.LatLng(lat, lng));
          
          // 검색 결과들 포함
          data.forEach(place => {
            bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
          });
          
          map.setBounds(bounds);
          console.log('✅ 지도 범위 조정 완료');
        }
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        console.warn('⚠️ 검색 결과가 없습니다');
        alert(`주변 2km 내에 "${menuName}" 음식점을 찾을 수 없습니다.\n검색 범위를 확대해보세요.`);
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        console.error('❌ 검색 중 오류 발생');
      }
    }, searchOption);
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
                <span className="font-semibold">📍 현재 위치 기반:</span> 주변 2km 반경 내 음식점을 표시합니다.
              </p>
            </div>
            
            <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">💡 Tip:</span> 마커를 클릭하면 상세 정보(주소, 전화번호)를 확인할 수 있습니다.
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

