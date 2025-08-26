import { Box, Button, FormControl, FormLabel, Input, Card, CardContent, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import api from '../services/api'

const weatherIcons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    61: "🌧️",
    71: "❄️",
    95: "⛈️",
}

const Weather = () => {
    const theme = useTheme()
    const [cidade, setCidade] = useState("São Paulo")
    const [dias, setDias] = useState("5")
    const [dados, setDados] = useState(null)

    async function buscarCidade(nomeCidade, qtdDias) {
        try {
            let latitude = -23.55
            let longitude = -46.63
            let nome = "São Paulo"

            if (nomeCidade.toLowerCase() !== "são paulo" && nomeCidade.toLowerCase() !== "sao paulo") {
                const geoRes = await api.get(`https://geocoding-api.open-meteo.com/v1/search`, {
                    params: { name: nomeCidade, count: 1 }
                })

                const geoData = geoRes.data
                if (geoData.results && geoData.results.length > 0) {
                    latitude = geoData.results[0].latitude
                    longitude = geoData.results[0].longitude
                    nome = geoData.results[0].name
                } else {
                    alert("Cidade não encontrada!")
                    return
                }
            }

            const weatherRes = await api.get(`/forecast`, {
                params: {
                    latitude,
                    longitude,
                    daily: "temperature_2m_max,temperature_2m_min,weathercode",
                    forecast_days: qtdDias,
                    timezone: "auto"
                }
            })

            setDados({ ...weatherRes.data, nome })
        } catch (error) {
            console.error("Erro ao buscar dados:", error)
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        buscarCidade(cidade, dias)
    }

    useEffect(() => {
        buscarCidade("São Paulo", dias)
    }, [])

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
            <Box sx={{ width: 600, p: 3, borderRadius: 2, border: "1px solid gray" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <FormControl fullWidth>
                        <FormLabel sx={{ color: theme.palette.azul.main }}>Cidade:</FormLabel>
                        <Input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Digite a cidade" />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel sx={{ color: theme.palette.azul.main }}>Dias:</FormLabel>
                        <Input type="number" value={dias} onChange={(e) => setDias(e.target.value)} placeholder="Quantidade de dias" />
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.azul.main,
                            color: "white",
                            alignSelf: "center",
                            "&:hover": { backgroundColor: theme.palette.azul.hover }
                        }}
                    >
                        Buscar
                    </Button>
                </form>

                {dados && (
                    <Box mt={3} sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 2 }}>
                        {dados.daily.time.map((dia, i) => (
                            <Card key={dia} sx={{ p: 2, borderRadius: 3, backgroundColor: "#f9f9f9", textAlign: "center", boxShadow: 3 }}>
                                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                    <Typography variant="h3">{weatherIcons[dados.daily.weathercode[i]] || "☁️"}</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {new Date(dia).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {dados.daily.temperature_2m_min[i]}°C - {dados.daily.temperature_2m_max[i]}°C
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default Weather
