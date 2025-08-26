import axios from 'axios';

/**
 * Serviço de geocoding usando OpenStreetMap Nominatim API
 * Converte nome da cidade em coordenadas (latitude, longitude)
 */

// Instância separada para geocoding
const geocodingApi = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
  timeout: 10000,
  headers: {
    'User-Agent': 'WeatherApp/1.0'
  }
});

/**
 * Busca coordenadas de uma cidade pelo nome
 * @param {string} cityName - Nome da cidade
 * @returns {Promise<Object>} Objeto com latitude, longitude e nome formatado
 */
export const getCityCoordinates = async (cityName) => {
  if (!cityName || cityName.trim() === '') {
    throw new Error('Nome da cidade é obrigatório');
  }

  try {
    const response = await geocodingApi.get('/search', {
      params: {
        q: cityName,
        format: 'json',
        limit: 1,
        addressdetails: 1,
        'accept-language': 'pt-BR,pt,en'
      }
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(`Cidade "${cityName}" não encontrada`);
    }

    const location = response.data[0];
    
    return {
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
      displayName: location.display_name,
      city: location.address?.city || location.address?.town || location.address?.village || cityName,
      country: location.address?.country || 'País não identificado'
    };
  } catch (error) {
    if (error.response) {
      console.error('Erro na API de geocoding:', error.response.data);
      throw new Error('Erro ao buscar localização da cidade');
    } else if (error.request) {
      console.error('Erro de rede no geocoding:', error.message);
      throw new Error('Erro de conexão. Verifique sua internet');
    } else {
      console.error('Erro no geocoding:', error.message);
      throw error;
    }
  }
};

/**
 * Busca múltiplas sugestões de cidades
 * @param {string} cityName - Nome da cidade
 * @param {number} limit - Número máximo de sugestões (padrão: 5)
 * @returns {Promise<Array>} Array com sugestões de cidades
 */
export const getCitySuggestions = async (cityName, limit = 5) => {
  if (!cityName || cityName.trim() === '') {
    return [];
  }

  try {
    const response = await geocodingApi.get('/search', {
      params: {
        q: cityName,
        format: 'json',
        limit: limit,
        addressdetails: 1,
        'accept-language': 'pt-BR,pt,en'
      }
    });

    return response.data.map(location => ({
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
      displayName: location.display_name,
      city: location.address?.city || location.address?.town || location.address?.village || cityName,
      country: location.address?.country || 'País não identificado'
    }));
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error);
    return [];
  }
};
