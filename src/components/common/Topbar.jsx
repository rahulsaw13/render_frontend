// Utils
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sidebar } from 'primereact/sidebar';
import { useLocation } from 'react-router-dom';

// Components
import AvatarProfile from "@common/AvatarProfile";
import NotificationComponent from "@common/Notification";
import InputTextComponent from "@common/InputTextComponent";

// Custom Hook for Debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Topbar = ({ toggleExpansionSwitch, searchField, searchChangeHandler }) => {
  const { t } = useTranslation("msg");
  const location = useLocation();
  const [expand, setExpand] = useState(true);
  const [theme, setTheme] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [searchvalue, setSearchValue] = useState("");
  const [visibleRight, setVisibleRight] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const debouncedSearchValue = useDebounce(searchvalue, 800);

  const toggleTheme = () => {
    setTheme(!theme);
    if (theme) {
      document.querySelector("body").setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      if(theme === "dark"){
        document.documentElement.classList.add("dark");
      }
      else{
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.querySelector("body").setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  };

  useEffect(() => {
    searchChangeHandler(debouncedSearchValue);
  }, [debouncedSearchValue, searchChangeHandler]);

  const readNotification = ()=>{
    setVisibleRight(true)
  };

  useEffect(()=>{
    setSearchValue(searchField);
  },[searchField]);

  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem("userDetails")));    
    const selectedTheme = localStorage.getItem("theme");
    if (selectedTheme === "dark") {
      setTheme(true);
      document.querySelector("body").setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme(false);
      document.querySelector("body").setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    setSearchValue("");
  }, [location]);

  return (
    <div className="flex h-16 w-full items-center gap-4 bg-BgTertiaryColor px-5 shadow-custom z-10">
      <button
        className={`toggle-button col-span-1 ${expand ? "expanded" : ""}`}
        onClick={() => {
          setExpand(!expand);
          toggleExpansionSwitch(!expand); // Fix the argument to toggleExpansionSwitch
        }}>
        <i
          className={`icon text-2xl text-TextPrimaryColor ${expand ? "ri-menu-fold-2-line rotate" : "ri-menu-unfold-2-line"}`}
        ></i>
      </button>
      <div className="grid w-full grid-cols-12 gap-2">
        <div className="col-span-8 max-sm:hidden flex items-center">
          {
            location?.pathname === "/dashboard" ? null :
            <InputTextComponent
              type="text"
              placeholder={t("search")}
              value={searchvalue}
              onChange={(e)=> setSearchValue(e.target.value)}
              name="searchvalue"
              className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
            />
          }
        </div>
        <div className="col-span-4 flex justify-end text-TextPrimaryColor">
          {/* <button onClick={readNotification} className="me-8 text-xl relative">
            <i className="ri-notification-4-line"></i>
            <span className="absolute text-[12px] text-[red] left-[20px] top-[-6px]">{unreadNotificationCount}</span>
          </button> */}
          <button onClick={toggleTheme} className="me-8 text-xl">
            {theme ? (
              <i className="ri-sun-line"></i>
            ) : (
              <i className="ri-contrast-2-fill"></i>
            )}
          </button>
          <AvatarProfile shape="circle" userDetails={userDetails} />
        </div>
      </div>
      <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
          <NotificationComponent />
      </Sidebar>
    </div>
  );
};

export default Topbar;
