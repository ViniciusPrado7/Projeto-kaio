import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Chip,
  useTheme 
} from '@mui/material';
import { 
  WbSunny, 
  Cloud, 
  Grain, 
  Air, 
  Thermostat,
  Water,
  Visibility,
  Schedule
} from '@mui/icons-material';

/**
 * Mapeia códigos de clima para ícones e descrições
 */
const getWeatherInfo = (weatherCode) => {
  const weatherMap = {
    0: { icon: <WbSunny />, description: 'Céu limpo', color: '#FFA726' },
    1: { icon: <WbSunny />, description: 'Principalmente limpo', color: '#FFB74D' },
    2: { icon: <Cloud />, description: 'Parcialmente nublado', color: '#90A4AE' },
    3: { icon: <Cloud />, description: 'Nublado', color: '#78909C' },
    45: { icon: <Visibility />, description: 'Neblina', color: '#B0BEC5' },
    48: { icon: <Visibility />, description: 'Neblina com geada', color: '#B0BEC5' },
    51: { icon: <Grain />, description: 'Garoa leve', color: '#64B5F6' },
    53: { icon: <Grain />, description: 'Garoa moderada', color: '#42A5F5' },
    55: { icon: <Grain />, description: 'Garoa intensa', color: '#2196F3' },
    61: { icon: <Grain />, description: 'Chuva leve', color: '#1E88E5' },
    63: { icon: <Grain />, description: 'Chuva moderada', color: '#1976D2' },
    65: { icon: <Grain />, description: 'Chuva intensa', color: '#1565C0' },
    80: { icon: <Grain />, description: 'Pancadas de chuva leves', color: '#1E88E5' },
    81: { icon: <Grain />, description: 'Pancadas de chuva moderadas', color: '#1976D2' },
    82: { icon: <Grain />, description: 'Pancadas de chuva intensas', color: '#1565C0' }
  };
  
  return weatherMap[weatherCode] || { 
    icon: <Cloud />, 
    description: 'Condição desconhecida', 
    color: '#90A4AE' 
  };
};

/**
 * Componente para exibir clima atual
 */
export const CurrentWeather = ({ data, cityInfo }) => {
  const theme = useTheme();
  
  if (!data?.current_weather) {
    return null;
  }

  const current = data.current_weather;
  const weatherInfo = getWeatherInfo(current.weathercode);

  return (
    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <CardContent sx={{ color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          {cityInfo?.city || 'Localização'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
          {cityInfo?.country}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ fontSize: '3rem', mr: 2, color: weatherInfo.color }}>
            {weatherInfo.icon}
          </Box>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
              {Math.round(current.temperature)}°C
            </Typography>
            <Typography variant="h6">
              {weatherInfo.description}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Air sx={{ mr: 1 }} />
              <Typography>
                Vento: {current.windspeed} km/h
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Schedule sx={{ mr: 1 }} />
              <Typography>
                {new Date(current.time).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

/**
 * Componente para exibir previsão diária
 */
export const DailyForecast = ({ data, days }) => {
  const theme = useTheme();
  
  if (!data?.daily) {
    return null;
  }

  const daily = data.daily;
  const displayDays = Math.min(days || 7, daily.time.length);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.azul.main }}>
          Previsão para {displayDays} dias
        </Typography>
        
        <Grid container spacing={2}>
          {daily.time.slice(0, displayDays).map((date, index) => {
            const weatherInfo = getWeatherInfo(daily.weather_code[index]);
            const dayName = new Date(date).toLocaleDateString('pt-BR', { 
              weekday: 'short',
              day: '2-digit',
              month: '2-digit'
            });

            return (
              <Grid item xs={12} sm={6} md={4} key={date}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    {dayName}
                  </Typography>
                  
                  <Box sx={{ fontSize: '2rem', color: weatherInfo.color, my: 1 }}>
                    {weatherInfo.icon}
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {weatherInfo.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {Math.round(daily.temperature_2m_max[index])}°
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {Math.round(daily.temperature_2m_min[index])}°
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

/**
 * Componente para exibir previsão horária (próximas 24h)
 */
export const HourlyForecast = ({ data }) => {
  const theme = useTheme();
  
  if (!data?.hourly) {
    return null;
  }

  const hourly = data.hourly;
  const next24Hours = hourly.time.slice(0, 24);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.azul.main }}>
          Próximas 24 horas
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: 2, 
          pb: 1,
          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.azul.main,
            borderRadius: 3,
          }
        }}>
          {next24Hours.map((time, index) => {
            const hour = new Date(time).getHours();
            const temp = Math.round(hourly.temperature_2m[index]);
            const humidity = hourly.relative_humidity_2m[index];
            const precipitation = hourly.precipitation_probability[index];
            const windSpeed = Math.round(hourly.wind_speed_10m[index]);

            return (
              <Card 
                key={time} 
                variant="outlined" 
                sx={{ 
                  minWidth: 120, 
                  textAlign: 'center', 
                  p: 1.5,
                  flexShrink: 0
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  {hour}:00
                </Typography>
                
                <Typography variant="h6" sx={{ my: 1, fontWeight: 'bold' }}>
                  {temp}°C
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Chip 
                    icon={<Water />} 
                    label={`${humidity}%`} 
                    size="small" 
                    variant="outlined"
                  />
                  {precipitation > 0 && (
                    <Chip 
                      icon={<Grain />} 
                      label={`${precipitation}%`} 
                      size="small" 
                      color="primary"
                    />
                  )}
                  <Chip 
                    icon={<Air />} 
                    label={`${windSpeed} km/h`} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              </Card>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
