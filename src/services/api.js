import axios from 'axios';


const api = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  config => {
    console.log(`Requisição para: ${config.url}`);
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error(`Erro ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('Erro de rede:', error.message);
    } else {
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;