import Since1988 from "@assets/since_1988.webp";
import MakeInIndia from "@assets/make_in_india.webp";
import EcoFriendly from "@assets/eco_friendly.webp";
import FastDelivery from "@assets/fast_delivery.webp";

const TrustUs = () => {
    return (
      <div className="flex flex-col justify-center items-center p-6 sm:p-10">
        <h2 className="font-sans font-semibold text-center mt-2 text-sm sm:text-base md:text-lg">
          You Can Trust Us
        </h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-1 text-[#1D2E43] font-[playfair]">
          Clean, Authentic and Sustainable
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 px-4 sm:px-10 py-6 justify-center items-center">
          <img
            src={MakeInIndia}
            alt="Make in India"
            className="w-20 sm:w-24 md:w-32"
          />
          <img
            src={Since1988}
            alt="Since 1988"
            className="w-20 sm:w-28 md:w-36"
          />
          <img
            src={EcoFriendly}
            alt="Eco Friendly"
            className="w-20 sm:w-24 md:w-32"
          />
          <img
            src={FastDelivery}
            alt="Fast Delivery"
            className="w-20 sm:w-24 md:w-32"
          />
        </div>
      </div>
    );
  };
  
  export default TrustUs;  