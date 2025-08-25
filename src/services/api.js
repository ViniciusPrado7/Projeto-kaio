import axios from 'axios';

// Criar instância do Axios com configurações base
const api = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
    // Se a API exigisse chave: 'Authorization': `Bearer ${API_KEY}`
  }
});

// Interceptor para requisições (ex: logs, autenticação)
api.interceptors.request.use(
  config => {
    console.log(`Requisição para: ${config.url}`);
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para respostas (ex: tratamento global de erros)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Erros HTTP (4xx, 5xx)
      console.error(`Erro ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // Sem resposta do servidor
      console.error('Erro de rede:', error.message);
    } else {
      // Outros erros
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;