import api from './api';

/**
 * Obtém dados climáticos atuais e previsão
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {Object} options - Parâmetros opcionais
 * @returns {Promise<Object>} Dados da API
 */
export const getWeatherData = async (latitude, longitude, options = {}) => {
  const params = {
    latitude,
    longitude,
    current_weather: true,
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'wind_speed_10m',
      'weather_code'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset'
    ].join(','),
    timezone: 'auto',
    ...options // Permite sobrescrever parâmetros
  };

  try {
    const response = await api.get('/forecast', { params });
    return response.data;
  } catch (error) {
    console.error('Falha ao obter dados do clima:', error);
    throw new Error('Não foi possível obter os dados climáticos');
  }
};