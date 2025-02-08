import { Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "./Header";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css'
import { useAppSelector } from "../store/store";

function App() {
  //const [darkMode, setDarkMode] = useState(getInitialDarkMode());
  const {darkMode} = useAppSelector(state => state.ui);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode:paletteType,
      background: {
        default: (paletteType === 'light') ? '#eaeaea' : '#121212'
      }
    }
  })

  // function handleThemeChange(){
  //   useAppDispatch()
  //   //localStorage.setItem('darkMode', JSON.stringify(storedDarkMode))
  //   //setDarkMode(!darkMode);
  // }

  return (
      <ThemeProvider theme={theme}> 
      <ScrollRestoration/>
        <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
        <CssBaseline/>
        <Header/>
        <Container>
          <Outlet/>
        </Container>
      </ThemeProvider>
      )
}

export default App
