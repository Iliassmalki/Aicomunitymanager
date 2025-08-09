import React from 'react';
import { CalendarApp, createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import '@schedule-x/theme-default/dist/calendar.css';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import './Calendar.css';
import { BrowserRouter as Router, Routes, Route,useNavigate  } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dasboard from '../pages/Dasboard';
import { FaPlus } from 'react-icons/fa';

function Calendar() {
  const navigate = useNavigate();
    const calendar = useCalendarApp({
        plugins: [
            createDragAndDropPlugin()
        ],
        views: [
            createViewWeek(),
            createViewMonthGrid(),
        ],
        events: [
            {
                id: 1,
                title: 'myevent',
                start: '2025-08-01 00:00',
                end: '2025-08-01 00:40',
            }
        ],
        callbacks: {
            onEventUpdate(updatedEvent) {
                console.log('onEventUpdate', updatedEvent);
            },
            onBeforeEventUpdate(oldEvent, newEvent, $app) {
                return true;
            }
        },
        selectedDate: '2025-08-01'
    });
    const handleAddPostClick = () => {
      navigate('/CreatePost');
  };
    return (
        <div className="flex flex-col p-4">
            <div className="flex justify-start mb-4">
                <button className="Addbutton" onClick={handleAddPostClick} >
                    <FaPlus className="w-5 h-5" />
                    Add Post
                </button>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Posts Calendar</h1>
            <div className="w-full max-w-7xl mx-auto">
                <ScheduleXCalendar calendarApp={calendar} />
            </div>
        </div>
    );
}

export default Calendar;