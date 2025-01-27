import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Admin } from '../lib/navigation';
import  classNames  from 'classnames';

export const Sidebar = () => {
    return (
        <div className="hidden md:flex md:flex-col text-white shadow-[0_3px_6px_3px_rgba(0,0,0,0.3)] h-screen w-64 bg-white z-10">
            <div className="flex flex-col justify-center w-full mt-20 mb-5 h-2 bg-white">
                <div className="flex-1 flex-col h-12">
                    {Admin.map((item) => (
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
        <Link to={item.path} className={classNames("flex flex-row items-center p-6 mt-8 text-black hover:bg-gray-200", {"bg-gradient-to-r from-blue-500 to-purple-600": pathname === item.path})}>
      <img src={item.icon} alt={item.label} className={classNames("w-6 h-6", {"text-white": pathname === item.path})}/>
      <span className={classNames("ml-4 font-semibold text-xl", {"text-white": pathname === item.path})} >{item.label}</span>
    </Link>
  );
}