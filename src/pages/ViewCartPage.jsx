// utils
import { useState, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import CheckoutComponent from "@userpage-layouts/CheckoutComponent";
import Navbar from "@userpage/Navbar";
import Loading from '@common/Loading';
import useCartStore from "@store";
import { API_CONSTANTS } from "@constants/apiurl";
import { allApi } from "@api/api";

const ViewCart = () => {
  const [cart, setCart] = useState([]);
  const [visible, setVisible] = useState(false);
  const setTrigger = useCartStore((state) => state.setTrigger);
  const [menuList, setMenuList] = useState([]);
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();

  const updateQuantity = (id, amount) => {
    const updatedCart = cart
    .map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + amount } : item
    )
    .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    setTrigger();
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.discountedPrice) * item.quantity,
    0
  );

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    fetchMenuList();
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchMenuList = () => {
    setLoader(true);
    allApi(API_CONSTANTS.MENU_LIST_URL, "", "get")
      .then((response) => {
        if (response.status === 200) {
          let data = response?.data.filter((item, index)=> index <= 6);
          data.push({ name: "About Us" });
          setMenuList(data);
        }
      })
      .finally(() => setLoader(false));
  };

  return (
    <>
      {loader ? (
        <Loading />
      ) : (
        <>
          <Navbar data={menuList} />
          <div className="p-4 md:p-6 mt-16 w-full max-w-screen-xl mx-auto">
            <h1 className="text-[28px] md:text-[36px] font-bold text-center mb-4 text-[#1D2E43] font-[playfair]">
              {t("shopping_cart")}
            </h1>
            <div className="flex justify-center mb-6 text-gray-600 text-sm">
              <p className="text-[#1D2E43]">
                <span onClick={() => navigate("/")}></span> {t("home")}{" "}
                <span className="px-2">&gt;</span>
                {t("your_shopping_cart")}
              </p>
            </div>

            {/* Responsive Table */}
            <div className="border-t w-full overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <colgroup>
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-3">{t("product")}</th>
                    <th className="p-3 text-center">{t("discounted_price")}</th>
                    <th className="p-3 text-center">{t("actual_price")}</th>
                    <th className="p-3 text-center">{t("quantity")}</th>
                    <th className="p-3 text-end">{t("total")}</th>
                  </tr>
                  {cart.map((item) => (
                    <tr key={item?.id} className="border-b">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-base md:text-lg">{item.name}</p>
                          <p className="text-sm">
                            {t("weight")} :{" "}
                            <span className="font-[Tektur]">{item.weight}</span>
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="underline text-xs text-gray-500 w-fit"
                          >
                            {t("remove")}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-center text-sm md:text-base font-[Tektur]">
                        ₹ {item.discountedPrice}
                      </td>
                      <td className="p-3 text-center text-sm md:text-base font-[Tektur]">
                        {item.discountedPrice < item.actualPrice
                          ? "₹ " + item.actualPrice
                          : "-"}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center gap-2 border rounded w-fit mx-auto px-1 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item?.quantity <= 1}
                            className="px-2 py-1 bg-gray-200 rounded text-sm"
                          >
                            −
                          </button>
                          <span className="px-2 font-[Tektur] text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 py-1 bg-gray-200 rounded text-sm"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-end text-sm md:text-base font-[Tektur]">
                        ₹ {Number(item.discountedPrice) * item.quantity}
                      </td>
                    </tr>
                  ))}
                </thead>
              </table>
            </div>

            {/* Checkout section */}
            <div className="flex justify-end mt-10">
              <div className="w-full md:w-[300px] p-4 bg-gray-50 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">{t("subtotal")}</h2>
                  <p className="text-lg font-bold">₹ {subtotal}</p>
                </div>
                <p className="text-sm text-gray-600 mb-4">{t("tax_included")}</p>
                <button
                  className="w-full bg-[#C7A756] hover:bg-[#b4974c] transition text-white font-semibold py-3 rounded-md uppercase text-sm"
                  onClick={() => setVisible(true)}
                >
                  {t("checkout")}
                </button>
              </div>
            </div>

            <Dialog
              header="Checkout"
              blockScroll
              draggable={false} 
              visible={visible}
              style={{ width: "90vw", maxWidth: "500px" }}
              onHide={() => {
                if (!visible) return;
                setVisible(false);
              }}
            >
              <CheckoutComponent />
            </Dialog>
          </div>
        </>
      )}
    </>
  );
};

export default ViewCart;