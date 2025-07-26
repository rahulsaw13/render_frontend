// Utils
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';

// Components
import ProductCard from '@userpage-component';

const ProductCardSwipper = ({ data }) => {
    return (
        <Swiper
            modules={[Autoplay]}
            spaceBetween={20} // Adjust the space between slides for better spacing on smaller screens
            autoplay={{ delay: 3000 }}
            breakpoints={{
                // When window width is >= 320px (small screens like mobile)
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10, // smaller space for mobile screens
                },
                // When window width is >= 768px (tablet screens)
                768: {
                    slidesPerView: 2, // show 2 slides
                    spaceBetween: 20, // a bit more space between slides
                },
                // When window width is >= 1024px (desktop screens)
                1024: {
                    slidesPerView: 3, // show 3 slides
                    spaceBetween: 30, // medium space between slides
                },
            }}
        >
            {data.map((item) => (
                <SwiperSlide key={item?.id}>
                    <div className="w-full h-60 bg-gray-200 rounded-lg">
                        <ProductCard data={item} />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ProductCardSwipper;