import Zomato from "@assets/zomato.webp";
import SwiggyInstamart from "@assets/swiggy.webp";
import Amazon from "@assets/amazon.webp";
import Zepto from "@assets/zepto.webp";

const AvailablityPlatform = () => {
    const platform =  [
        {
            name: "Zomato",
            logo: Zomato
        },
        {
            name: "Swiggy Instamart",
            logo: SwiggyInstamart
        },
        {
            name: "Amazon",
            logo: Amazon
        },
        {
            name: "Zepto",
            logo: Zepto
        }
    ];

    return (
        <div className="flex flex-col justify-center items-center p-6 sm:p-10">
            <h1 className="font-semibold font-[playfair] text-[2.5rem] text-[#1D2E43] text-center">We Are Also Available On</h1>
            <p className="text-[16px] font-medium pt-2 font-[playfair] text-[#464646] text-center">Same day delivery in Bangalore</p>
            <div className="flex flex-wrap justify-center md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 p-5">
                {
                    platform.map((item, index) => {
                        return (
                            <a href={item.url} key={index} className="flex justify-center items-center">
                                <img src={item.logo} alt={item.name} className="max-w-[120px] h-[80px] aspect-[3.0] object-contain" />
                            </a>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default AvailablityPlatform;