import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Button from "@mui/material/Button";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";

export default function Banner(props) {
  let [banners, setbanners] = useState(props.data);
  const navigate = useNavigate();
  useEffect(() => {
    setbanners(props.data);
  }, [props.data]);

  const handleItemClick = (item) => {
    if (props.onItemClick) {
      props.onItemClick(item);
    } else {
      window.open(item.url_link, "_blank");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Splide
        options={{
          type: "loop",
          gap: "0.5rem",
          arrows: false,
          padding: "8%",
          focus: "center",
          rewind: true,
          autoplay: "true",
          autoScroll: {
            speed: 1,
          },
        }}
      >
        {banners.map((item, index) => (
          <SplideSlide
            key={index}
            onClick={() => handleItemClick(item)}
            style={{ cursor: "pointer" }}
          >
            <img src={item.image_url} className="imgslide" alt={item.name} />
          </SplideSlide>
        ))}
      </Splide>
    </Box>
  );
}
