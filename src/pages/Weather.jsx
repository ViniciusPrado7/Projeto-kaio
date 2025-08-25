import { Box, Button, FormControl, FormLabel, Input, useTheme } from '@mui/material'
import React, { useState } from 'react'

const Weather = () => {
  const theme = useTheme()
  const [cidade, setCidade] = useState("São Paulo")
  const [dias, setDias] = useState("5")

  function handleSubmit(e) {
    e.preventDefault()

  }

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
      </Box>
    </Box>
  )
}

export default Weather
