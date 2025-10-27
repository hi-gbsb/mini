import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const weatherAPI = {
  getWeather: async (location) => {
    const response = await api.get(`/api/weather?location=${location}`);
    return response.data;
  },
};

export const recommendAPI = {
  getRecommendation: async (data) => {
    const response = await api.post('/api/recommend', data);
    return response.data;
  },
};

export const recipeAPI = {
  getRecipe: async (menuName, numServings = 1) => {
    const response = await api.post('/api/recipe', {
      menu_name: menuName,
      num_servings: numServings
    });
    return response.data;
  },
};

export default api;

