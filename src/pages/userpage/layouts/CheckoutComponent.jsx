// Components
import InputTextComponent from "@common/InputTextComponent";
import { allApi } from "@api/api";
import { allApiWithHeaderToken } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import { ROUTES_CONSTANTS } from "@constants/routesurl";

// Utils
import { useState, useEffect } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { InputOtp } from 'primereact/inputotp';
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const initialValues = {
  coupon: "",
  phoneNumber: "",
  // Customer address
  flatLandmark: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { t } = useTranslation("msg");
 
  return (
    <div className="flex items-center justify-between border-b pb-4 mb-4">
      {/* Product Image */}
      <div className="flex items-center">
        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md" />
        <div className="ml-3">
          <p className="text-[14px]">{item.name}</p>
          <span className="text-gray-500 text-sm font-[Tektur]">{item.weight}</span>
            {/* Quantity Control */}
            <div className="flex items-center border rounded-lg w-fit">
              <button
                className="p-1 text-gray-600 bg-[#e7e7e7]"
                onClick={() => onQuantityChange(item.id, -1)}
              >
                <i className="ri-subtract-line text-[12px]"></i>
              </button>
              <span className="p-1 font-[Tektur] w-[25px] text-center text-[12px]">{item.quantity}</span>
              <button
                className="p-1 text-gray-600 bg-[#e7e7e7]"
                onClick={() => onQuantityChange(item.id, 1)}
              >
                <i className="ri-add-line text-[12px]"></i>
              </button>
            </div>
        </div>
      </div>

      {/* Price and Remove Button */}
      <div className="flex items-center space-x-4">
        <span className="font-semibold font-[Tektur]">{ item?.discountedPrice < item?.actualPrice ? <span className='ms-4 text-gray-500 font-thin line-through'>₹ {item?.actualPrice}</span> : null} ₹{item?.quantity * Number(item?.discountedPrice)}</span>
        <button onClick={() => onRemove(item.id)}>
          <i className="ri-delete-bin-line text-gray-500 text-lg"></i>
        </button>
      </div>
    </div>
  );
};

