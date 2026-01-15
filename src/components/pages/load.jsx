
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import {
    BrowserRouter as Router,
    useNavigate 
  } from "react-router-dom";
import { ReactSession } from 'react-client-session';
  
export function LoadPage() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Loading...');

    useEffect(() => {
        const checkAuth = () => {
            const user = ReactSession.get('user');
            if (user) {
                setStatus('Redirecting...');
                if (user.is_pdpa_accepted == 1) {
                    navigate('/home');
                } else {
                    navigate('/terms');
                }
            } else {
                navigate('/login');
            }
        };

        const timer = setTimeout(checkAuth, 1000);
        return () => clearTimeout(timer);
    }, [navigate]);


    return (
      <Box
        sx={{
          height:'100vh',
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center',
          background:"#F4F3FE"
        }}
      >
        <Box
          component="img"
          sx={{
            width: '50%',
            textAlign:'center',
          }}
          src="/images/logo3.png"
        />
        <Box sx={{ mt: 2, fontSize: '14px', color: '#666' }}>
          {status}
        </Box>

      </Box>
    );
}