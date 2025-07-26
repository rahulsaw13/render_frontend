import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { FestivalSpecialFooter } from '@constants/shopdata.js';

const FestivalSpecial = ({ data, onload }) => {
  const navigate = useNavigate();

  return (
    <div className={`${data?.length > 0 ? "" : 'hidden'} mt-[4.3rem]`}>
      <Swiper
        spaceBetween={30}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        pagination={true}
        speed={2500}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false
        }}
        modules={[EffectFade, Autoplay, Pagination]}
        className="mySwiper w-full h-[calc(100vh-68px)] md:h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)]"
      >
        {data?.map((item, index) => (
          <SwiperSlide key={item?.id}>
            <img
              src={item?.image_url}
              alt={item?.name}
              onLoad={()=>{
                onload(index);
              }}
              onClick={() => {
                navigate(`/festival-special`, {
                  state: { fest_name: item?.name }
                });
              }}
              className="block w-full h-full object-cover hover:cursor-pointer"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero-sub-section w-full flex flex-col justify-center items-center px-4 py-10 md:py-16 bg-[#fafafa]">
        <div className="hero-sub-section-heading w-full md:w-[80%] pb-4 md:pb-6">
          <h1 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] text-[#1D2E43] font-semibold text-center font-[playfair]">
            {FestivalSpecialFooter?.title}
          </h1>
        </div>
        <div className="hero-sub-section-text w-full sm:w-[90%] md:w-[70%] lg:w-[60%]">
          <p className="text-center text-sm sm:text-base text-[#333] leading-relaxed">
            {FestivalSpecialFooter?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FestivalSpecial;