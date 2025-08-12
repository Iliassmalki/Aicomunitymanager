import { CalendarApp, createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import '@schedule-x/theme-default/dist/calendar.css';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Dasboard from './pages/dasboard'; 
import Calendar from './pages/Calendar';
import CreatePost from './pages/CreatePost'
import Analytics from './pages/Analytics'
import Footer from './components/Footer'
function App() {
  return (
    <Router>

        <Sidebar />
     
          <Routes>
            <Route path='/' element={<Dasboard />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/CreatePost' element={<CreatePost />} />
            <Route path='/Analytics' element={<Analytics />} />
          </Routes>
          <Footer />
    </Router>
    
  );
}

export default App;