const CheckoutComponent = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [addressToggle, setAddressToggle] = useState(false);
  const { t } = useTranslation("msg");
  const [data, setData] = useState(initialValues);
  const [token, setTokens] = useState();
  const [cart, setCart] = useState([]);
  const [checkAddress, setCheckAddress] = useState(false);
  const [resendOtpAvailable, setResendOtpAvailable] = useState("");
  const [couponChecked, setCouponChecked] = useState(false);
  const [couponErrorMessage, setCouponErrorMessage] = useState("");
  const [isOtpInputDisabled, setisOtpInputDisabled] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [finalTotal, setFinalTotal] = useState({
    totalPrice: 0,
    discount: 0,
    couponPrice: 0,
    finalPrice: 0
  });

  const validationSchema = yup.object().shape({
    coupon: yup.string(),
    phoneNumber: userDetails?.is_phone_verified ? yup.string() : yup.string().required(t("phone_number_is_required")),
    flatLandmark: userDetails?.is_phone_verified ? yup.string().required(t("flat_landmark_is_required")) : yup.string(),
    city: userDetails?.is_phone_verified ? yup.string().required(t("city_is_required")) : yup.string(),
    state: userDetails?.is_phone_verified ? yup.string().required(t("state_is_required")) : yup.string(),
    zipCode: userDetails?.is_phone_verified ? yup.string().required(t("zipcode_is_required")) : yup.string(),
    country: userDetails?.is_phone_verified ? yup.string().required(t("country_is_required")) : yup.string()
  });

  const onHandleSubmit = (value) =>{
    if(userDetails?.is_phone_verified){
      addOrder(value);
    }
    else{
      let seconds = 30;
      setResendOtpAvailable(seconds);
    
      const interval = setInterval(() => {
        seconds -= 1;
        setResendOtpAvailable(seconds);
    
        if (seconds <= 0) {
          clearInterval(interval);
        }
      }, 1000);
  
      setCheckAddress(true);
      sendUserOtp();
    }
  };

  const clearCoupon=()=>{
    setFieldValue('coupon', "");
    setCouponChecked(false);
  }

  const checkCoupon=()=>{
    let data = {
      user_id: userDetails?.id,
      code: values?.coupon
    };
    if(data?.user_id && data?.code){
      allApiWithHeaderToken(`${API_CONSTANTS.COMMON_COUPON_URL}/check_user_coupon`, data , "post")
        .then((response) => {
          if (response.status === 200) {
            let discountedValue;

            if(response?.data?.data?.discount_type === 1){
              discountedValue = response?.data?.data?.discount_value;
            }
            else{
              discountedValue = finalTotal?.totalPrice * (response?.data?.data?.discount_value/100);
            }
            setFinalTotal({...finalTotal, couponPrice: discountedValue});
            setCouponChecked(true);
          };
        })
        .catch((err) => {
          setCouponErrorMessage(err?.response?.data?.errors)
        }).finally(()=>{
        });
    }
  };

  const addOrder = (value)=>{
    setIsProcessing(true);

    let priceObj =  {
      totalPrice:0 ,
      discount: 0,
      finalPrice: 0
    }

    let products = [];
    let totalPrice = 0;
    
    cart?.forEach((item)=>{
      let obj = {
        product_id: Number(item?.id),
        qty: Number(item?.quantity)
      };
      products.push(obj);

      if(!priceObj?.totalPrice){
        priceObj['totalPrice'] = item?.product?.price * item?.qty;
        priceObj['discount'] = item?.product?.discounted_price * item?.qty;
        priceObj['finalPrice'] = item?.product?.final_price * item?.qty;
      }
      else{
        priceObj['totalPrice'] = priceObj['totalPrice'] + (item?.product?.price * item?.qty);
        priceObj['discount'] = priceObj['discount'] + item?.product?.discounted_price * item?.qty;
        priceObj['finalPrice'] = priceObj['finalPrice'] + item?.product?.final_price * item?.qty;
      };
      setFinalTotal({...finalTotal,...priceObj});
    });
    
    let data = {
      user_id: userDetails?.id,
      coupon: value?.coupon,
      tax_price: 50,
      handling_fee: 50,
      payment_status: "Pending",
      order_status: "Pending",
      payment_mode: "Online",
      products: products,
      total_price: subtotal - finalTotal?.couponPrice + 50 + 50
    };
    
    data['shipping_address'] = {
      flat_no: value?.flatLandmark,
      landmark: value?.flatLandmark,
      city: value?.city,
      state: value?.state,
      zip_code: value?.zipCode,
      country: value?.country
    };

    allApiWithHeaderToken(API_CONSTANTS.COMMON_ORDER_URL, data , "post")
    .then((response) => {
      if(response?.status === 201){
        localStorage.setItem("orderDetails", JSON.stringify(response?.data?.data));
        loadRazorpay(data, subtotal);
      }
    })
    .catch((err) => {
    }).finally(()=>{
    }); 
  };

  const loadRazorpay = async (order, totalPrice) => {
    try {
      const body = {
        amount: totalPrice
      };

      const data = await allApiWithHeaderToken(API_CONSTANTS.PAYMENT_INTENT_CREATE, body, "post");
    
      const options = {
        key: data?.data?.razorpay_key_id, // Replace with your Razorpay Test/Public Key
        amount: data?.data.amount,
        currency: "INR",
        name: "Ecommerce Sweet",
        description: "Product Purchase",
        order_id: data?.data.id, // Razorpay order_id returned from backend
        handler: async function (response) {
          try {
            const verifyRes = await allApiWithHeaderToken(API_CONSTANTS.PAYMENT_VERIFY, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id,
            }, "post");

            if (verifyRes?.status) {
              navigate(ROUTES_CONSTANTS.PAYMENT_CONFIRMED, {
                state: {
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id
                }
              });
            } else {
              navigate(ROUTES_CONSTANTS.PAYMENT_REJECTED);
            }
          } catch (error) {
            navigate(ROUTES_CONSTANTS.PAYMENT_REJECTED);
          }
        },
        prefill: {
          name: userDetails?.name,
          email: userDetails?.email,
          contact: userDetails?.phone_number,
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error loading Razorpay", error);
      setErrorMessage("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sendUserOtp=()=>{
    let body = {
      user_id: userDetails?.id
    }
    allApi(API_CONSTANTS.SEND_PHONE_OTP_URL, body, "post")
    .then((response) => {
    })
    .catch((err) => {
    }).finally(()=>{
    }); 
  };

  const verifyOtpService=(otp)=>{
    let body = {
      user_id: userDetails?.id,
      otp: otp,
      phone_number: values?.phoneNumber
    }
    allApi(API_CONSTANTS.VERIFY_PHONE_OTP_URL, body, "post")
    .then((response) => {
      localStorage.setItem("userDetails", JSON.stringify(response?.data?.data));
    })
    .catch((err) => {
    }).finally(()=>{
    }); 
  };

  const accordianHandler=()=>{
    setToggle(!toggle)
  };

  const addressAccordianHandler=()=>{
    setAddressToggle(!addressToggle)
  };

  const updateQuantity = (id, amount) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0); // Remove items with quantity <= 0
    });
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Sync cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const subtotal = cart.reduce((acc, item) => acc + Number(item.discountedPrice) * item.quantity, 0);

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, setFieldValue, touched } = formik;

  return (
    <>
      {/* Order Summary Accordion */}
      <Accordion
        className="custom-checkout-accordian-header"
        onTabOpen={accordianHandler}
        onTabClose={accordianHandler}
        activeIndex={0}
      >
        <AccordionTab
          header={
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2 w-full">
              <div className="flex items-center flex-shrink-0">
                <i className="ri-shopping-cart-line text-[18px] me-2"></i>
                <span className="font-[500] whitespace-nowrap">{t("order_summary")}</span>
              </div>
              <div className="flex items-center mt-1 md:mt-0 flex-shrink-0">
                <span className="font-[Tektur] me-2 font-[500]">{cart?.length}</span>
                <span className="me-1 font-[500]">{t("items")}</span>
                <i
                  className={`icon text-[28px] transition-transform duration-300 ${
                    toggle ? "ri-arrow-drop-down-fill" : "ri-arrow-drop-up-fill"
                  }`}
                ></i>
              </div>
            </div>
          }
        >
          <div className="bg-white">
            {cart?.map((item) => (
              <CartItem
                key={item?.id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
              />
            ))}

            <div className="pt-4 mt-4 text-gray-700 text-sm">
              <div className="flex justify-between mb-2">
                <span>{t("subtotal")}</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>{t("shipping")}</span>
                <span>{t("calculate_at_next_step")}</span>
              </div>
            </div>

            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>{t("total")}</span>
              <span>₹{subtotal}</span>
            </div>
          </div>
        </AccordionTab>
      </Accordion>

      {/* Coupon and Phone Input Section */}
      <div className="w-full max-w-[600px] mx-auto mt-4">
        {/* Coupon Input */}
        <div className="flex gap-2">
          <div className="relative bg-white border rounded w-full">
            <i className="ri-price-tag-3-line absolute left-4 top-4 text-[19px]"></i>
            <InputTextComponent
              value={values?.coupon}
              onChange={handleChange}
              type="text"
              placeholder={t("enter_coupon_code")}
              name="coupon"
              error={errors?.coupon}
              touched={touched?.coupon}
              className="w-full pl-11 pr-4 py-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="relative flex items-center justify-center sm:justify-start">
            {couponChecked ? (
              <>
                <i className="ri-checkbox-circle-line text-[24px] text-green-600 absolute right-[4rem] top-[0.7rem]"></i>
                <button
                  onClick={() => clearCoupon()}
                  type="button"
                  className="min-w-[48px] h-[48px] flex justify-center items-center rounded bg-[#caa446] px-4 py-4 text-sm text-white"
                >
                  <i className="ri-delete-bin-5-line text-[0.9rem]"></i>
                </button>
              </>
            ) : (
              <button
                onClick={() => checkCoupon()}
                type="button"
                className="min-w-[48px] h-[48px] flex justify-center items-center rounded bg-[#caa446] px-4 py-4 text-sm text-white"
              >
                <i className="ri-loop-right-fill text-[0.9rem]"></i>
              </button>
            )}
          </div>
        </div>

        {couponErrorMessage && (
          <div className="text-xs text-red-500 mt-1">{couponErrorMessage}</div>
        )}

        {/* OTP Verification or Phone Input */}
        {!userDetails?.is_phone_verified && (
          <>
            {checkAddress ? (
              <>
                <div className="mt-4 px-2 flex justify-between text-gray-800 text-sm">
                  <span>
                    {t("enter_otp_sent_to")} <span>{values?.phoneNumber}</span>
                  </span>
                  <span onClick={() => setCheckAddress(false)} className="cursor-pointer">
                    <i className="ri-edit-box-line text-[1rem]"></i>
                  </span>
                </div>
                <InputOtp
                  value={token}
                  disabled={isOtpInputDisabled}
                  onChange={(e) => {
                    setTokens(e.value);
                    if (e?.value?.length === 4) {
                      setisOtpInputDisabled(true);
                      verifyOtpService(e?.value);
                    }
                  }}
                  integerOnly
                />
                <div className="text-center text-gray-600 text-xs mt-1">
                  {t("please_enter_correct_otp")}
                </div>
                <div className="text-center text-gray-700 text-sm mt-2">
                  {resendOtpAvailable
                    ? t("resend_otp_in", { sec: resendOtpAvailable })
                    : <span className="underline cursor-pointer">{t("resend_otp")}</span>}
                </div>
              </>
            ) : (
              <>
                <div className="flex bg-white items-center border rounded-lg p-2 mt-4">
                  <span className="flex items-center space-x-2">
                    <img
                      src="https://flagcdn.com/w40/in.png"
                      alt="India Flag"
                      className="w-6 h-4"
                    />
                    <span className="text-gray-700">+91</span>
                  </span>
                  <InputTextComponent
                    value={values?.phoneNumber}
                    onChange={handleChange}
                    type="number"
                    placeholder={t("phone_number")}
                    name="phoneNumber"
                    className="w-full ml-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                {errors?.phoneNumber && touched?.phoneNumber && (
                  <p className="text-xs text-red-600">{errors?.phoneNumber}</p>
                )}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full mt-4 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800"
                >
                  {t("add_address")}
                </button>
              </>
            )}
          </>
        )}

        {/* Address Accordion */}
        {userDetails?.is_phone_verified && (
          <>
            <Accordion 
              className="custom-checkout-accordian-header mt-4"
              onTabOpen={addressAccordianHandler}
              onTabClose={addressAccordianHandler}
              activeIndex={0} 
            >
              <AccordionTab
                header={
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <i className="ri-earth-line text-[18px] me-2"></i>
                      <span className="font-[500] whitespace-nowrap">{t("add_address")}</span>
                    </div>
                    <i
                      className={`icon text-[28px] transition-transform duration-300 ${
                        addressToggle ? "ri-arrow-drop-down-fill" : "ri-arrow-drop-up-fill"
                      }`}
                    ></i>
                  </div>
                }
              >
                <div className="bg-white">
                  {["flatLandmark", "city", "state", "zipCode", "country"].map((field, idx) => (
                    <InputTextComponent
                      key={field}
                      value={values?.[field]}
                      onChange={handleChange}
                      type="text"
                      placeholder={t(field)}
                      name={field}
                      error={errors?.[field]}
                      touched={touched?.[field]}
                      className={`text-sm mt-${idx === 0 ? "0" : "1"} w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700`}
                    />
                  ))}
                </div>
              </AccordionTab>
            </Accordion>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`w-full mt-4 text-white py-3 rounded-lg flex items-center justify-center ${
                isProcessing ? "bg-gray-700 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                t("proceed")
              )}
            </button>
          </>
        )}

        {/* Offers Checkbox */}
        <div className="flex items-center justify-center mt-4">
          <input type="checkbox" className="mr-2" />
          <label htmlFor="offers" className="text-gray-700 text-xs">
            {t("keep_me_poster_about_sales_and_offers")}
          </label>
        </div>

        {/* Footer Section */}
        <div className="text-center text-gray-600 text-sm mt-6 pb-16">
          <div className="flex justify-center space-x-6 mb-3">
            <div className="flex flex-col items-center">
              <i className="ri-truck-line text-2xl"></i>
              <span className="text-xs">{t("delivers_in_days", { days: "5-7" })}</span>
            </div>
            <div className="flex flex-col items-center">
              <i className="ri-global-line text-2xl"></i>
              <span className="text-xs">{t("shipping_worldwide")}</span>
            </div>
          </div>

          <p className="text-xs mt-12">
            {t("by_proceeding_i_accept")}{" "}
            <span className="font-semibold text-[#382C2C]">{t("T&C")}</span>{" "}
            {t("and")}{" "}
            <span className="font-semibold text-[#382C2C]">{t("privacy_policy")}</span>
          </p>
        </div>
      </div>
    </>
  );
  
}

export default CheckoutComponent;