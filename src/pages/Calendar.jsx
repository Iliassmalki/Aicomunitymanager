import React from 'react';
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import '@schedule-x/theme-default/dist/calendar.css';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import './Calendar.css';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaInfoCircle } from 'react-icons/fa';

function Calendar() {
  const navigate = useNavigate();

  const calendar = useCalendarApp({
    plugins: [createDragAndDropPlugin()],
    views: [createViewWeek(), createViewMonthGrid()],
    events: [
      {
        id: 1,
        title: 'myevent',
        start: '2025-08-01 00:00',
        end: '2025-08-01 00:40',
      },
    ],
    callbacks: {
      onEventUpdate(updatedEvent) {
        console.log('onEventUpdate', updatedEvent);
      },
      onBeforeEventUpdate() {
        return true;
      },
    },
    selectedDate: '2025-08-01',
  });

  const handleAddPostClick = () => {
    navigate('/CreatePost');
  };

  // Mock scheduled posts data
  const scheduledPosts = [
    { title: 'LinkedIn Article: AI in Marketing', date: 'Aug 1, 2025 - 10:00 AM' },
    { title: 'Post: 5 Tips for Better Networking', date: 'Aug 3, 2025 - 2:00 PM' },
    { title: 'Video Post: Industry Trends 2025', date: 'Aug 5, 2025 - 9:00 AM' },
    { title: 'Poll: Future of Remote Work', date: 'Aug 7, 2025 - 11:00 AM' },
    { title: 'Case Study: B2B Growth Hacks', date: 'Aug 10, 2025 - 3:30 PM' },
    { title: 'Infographic: 2025 Hiring Trends', date: 'Aug 12, 2025 - 8:45 AM' },
    { title: 'Webinar Promo: AI & Marketing', date: 'Aug 14, 2025 - 4:00 PM' },
  ];

  return (
    <div className="calendar-layout">
      {/* Calendar Section */}
      <div className="calendar-section card-shadow">
        <div className="calendar-header">
          <h1>Posts Calendar</h1>
          <button className="Addbutton" onClick={handleAddPostClick}>
            <FaPlus className="icon" />
            Add Post
          </button>
        </div>
        <div className="sx-react-calendar-wrapper">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>

      {/* Scheduled LinkedIn Posts Panel */}
      <div className="linkedin-panel">
        <h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
            alt="LinkedIn"
            className="linkedin-icon"
          />
          Scheduled LinkedIn Posts
        </h2>
        <div className="posts-list">
          {scheduledPosts.map((post, idx) => (
            <div key={idx} className="post-item">
              <div className="post-info">
                <p className="post-title">{post.title}</p>
                <p className="post-date">{post.date}</p>
              </div>
              <FaInfoCircle className="more-info-icon" title="More info" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
