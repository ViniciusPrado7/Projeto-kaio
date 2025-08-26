import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  useTheme, 
  Alert,
  CircularProgress,
  Container,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { getCityCoordinates } from '../services/geocodingService'
import { getWeatherData } from '../services/weatherService'
import { CurrentWeather, DailyForecast, HourlyForecast } from '../components/WeatherDisplay'

const Weather = () => {
  const [busca, setBusca] = useState("");
  const [quantidadeDias, setQuantidadeDias] = useState("7");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [cityInfo, setCityInfo] = useState(null);
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!busca.trim()) {
      setError("Por favor, digite o nome de uma cidade");
      return;
    }

    if (!quantidadeDias || quantidadeDias < 1 || quantidadeDias > 16) {
      setError("Quantidade de dias deve ser entre 1 e 16");
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);
    setCityInfo(null);

    try {
      // 1. Buscar coordenadas da cidade
      console.log('Buscando coordenadas para:', busca);
      const coordinates = await getCityCoordinates(busca);
      console.log('Coordenadas encontradas:', coordinates);
      
      setCityInfo(coordinates);

      // 2. Buscar dados climáticos
      console.log('Buscando dados climáticos...');
      const weather = await getWeatherData(
        coordinates.latitude, 
        coordinates.longitude,
        {
          forecast_days: parseInt(quantidadeDias)
        }
      );
      console.log('Dados climáticos recebidos:', weather);
      
      setWeatherData(weather);
    } catch (err) {
      console.error('Erro na busca:', err);
      setError(err.message || "Erro ao buscar dados climáticos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          color: theme.palette.azul.main,
          fontWeight: 'bold',
          mb: 4
        }}
      >
        Previsão do Tempo
      </Typography>

      {/* Formulário de Busca */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: theme.palette.azul.main,
            backgroundColor: 'white',
            boxShadow: 2
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormControl fullWidth required>
              <FormLabel sx={{ color: theme.palette.azul.main, fontWeight: 'bold' }}>Nome da cidade:</FormLabel>
              <Input 
                type='text' 
                onChange={(e) => setBusca(e.target.value)} 
                value={busca} 
                placeholder="Ex: São Paulo, Rio de Janeiro, Londres" 
                disabled={loading}
                sx={{ mt: 1 }}
              />
            </FormControl>

            <FormControl fullWidth required>
              <FormLabel sx={{ color: theme.palette.azul.main, fontWeight: 'bold' }}>Dias de previsão:</FormLabel>
              <Input 
                type='number' 
                onChange={(e) => setQuantidadeDias(e.target.value)} 
                value={quantidadeDias} 
                placeholder="Digite a quantidade de dias (1-16)" 
                inputProps={{ min: 1, max: 16 }}
                disabled={loading}
                sx={{ mt: 1 }}
              />
            </FormControl>
            
            <Button 
              type='submit' 
              variant="contained" 
              disabled={loading}
              sx={{ 
                backgroundColor: theme.palette.azul.main, 
                color: 'white', 
                alignSelf: 'center',
                minWidth: 120,
                py: 1.5,
                '&:hover': {
                  backgroundColor: theme.palette.azul.hover
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Buscar'}
            </Button>
          </form>
        </Box>
      </Box>

      {/* Mensagem de Erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Exibição dos Dados Climáticos */}
      {weatherData && cityInfo && (
        <Box>
          <CurrentWeather data={weatherData} cityInfo={cityInfo} />
          <DailyForecast data={weatherData} days={parseInt(quantidadeDias)} />
          <HourlyForecast data={weatherData} />
        </Box>
      )}
    </Container>
  )
}

export default Weather