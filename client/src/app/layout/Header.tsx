import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import {
  Badge,
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import agent from "../api/agent";
import { Basket } from "../models/basket";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setDarkMode } from "./uiSlice";

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const navStyle = { color: "inherit",
    Typography: "h6",
    '&:hover':{
       color:'grey.500'
    },
    '&.active':{
       color:'text.secondary'
    }
   }


export default function Header() {
    const {isLoading, darkMode} = useAppSelector(state => state.ui)
    const dispatch = useAppDispatch();
    //const [isLoading, setLoading] = useState();
    const [basket, setBasket] = useState<Basket | null>(null);
  useEffect(() => {
    agent.Basket.get()
    .then(basket => setBasket(basket))
    .catch(error => console.log(error))
    //.finally(() => setLoading(false))
}, [])
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar sx={{display:'flex', justifyContent: 'space-between', alignItems:'center'}}>
        <Box display='flex' alignItems='center'>
        <Typography variant="h6" component={NavLink} to="/" sx={{ color: "inherit", textDecoration: "none" }}>RE-STORE</Typography>
        <Switch checked={darkMode} onChange={() => dispatch(setDarkMode())} />
        <IconButton onClick={() => dispatch(setDarkMode())}>{darkMode ? <DarkMode /> : <LightMode sx={{color: 'yellow'}}/>}</IconButton>
        </Box>

        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={navStyle}
            >
              {title.toLocaleUpperCase()}
            </ListItem>
          ))}
        </List>

        <Box display='flex' alignItems='center'>
        <IconButton component={Link} to='/basket' size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
          <Badge badgeContent={basket?.items.length || 0} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
        <List sx={{ display: "flex" }}>
          {rightLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={navStyle}
            >
              {title.toLocaleUpperCase()}
            </ListItem>
          ))}
        </List>
        </Box>
      </Toolbar>
      {isLoading && (
        <Box sx={{width:'100%'}}>
          <LinearProgress color="secondary"/>
        </Box>
      )}
    </AppBar>
  );
}
