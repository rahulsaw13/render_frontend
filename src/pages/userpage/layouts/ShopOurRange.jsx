// utils
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from "react-i18next";
import 'swiper/css/bundle';

// components
import RangeCard from '@userpage-components/RangeCard';

const ShopOurRange = ({ data }) => {
  const { t } = useTranslation("msg");

  return (
    <div className="px-4 sm:px-6 md:px-10 py-10">
      <h1 className="text-[1.8rem] sm:text-[2rem] md:text-[2.5rem] font-bold pb-8 text-[#1D2E43] font-[playfair] text-center md:text-left">
        {t("shop_our_range")}
      </h1>

      <Swiper
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
          },
          480: {
            slidesPerView: 1.5,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {data.map((item) => (
          <SwiperSlide key={item?.id}>
            <RangeCard data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ShopOurRange;