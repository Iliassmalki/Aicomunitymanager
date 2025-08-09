import React, {useState} from 'react'
import * as  FaIcons from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { sidebardata } from './sidebardata';
import {Link} from 'react-router-dom'
import './sidebar.css'
import {IconContext} from 'react-icons'
function Sidebar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  return (
    <>
    <IconContext.Provider value={{color: 'red'}}>
      <div className="sidebar"> 
      <Link to="#" className='menubars'>
      <FaIcons.FaBars onClick={showSidebar} />

      </Link>
      </div>
      <nav className={sidebar ? 'nav-menu active ': 'nav-menu'}>
        <ul className='nav-menu-items' onClick={showSidebar} >
          <li className="navbar-toggle">
            <Link to="#" className='menu-bars'>
            <IoMdClose />

            </Link>
            </li>  
            {sidebardata.map((item,index)=> {
            return (
              <li key={index} className={item.cname}>
              <Link to={item.path} >
              {item.icon}
              <span>{item.title}</span>
               </Link>
              </li>
            )
            })}
        </ul>
      </nav>
      </IconContext.Provider>
    </>
  )
}

export default Sidebar

