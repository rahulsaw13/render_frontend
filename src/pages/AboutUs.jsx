// utils
import { useState, useEffect } from 'react';

// Components
import Loading from '@common/Loading';
import Navbar from '@userpage/Navbar';
import Footer from '@userpage/Footer';
import { allApi } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import AboutUsFrontImage from "@assets/about-us.webp";
import AboutUsBannerImage from "@assets/about-us-banner.webp";
import AboutUs1Image from "@assets/about-us1.webp";
import AboutUs2Image from "@assets/about-us2.webp";
import AboutUs3Image from "@assets/about-us3.webp";
import AboutUs1Svg from "@assets/about-us1.svg";
import AboutUs2Svg from "@assets/about-us2.svg";
import AboutUs3Svg from "@assets/about-us3.svg";
import AboutUs4Svg from "@assets/about-us4.svg";
import Image from "@common/Image";

const AboutUs = () => {
  const [loader, setLoader] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [footerRangeList, setFooterRangeList] = useState([]);

  const fetchMenuList = () => {
    setLoader(true);
    allApi(API_CONSTANTS.MENU_LIST_URL, "", "get")
      .then((response) => {
        if (response.status === 200) {
          let data = response?.data.filter((item, index) => index <= 6);
          setFooterRangeList(data);
          data?.push({ name: "About Us" });
          setMenuList(data);
        }
      })
      .catch(() => setLoader(false))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <>
      {loader ? <Loading /> :
        <>
          <Navbar data={menuList} />

          {/* Hero Section */}
          <div className="flex flex-col mt-16 lg:flex-row items-center bg-yellow-50">
            <div className="w-full lg:w-3/5 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
              <Image
                src={AboutUsFrontImage}
                alt="Sweets"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full lg:w-2/5 flex flex-col px-4 lg:pl-10 py-6 justify-center space-y-4">
              <h1 className="text-[#1D2E43] font-[playfair] text-[1.5rem] sm:text-[1.8rem] md:text-[2rem] font-bold">
                The Taste Of Royal India, Perfected Over Generations.
              </h1>
              <p className="text-base">Logo sweets, sweetening celebrations since 1988</p>
              <button className="w-fit px-6 py-2 text-sm sm:text-base text-white bg-[#caa446] rounded-md transition-all duration-300 border border-transparent hover:bg-transparent hover:text-yellow-600 hover:border-yellow-600">
                SHOP NOW
              </button>
            </div>
          </div>

          {/* Excellence Section */}
          <section className="container mx-auto text-center py-10 px-4">
            <h2 className="text-[#1D2E43] font-[playfair] text-[1.8rem] sm:text-[2rem] md:text-[2.1rem] font-bold">
              Excellence In Every Morsel
            </h2>
            <p className="mt-4 max-w-3xl mx-auto">
              For over 3 decades, Logo has grown to be synonymous with premium quality Indian Sweets. It has created a niche for itself for being one of the most premium and giftable brands in Bengaluru today.
            </p>
            <Image src={AboutUsBannerImage} alt="Sweets Grid" className="mt-6 mx-auto max-w-full h-auto" />
          </section>

          {/* Quality Section */}
          <section className="container mx-auto grid md:grid-cols-2 gap-8 px-4 py-8 items-center">
            <div className="space-y-4">
              <h3 className="text-[#1D2E43] font-[playfair] text-[1.6rem] sm:text-[1.9rem] font-bold">
                Quality That Delights, In Every Bite.
              </h3>
              <p>
                Over decades, Logo has grown to be synonymous with premium quality Indian sweets. Using technique, skill and science, our mithai artisans have perfected our recipes, packaging and processes. At hygienic, state-of-the-art making facility we mould over 30,000 kgs of sweets everyday to deliver noticeable freshness, patrons can feel, taste and enjoy. Only absolutely fresh, carefully selected ingredients sourced from the best across the country go into making every bite.
              </p>
            </div>
            <Image src={AboutUs1Image} alt="Holding Sweet" className="w-full h-auto" />
          </section>

          {/* About Us Section */}
          <section className="container mx-auto grid md:grid-cols-2 gap-8 px-4 py-8 items-center">
            <Image src={AboutUs2Image} alt="Round Sweets" className="w-full h-auto" />
            <div className="space-y-4">
              <h3 className="text-[#1D2E43] font-[playfair] text-[1.6rem] sm:text-[1.9rem] font-bold">
                Taste Of Royal India
              </h3>
              <p>
                Logo owes its success to its know-how that is the culmination of tradition, innovation and uncompromising quality. The dynamism of Logo is also the result of its unrelenting quest to restyle and update its product range, packaging, to cater to the changing demographic and dynamics of changing India.
              </p>
            </div>
          </section>

          {/* Philosophy Section */}
          <section className="container mx-auto grid md:grid-cols-2 gap-8 px-4 py-8 items-center">
            <div className="space-y-4">
              <h3 className="text-[#1D2E43] font-[playfair] text-[1.6rem] sm:text-[1.9rem] font-bold">
                Luxurious Mithais, Accessible To Everyone
              </h3>
              <p>
                We are obsessed with authenticity and believe in curating flavours that suit your taste and your celebrations. The sweet smelling saffron in our Malpua we get from Kashmir, and the melt-in-your-mouth paneer in our savouries from Delhi - because great taste can never have boundaries.
              </p>
            </div>
            <Image src={AboutUs3Image} alt="Luxury Sweets" className="w-full h-auto" />
          </section>

          {/* Awards */}
          <section className="w-full text-center py-10 px-8 bg-gray-50">
            <h2 className="text-[#1D2E43] font-[playfair] text-[1.8rem] sm:text-[2rem] md:text-[2.1rem] font-bold">
              Awards and Accreditations
            </h2>
            <p className="mt-4">
              As the most hygienic facility in the country, Logo has also been accredited by multiple health and food societies of the world. These accreditations require one adhere to strict quality norms Logo is one of the select few companies in India who has an ISO 22000:2018 certification. It is also a Halal Certified Company, along with certifications from Spice Board of India.
            </p>
            <p className="mt-6">
              In addition, Logo's quest for authenticity and precision has won us numerous accolades, including the Times Food Award for the Best Mithai in Bangalore for 12 years in a row.
            </p>
          </section>

          {/* Certifications Section */}
          <section className="container mx-auto text-center py-10 px-4 bg-gray-50">
            <h2 className="text-[#1D2E43] font-[playfair] text-[1.8rem] sm:text-[2rem] md:text-[2.1rem] font-bold">
              Certifications
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 mt-6">
              <Image src={AboutUs1Svg} alt="Cert1" className="h-20 sm:h-24 md:h-28" />
              <Image src={AboutUs2Svg} alt="Cert2" className="h-20 sm:h-24 md:h-28" />
              <Image src={AboutUs3Svg} alt="Cert3" className="h-20 sm:h-24 md:h-28" />
              <Image src={AboutUs4Svg} alt="Cert4" className="h-20 sm:h-24 md:h-28" />
            </div>
          </section>

          <Footer data={footerRangeList}/>
        </>
      }
    </>
  );
};

export default AboutUs;