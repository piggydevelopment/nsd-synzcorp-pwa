// import missing

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Button from '@mui/material/Button';
import '@splidejs/react-splide/css';
import '../../assets/css/base.css';
import { ReactSession } from 'react-client-session';
import { Link } from "react-router-dom";
export const Specialist = (props) => {
    const [type, setType] = useState(props.type);
    const [data, setData] = useState(props.data);

    return (
        <Box sx={{ p: 3 }}>
            <div className='ts2' style={{ marginBottom: '20px' }}>
                {type}
            </div>

            <Splide
                options={{
                    type: 'loop',
                    gap: '0.5rem',
                    arrows: false,
                    padding: '20%',
                    focus: 'center'
                }}
            >
                {
                    data.map((item) => (
                        <SplideSlide key={item.id}>
                            <Card sx={{ border: 0, boxShadow: 'unset' }}>
                                <CardActionArea>
                                    <Link
                                        to={`/appointment/${item.id}`}
                                    >
                                        <CardMedia
                                            component="img"
                                            className='experimgcard'
                                            image={item.profile_pic_file_name}
                                            alt="green iguana"
                                        />
                                    </Link>

                                    <CardContent className='cardcontent' sx={{ backgroundColor: '#6565651c' }}>
                                        <Typography gutterBottom textAlign={'center'} className='NotoSansThai ts-1' component="div">
                                            {item.prefix + item.firstname + ' ' + item.lastname}
                                        </Typography>
                                        <Typography color="text.secondary" mb={1} className='NotoSansThai ts-3' textAlign={'center'}>
                                            {type}
                                        </Typography>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            {item.topics_json.map((topic) => (
                                                <div className='tag' key={topic.id}> <img src={topic.icon_file_name} className='me-2 sm-icon' /> {topic.name}</div>
                                            ))
                                            }
                                        </div>
                                        <Button
                                            variant="contained"
                                            component={Link}
                                            fullWidth
                                            className='NotoSansThai'
                                            to={`/appointment/${item.id}`}
                                            sx={{
                                                borderRadius: 30,
                                                backgroundColor: '#461E99',
                                                padding: '7px 32px',
                                                fontSize: '16px',
                                                marginTop: '10px'
                                            }}
                                        >ปรึกษา </Button>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </SplideSlide>
                    ))
                }
            </Splide>
        </Box>
    )
}