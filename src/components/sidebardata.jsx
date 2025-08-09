import React from 'react'
import * as  FaIcons from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaCalendar } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";
import { GrAnalytics } from "react-icons/gr";
 export const sidebardata = [
    {
        title: 'Home',
        path: '/',
        icon: <FaHome />,
        cname: 'nav-text'
    },
    {
        title: 'Calendar',
        path: '/calendar',
        icon: <FaCalendar />,
        cname: 'nav-text'
    },
    {
        title: 'Write post',
        path: '/CreatePost',
        icon: <MdOutlinePostAdd />,
        cname: 'nav-text'
    },
    {
        title: 'Analytics',
        path: '/Analytics',
        icon: <GrAnalytics />,
        cname: 'nav-text'
    },
 ]