// Libraries
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from "react-i18next";

// Components
import CollectionCard from '@userpage-components/CollectionCard';
import 'swiper/css';
import 'swiper/css/bundle';

const Collection = ({ data }) => {
  const { t } = useTranslation("msg");

  return (
    <div className="px-4 sm:px-6 md:px-10 py-10">
      <div className="hero-sub-section w-full flex flex-col justify-center items-center mb-10">
        <div className="hero-sub-section-heading w-full sm:w-[90%] md:w-[80%] pb-4">
          <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] text-[#1D2E43] font-semibold text-center font-[playfair] leading-snug">
            {t("gifting_collection_heading")}
          </h1>
        </div>
        <div className="hero-sub-section-text w-full sm:w-[90%] md:w-[60%]">
          <p className="text-center text-sm sm:text-base text-[#333]">
            {t("gifting_collection_heading_description")}
          </p>
        </div>
      </div>

      <Swiper
        spaceBetween={16}
        loop={true}
        allowTouchMove={true}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1.5,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          }
        }}
      >
        {data.map((item) => (
          <SwiperSlide key={item?.id}>
            <CollectionCard data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Collection;
