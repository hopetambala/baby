import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./carousel.module.css";

export const Carousel = ({ items }) => {
  // const [helperText, setHelperText] = useState("Swipe left on text to see more");
  return (
    <Swiper
      navigation={true}
      draggable={false}
      pagination={true}
      scrollbar={true}
      modules={[Navigation, Pagination]}
      // onSlideChange={() => setHelperText("Continue swiping on text to continue the story...")}
      // onReachEnd={() =>
      //   setHelperText("End! Swipe back/right if you'd like to read again.")
      // }
    >
      {items &&
        items.map((item, i) => (
          <SwiperSlide>
              {item}
              {/* <br />
              <em>
                <p>{helperText}</p>
              </em> */}
          </SwiperSlide>
        ))}
    </Swiper>
  );
};
