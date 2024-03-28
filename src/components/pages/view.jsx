import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
export function ViewPage(props) {
  const location = useLocation();
    const [uri, setUri] = useState(location.state.item.url_link);

    return (
      <Box
        sx={{
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center',
          background:"#F4F3FE"
        }}
      >
      <AppBar position="relative" sx={{ backgroundColor: '#FFF', color: '#000', boxShadow: 'unset', paddingTop: '10px' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, position: "absolute" }} 
            href="/home"
          >
            <ArrowBackIosNewOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: '94vh', width: '100%' }}>
        <iframe src={uri}
        style={{borderWidth: '0px', minHeight: '94vh', width: '100%'}}></iframe>
      </Box>
      </Box>
    );
}