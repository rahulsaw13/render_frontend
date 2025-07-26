// Utils
import { useTranslation } from "react-i18next";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// components
import { shopdata } from '@constants/shopdata.js';
import { API_CONSTANTS } from "@constants/apiurl";
import { allApi } from "@api/api";
import Logo from "@assets/logo.webp";
import { ROUTES_CONSTANTS } from "@constants/routesurl";

const Footer = ({data}) => {
    const { t } = useTranslation("msg");
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [rangeData, setRangeData] = useState([]);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const subscribe = () => {
        let body = {
            email: email
        };
        allApi(API_CONSTANTS.SUBSCRIBE_USER_BY_MAIL_URL, body, "post")
        .then((response) => {
            if (response?.status === 200) {
                setErrorMessage(response?.data?.message);
            } else {
                setErrorMessage("");
            }
            setSubmitted(true);
            setEmail("");
        })
        .catch((err) => {})
        .finally(() => {});
    };

    useEffect(()=>{
       if (!data || data.length < 6) return;

       const category = [
            {
                name: t("our_range"),
                list: [
                    {
                        name: data[0]?.name,
                        url: `${ROUTES_CONSTANTS?.VIEW_CATEGORY_DESCRIPTION}/${data[0]?.name}`
                    },
                    {
                        name: data[1]?.name,
                        url: `${ROUTES_CONSTANTS?.VIEW_CATEGORY_DESCRIPTION}/${data[1]?.name}`
                    },
                    {
                        name: data[2]?.name,
                        url: `${ROUTES_CONSTANTS?.VIEW_CATEGORY_DESCRIPTION}/${data[2]?.name}`
                    },
                    {
                        name: data[3]?.name,
                        url: `${ROUTES_CONSTANTS?.VIEW_CATEGORY_DESCRIPTION}/${data[3]?.name}`
                    },
                    {
                        name: data[4]?.name,
                        url: `${ROUTES_CONSTANTS?.VIEW_CATEGORY_DESCRIPTION}/${data[4]?.name}`
                    },
                    {
                        name: data[5]?.name,
                        url: `${ROUTES_CONSTANTS?.VIEW_CATEGORY_DESCRIPTION}/${data[5]?.name}`
                    }
                ]
            },
            {
                name: t("about_us"),
                list: [
                    {
                        name: t("company"),
                        url: `${ROUTES_CONSTANTS?.ABOUT_US}`
                    },
                    {
                        name: t("contact_us"),
                        url: `${ROUTES_CONSTANTS?.CONTACT_US}`
                    },
                    {
                        name: t("login"),
                        url: `${ROUTES_CONSTANTS?.SIGN_IN}`
                    },
                    {
                        name: t("track_your_orders"),
                        url: `${ROUTES_CONSTANTS?.TRACK_ORDER}`
                    }
                ]
            },
            {
                name: t("legal"),
                list: [
                    {
                        name: t("terms_and_conditions"),
                        url: `${ROUTES_CONSTANTS?.TERMS_AND_CONDITION}`
                    },
                    {
                        name: t("shipping_policy"),
                        url: `${ROUTES_CONSTANTS?.SHIPPING_POLICY}`
                    },
                    {
                        name: t("return_exchange_policy"),
                        url: `${ROUTES_CONSTANTS?.RETURN_AND_EXCHANGE_POLICY}`
                    },
                    {
                        name: t("privacy_policy"),
                        url: `${ROUTES_CONSTANTS?.PRIVACY_POLICY}`
                    }
                ]
            }
       ];
       setRangeData(category)
    },[data]);

    const handleRangeAttributes=(url)=>{
        navigate(url)
    }

    return (
        <footer className="w-full py-2">
            <div className="w-full bg-[#fffbf5] px-10 py-10">
                {/* Top Header Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-7 lg:gap-0 border-b border-[#b69754]">
                    <a href={shopdata?.website} className="flex justify-center lg:justify-start">
                        <img src={Logo} className="w-[154px]" alt={shopdata?.title} />
                    </a>
                    <div className="flex items-center gap-2 px-7">
                        <img src={shopdata?.logo2} alt="" className="w-[100px]" />
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="flex flex-col lg:flex-row justify-between py-8 min-[500px]:py-14 gap-8 lg:gap-0">
                    {/* Categories Section */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 sm:gap-12 xl:gap-24">
                        {rangeData?.map((item, i) => {
                            return (
                                <div key={Math.random()} className="block">
                                    <h6 className="text-[1rem] text-gray-800 font-bold mb-4 text-center lg:text-left">
                                        {item?.name}
                                    </h6>
                                    <ul className="grid gap-2 text-center lg:text-left">
                                        {item?.list?.map((list, i) => {
                                            return (
                                                <li key={i}>
                                                    <span onClick={()=>{ handleRangeAttributes(list?.url) }} className="text-gray-600 text-[0.85rem] hover:cursor-pointer hover:text-gray-900">
                                                        {list?.name}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    {/* Subscription Section */}
                    <div className="block lg:w-[50%]">
                        <h5 className="font-manrope font-semibold text-[1.2rem] text-[#b69754] leading-9 mb-6 text-center lg:text-left">
                            {t("we_happy_to_assist_you")}
                        </h5>
                        <div className="lg:bg-gray-100 lg:rounded-lg lg:h-16 lg:p-1.5 flex flex-col lg:flex-row items-center gap-6 lg:gap-0">
                            <input 
                                type="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e?.target?.value)} 
                                className="py-2 px-6 bg-gray-100 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none flex-1 w-full max-w-xl mx-auto lg:w-auto lg:py-5 lg:px-7 lg:bg-transparent"
                                placeholder="Enter email address" 
                            />
                            <button 
                                type="button" 
                                onClick={subscribe} 
                                className="py-3.5 px-7 bg-[#b69754] shadow-md rounded-lg text-white font-semibold hover:bg-[#9a8048]"
                            >
                                {t("subscribe")}
                            </button>
                        </div>
                        {submitted && (
                            <span className="text-[#b69754] text-[0.8rem] mt-2">
                                {errorMessage ? errorMessage : "Your email has been subscribed"}
                            </span>
                        )}

                        {/* Shop Details Section */}
                        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-28 mt-8">
                            <div className="timing">
                                <p className="text-[1rem] text-gray-800 font-bold pb-4">{t("timing")}:</p>
                                <div className="text-gray-600 text-[0.85rem] hover:text-gray-900">{shopdata?.timing?.days}</div>
                                <div className="text-gray-600 text-[0.85rem] hover:text-gray-900">{shopdata?.timing?.time}</div>
                            </div>
                            <div className="email">
                                <p className="text-[1rem] text-gray-800 font-bold pb-4">{t("email")}:</p>
                                <a href={`mailto:${shopdata?.email}`} className="no-underline text-gray-600 text-[0.85rem] hover:text-gray-900">
                                    {shopdata?.email}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom Section */}
            <div className="py-5 px-10 border-t border-gray-200">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
                    <span className="text-sm text-gray-500">
                        © {new Date().getFullYear()} {t("copyright")} <a href={shopdata?.website}>{shopdata?.title}</a>, {t("all_rights_reserved")}
                    </span>
                    <div className="flex mt-4 space-x-4 sm:justify-center sm:mt-0">
                        {shopdata?.social?.map((item, i) => (
                            <a
                                href={item?.url}
                                key={i}
                                className="w-9 h-9 rounded-full text-white bg-[#b69754] flex justify-center items-center hover:#9a8048"
                            >
                                <i className={`${item?.icon} hover:cursor-pointer`}></i>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;