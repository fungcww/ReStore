import { useEffect, useState } from "react"
import {Product} from "../models/product";
import Catalog from "../../features/Catalog/Catalog";
import { Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "./Header";
import { dark } from "@mui/material/styles/createPalette";
import { Outlet } from "react-router-dom";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode:paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  function handleThemeChange(){
    setDarkMode(!darkMode);
  }

  return (
      <ThemeProvider theme={theme}> 
        <CssBaseline/>
        <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
        <Container>
          <Outlet/>
        </Container>
      </ThemeProvider>
      )
}

export default App
