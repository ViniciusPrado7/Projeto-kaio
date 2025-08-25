import { Box, Button, FormControl, FormLabel, Input, useTheme} from '@mui/material'
import React, { useState } from 'react'

const Weather = () => {

  const [busca, setBusca] = useState("");
  const [quantidadeDias, setQuantidadeDias] = useState("");
  const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "75vh"
            }}
        >
              <Box
                sx={{
                    width: 600,
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid gray",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <form  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <FormControl fullWidth required>
                        <FormLabel sx={{ color: theme.palette.azul }}>Nome cidade:</FormLabel>
                        <Input type='text' onChange={(e) => setBusca(e.target.value)} value={busca} placeholder="Digite sua busca" />
                    </FormControl>

                    <FormControl fullWidth required>
                        <FormLabel sx={{ color: theme.palette.azul }}>Dias:</FormLabel>
                        <Input type='number' onChange={(e) => setQuantidadeDias(e.target.value)} value={quantidadeDias} placeholder="Digite a quantidade de dias" />
                    </FormControl>
                    <Button type='submit' variant="contained" sx={{ backgroundColor: theme.palette.azul, color: 'white', alignSelf: 'center' }}>
                        Buscar
                    </Button>
                </form>
            </Box>
        </Box>
    )
}

export default Weather