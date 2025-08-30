import React, { useState } from 'react';
import * as FaIcons from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { sidebardata } from './sidebardata';
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';
import { IconContext } from 'react-icons';

function Sidebar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt_token"); // remove JWT
    window.location.href = "/";   // redirect to login page
  };

  return (
    <>
      <IconContext.Provider value={{ color: 'red' }}>
        <div className="sidebar">
          <Link to="#" className='menubars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>

        <nav className={sidebar ? 'nav-menu active ' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className='menu-bars'>
                <IoMdClose />
              </Link>
            </li>

            {sidebardata.map((item, index) => (
              <li key={index} className={item.cname}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}

            {/* Logout button */}
            <li className="nav-text logout">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </li>

          </ul>
        </nav>
      </IconContext.Provider>
    </>
  )
}

export default Sidebar;
