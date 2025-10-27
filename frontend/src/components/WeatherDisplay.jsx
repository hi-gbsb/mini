import React from 'react';

const WeatherDisplay = ({ weather }) => {
  if (!weather) return null;

  const getWeatherIcon = (condition) => {
    const icons = {
      '맑음': '☀️',
      '구름많음': '⛅',
      '흐림': '☁️',
      '비': '🌧️',
      '눈': '❄️',
    };
    return icons[condition] || '🌤️';
  };

  const getTemperatureColor = (temp) => {
    if (temp < 0) return 'text-blue-600';
    if (temp < 10) return 'text-blue-400';
    if (temp < 20) return 'text-green-500';
    if (temp < 28) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        현재 날씨 {getWeatherIcon(weather.sky_condition)}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">위치</p>
          <p className="text-xl font-bold text-gray-800">{weather.location}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">기온</p>
          <p className={`text-3xl font-bold ${getTemperatureColor(weather.temperature)}`}>
            {weather.temperature}°C
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">날씨</p>
          <p className="text-xl font-bold text-gray-800">{weather.sky_condition}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">습도</p>
          <p className="text-xl font-bold text-gray-800">{weather.humidity}%</p>
        </div>
      </div>
      {weather.precipitation && weather.precipitation !== '없음' && (
        <div className="mt-4 bg-blue-100 p-3 rounded-lg">
          <p className="text-blue-800">
            <span className="font-bold">강수:</span> {weather.precipitation}
          </p>
        </div>
      )}
      {weather.note && (
        <p className="mt-4 text-xs text-gray-500 italic">{weather.note}</p>
      )}
    </div>
  );
};

export default WeatherDisplay;

