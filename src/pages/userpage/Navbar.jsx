import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { useNavigate } from "react-router-dom";
import { TieredMenu } from 'primereact/tieredmenu';
import { Avatar } from "primereact/avatar";
import { useTranslation } from "react-i18next";

// Components
import MiniCheckoutComponent from "@userpage-layouts/MiniCheckoutComponent.jsx";
import NavbarSubmenu from '@userpage-components/NavbarSubmenu.jsx';
import ButtonComponent from "@common/ButtonComponent";
import { allApiWithHeaderToken } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import useCartStore from "@store";
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import Logo from "@assets/logo.webp";

const Navbar = ({ data }) => {
  const [visibleRight, setVisibleRight] = useState(false);
  const [cart, setCart] = useState([]);
  const [MobileMenuShow, setMobileMenuShow] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const triggerUpdate = useCartStore((state) => state.triggerUpdate);
  const navigate = useNavigate();
  const { t } = useTranslation("msg");
  const menu = useRef(null);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const loggedInItems = [
    {
      label: userDetails?.name,
      icon: <Avatar className="mr-2" label={userDetails?.name[0]} shape="circle" />,
      command: () => { }
    },
    { separator: true },
    {
      label: t("edit_profile"),
      icon: "ri-user-3-line",
      command: () => navigate(`/edit-profile`),
      className: "text-[0.8rem] user-profile-menu-item-list"
    },
    {
      label: t("help"),
      icon: "ri-questionnaire-line",
      command: () => navigate('/user-help'),
      className: "text-[0.8rem] user-profile-menu-item-list"
    },
    {
      label: t("logout"),
      icon: "ri-logout-circle-r-line",
      command: () => {
        logout();
        let theme = localStorage.getItem("theme");
        localStorage.removeItem("userDetails");
        localStorage.removeItem("token");
        localStorage.setItem("theme", theme);
      },
      className: "text-[0.8rem] user-profile-menu-item-list"
    }
  ];

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    setShowNavbar(true);
  }, [triggerUpdate]);

  const logout = () => {
    allApiWithHeaderToken(API_CONSTANTS.LOGOUT, "", "delete")
      .then((response) => {
        if (response.status === 200) {
          navigate("/");
        }
      })
      .catch(() => {});
  };

  const handleCart = () => {
    setVisibleRight(true);
  };

  // Scroll effect: hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false); // hide on scroll down
      } else {
        setShowNavbar(true); // show on scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`${data?.length > 0 ? "" : 'hidden'}`}>
      <div
        className={`
          fixed top-0 left-0 right-0 bg-white shadow-md z-50 transition-transform duration-300 ease-in-out
          ${showNavbar ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="grid grid-cols-12 gap-4 items-center px-4 py-2 bg-white">
          {/* Logo */}
          <div className="col-span-6 md:col-span-2 flex items-center">
            <img
              className="hover:cursor-pointer w-[160px] md:w-[120px]"
              onClick={() => navigate("/")}
              src={Logo}
              alt="logo-image"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex col-span-8 flex-wrap gap-4 items-center">
            {data?.map((item) => (
              <NavbarSubmenu data={item} key={item?.id} />
            ))}
          </div>

          {/* Right Side (Cart / User) */}
          <div className="col-span-6 md:col-span-2 flex justify-end gap-4 items-center">
            <div className='relative'>
              <ButtonComponent
                onClick={handleCart}
                type="button"
                className="text-[22px] text-black"
                icon="ri-shopping-bag-line"
              />
              {
                cart?.length > 0 ? (
                  <span className="absolute top-[-0.7rem] right-0 text-white bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart?.length}
                  </span>
                ) : null
              }
            </div>

            {/* User Avatar */}
            {userDetails ? (
              <Avatar
                className="mr-2"
                label={userDetails?.name[0]}
                shape="circle"
                onClick={(e) => menu.current.toggle(e)}
              />
            ) : (
              <ButtonComponent
                onClick={() => navigate(ROUTES_CONSTANTS.SIGN_IN)}
                type="button"
                className="text-[22px] text-black"
                icon="ri-user-3-line"
              />
            )}

            {/* Mobile Menu Icon */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMobileMenuShow(true)}
            >
              <i className="ri-menu-line" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <Sidebar
        visible={MobileMenuShow}
        onHide={() => setMobileMenuShow(false)}
        blockScroll
        position="left"
        className="w-[80vw] sm:w-[60vw]"
      >
        {data?.map((item) => (
          <div key={item?.id} className="py-2 border-b">
            <NavbarSubmenu data={item} />
          </div>
        ))}
        <div className="mt-4">
          {userDetails && (
            <div className="text-sm">
              <div className="font-semibold">{userDetails?.name}</div>
              <button onClick={logout} className="text-red-500 mt-2">
                Logout
              </button>
            </div>
          )}
        </div>
      </Sidebar>

      {/* Cart Sidebar */}
      <Sidebar
        visible={visibleRight}
        blockScroll
        position="right"
        header="Shopping Cart"
        className="w-[420px]"
        onHide={() => setVisibleRight(false)}
      >
        <MiniCheckoutComponent />
      </Sidebar>

      <TieredMenu
        model={loggedInItems}
        popup
        ref={menu}
        breakpoint="767px"
        className="p-0 text-[0.8rem] user-avatar-menu !z-[100000]"
      />
    </div>
  );
};

export default Navbar;
