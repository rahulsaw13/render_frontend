// Utils
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { useTranslation } from "react-i18next";

// Components
import CheckoutComponent from "@userpage-layouts/CheckoutComponent";
import { ROUTES_CONSTANTS } from "@constants/routesurl";

const MiniCheckoutComponent = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation("msg");

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

  const subtotal = cart.reduce((acc, item) => acc + Number(item.discountedPrice) * item.quantity, 0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Sync cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white pb-[200px]">
      {!cart?.length ? <span>{t("no_product_added")}</span> : null}
      {cart?.map((item) => (
        <div key={item?.id} className="flex items-center gap-4 pb-4 mb-4">
          <img src={item?.image} alt={item?.name} className="w-16 h-16 rounded-lg" />
          <div className="flex-1">
            <h3 className="font-semibold">{item?.name}</h3>
            <p className="text-sm text-gray-500">Weight: <span className="font-[Tektur]">{item?.weight}</span></p>
            <p className="font-bold font-[Tektur]">₹ {item?.quantity * Number(item?.discountedPrice)} { item?.discountedPrice < item?.actualPrice ? <span className='ms-4 text-gray-500 font-thin line-through'>₹ {item?.actualPrice}</span> : null}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center border border-[#caa446] rounded-md mt-2 overflow-hidden">
                    <button className="px-3 py-2 text-lg hover:bg-gray-200 hover:cursor-pointer" onClick={() => updateQuantity(item.id, -1)} disabled={item?.quantity <= 1}>−</button>
                        <span id="quantity" className="px-4 py-2 text-[13px] font-[Tektur]">{item?.quantity}</span>
                    <button className="px-3 py-2 text-lg hover:bg-gray-200 hover:cursor-pointer" onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-500 ml-4 text-[20px]">
                    <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
        </div>
      ))}

    {/* Footer (Fixed at the bottom inside dialog) */}
    <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg p-4">
        <div className="flex justify-between font-bold text-lg">
            <span>Subtotal</span>
            <span className='font-[Tektur]'>₹ {subtotal}</span>
        </div>
        <div className="mt-4">
        <button className="text-[15px] w-full py-2 px-4 rounded-md bg-[#c5a238] text-white" onClick={()=>{setVisible(true)}}>
            <span>Check out</span>
        </button>
        <button className="text-[15px] w-full py-2 px-4 rounded-md underline mt-2" onClick={()=>{
            navigate(ROUTES_CONSTANTS.VIEW_CART);
        }}>
            <span>View Cart</span>
        </button>
        </div>
    </div>
    <Dialog
        header="Checkout"
        blockScroll
        draggable={false} 
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        style={{
          width: '90vw',
          maxWidth: '400px',
          height: '80vh',
          maxHeight: '80vh',
          overflowY: 'auto',
          top: '5vh' // pushes it down from the top to avoid navbar
        }}
      >
      <CheckoutComponent />
    </Dialog>
    </div>
  )
}

export default MiniCheckoutComponent