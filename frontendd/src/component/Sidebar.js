import React from 'react';
import  classNames  from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import logo from '../imag/logo.png';
import { useAuth } from '../context/auth';
import { Admin, User, Petugas } from '../lib/navigation';


export const Sidebar = () => {
    const {isLogin, isRole} = useAuth();

    let sidebatitems = [];
    if (isLogin) {
        if (isRole === 'Admin') {
            sidebatitems = Admin;
        }else if (isRole === 'Petugas') {
            sidebatitems = Petugas;
        }else if (isRole === 'User') {
            sidebatitems = User;
        }
        
    }
    return (
        <div className="hidden md:flex md:flex-col text-white  shadow-[0_3px_6px_3px_rgba(0,0,0,0.3)] h-screen w-fit px-3  bg-gradient-to-br from-blue-500 to-purple-600 z-10">
            <img src={logo} alt="logo" className="mt-10 h-9 mx-auto "></img>
            <div className="flex flex-col justify-center mt-4 w-full">
                <div className="flex-1 flex-col h-8 p-2">
                    {sidebatitems.map((item) => (
                        <SidebarAnchor key={item.key} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

function SidebarAnchor({ item }) {
    const {pathname} = useLocation();
    return (
        <Link to={item.path} className={classNames("flex flex-row items-center p-3 mt-3 rounded-lg hover:bg-gray-100 hover:bg-opacity-15", {"bg-gray-200 rounded-lg bg-opacity-55": pathname === item.path})}>
      <img src={item.icon} alt={item.label} className={"h-4"}/>
      <span className={classNames("ml-4 font-medium text-l", {"text-white": pathname === item.path})} >{item.label}</span>
    </Link>
  );
}