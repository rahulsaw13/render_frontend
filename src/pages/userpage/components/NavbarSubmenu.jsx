// Utils
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

// Components
import { ROUTES_CONSTANTS } from "@constants/routesurl";

const NavbarSubmenu = ({data}) => {
    const [showSubmenu, setShowSubmenu] = useState(data || {});
    const navigate = useNavigate();
    const handleSubmenu = (element)=>{
        if(!element?.sub_categories?.length){
            return
        }
        setShowSubmenu({...element, hover: !element?.hover})
    };

    const handleSubCategory=(name)=>{
        navigate(`${ROUTES_CONSTANTS?.VIEW_SUB_CATEGORY_DESCRIPTION}/${name}`);
    };

    const handleCategory=(submenu)=>{
        navigate(`${ROUTES_CONSTANTS?.VIEW_CATEGORY_DESCRIPTION}/${submenu?.name}`);
    }

  return (
    <div className='flex hover: cursor-pointer' 
        onMouseEnter = {
                ()=> {
            handleSubmenu(showSubmenu)
        }} 
        onMouseLeave = {
            ()=> {
            handleSubmenu(showSubmenu)
        }}>
        <div className='text-[#5a5a5a] font-[500] py-2 px-3 text-[0.9rem]' onClick={()=>{ handleCategory(showSubmenu) }}>{showSubmenu?.name}</div>
        <div className='flex items-center'>{ showSubmenu?.sub_categories?.length > 0 ? < i className="ms-1 ri-arrow-drop-down-line"></i> : null}</div>
        <div className={`absolute mt-8 z-10 w-[270px] ${showSubmenu?.sub_categories && showSubmenu?.hover ? "border p-4 rounded shadow-lg bg-white" : ""}`}>
            {showSubmenu?.hover && showSubmenu?.sub_categories?.map((element)=>{
                return (
                <div key={element?.id} className='h-9 ps-3 hover:bg-gray-100  hover:text-black text-[#898585] flex items-center rounded justify-between'>
                    <div className='text-[0.9rem]' onClick={()=>{ handleSubCategory(element?.name) }}>{element?.name}</div>
                </div>
            )})}
        </div>
    </div>
  )
}

export default NavbarSubmenu