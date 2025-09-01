import { Route, Routes } from 'react-router-dom'
import './App.css'
import Weather from './pages/weather'


function App() {


  return (
    <Routes>
      <Route path='/' element={<Weather />} />
    </Routes>
  )
}

export default App
