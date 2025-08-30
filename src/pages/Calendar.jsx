import React, { useState, useEffect } from 'react';
import { createViewWeek, createViewMonthGrid, createViewDay, createViewMonthAgenda } from '@schedule-x/calendar';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { IoMdClose } from "react-icons/io";
import { FaCalendar, FaHome, FaPlus, FaInfoCircle } from "react-icons/fa";
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { MdOutlinePostAdd } from "react-icons/md";
import { GrAnalytics } from "react-icons/gr";
import '@schedule-x/theme-default/dist/calendar.css';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import './Calendar.css';
import { useNavigate } from 'react-router-dom';
import { createEventsServicePlugin } from '@schedule-x/events-service';

function Calendar() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // <-- added state for modal

  const eventsService = createEventsServicePlugin();


  const calendar = useCalendarApp({
    plugins: [createDragAndDropPlugin(), eventsService, createEventModalPlugin()],
    views: [
      createViewDay(),
      createViewMonthAgenda(),
      createViewMonthGrid(),
      createViewWeek({ timeSlotHeight: 400 }),
    ],
    events: [],
    callbacks: {
      onEventUpdate: (updatedEvent) => console.log("onEventUpdate", updatedEvent),
      onBeforeEventUpdate: () => true,
    },
    selectedDate: new Date().toISOString().split("T")[0],
  });

  // Load events from API
  useEffect(() => {
    async function loadEvents() {
      try {
        const token = localStorage.getItem("jwt_token"); 
        if (!token) throw new Error("No JWT token found");
        setIsLoading(true);

        const response = await fetch("http://localhost:3000/api/posts/posts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const postsData = await response.json();

        const mappedEvents = postsData.map((post) => ({
          id: post._id,
          title: post.title,
          start: new Date(post.start).toISOString().slice(0, 16).replace("T", " "),
          end: new Date(post.end).toISOString().slice(0, 16).replace("T", " "),
        }));
        eventsService.set(mappedEvents);

        const mappedPosts = postsData.map((post) => ({
          id: post._id,
          title: post.title,
          date: new Date(post.start).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }),
          content: post.content,        // <-- added content
          hashtags: post.hashtags || [],// <-- added hashtags
          imageUrl: post.imageUrl || null // <-- added image
        }));
        setPosts(mappedPosts);

      } catch (error) {
        console.error("Error fetching events:", error);
        eventsService.set([]);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);
//DELETION
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`http://localhost:3000/api/posts/deletepost/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete post");
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleAddPostClick = () => navigate("/CreatePost");
  const handleInfoClick = (post) => setSelectedPost(post); // <-- handler for info button
  const closeModal = () => setSelectedPost(null);           // <-- close modal

  if (isLoading) return <div>Loading events...</div>;

  return (
    <div className="calendar-layout">
      {/* Calendar Section */}
      <div className="calendar-section card-shadow">
        <div className="calendar-header">
          <h1>Posts Calendar</h1>
          <button className="Addbutton" onClick={handleAddPostClick}>
            <FaPlus className="icon" /> Add Post
          </button>
        </div>
        <div className="sx-react-calendar-wrapper">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>

      {/* Scrollable Posts Panel */}
      <div className="linkedin-panel card-shadow" style={{ marginTop: "20px", padding: "16px" }}>
        <h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
            alt="LinkedIn"
            className="linkedin-icon"
            style={{ width: "24px", marginRight: "8px" }}
          />
          Scheduled Posts
        </h2>

        {posts.length === 0 ? (
          <p className="empty-text">Aucun post trouvé.</p>
        ) : (
          <div className="posts-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
            {posts.map((post) => (
              <div
                key={post.id}
                className="post-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <div className="post-info">
                  <p className="post-title" style={{ fontWeight: "bold" }}>{post.title}</p>
                  <p className="post-date" style={{ fontSize: "0.85rem", color: "#555" }}>{post.date}</p>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <FaInfoCircle
                    className="more-info-icon"
                    title="More info"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleInfoClick(post)} // <-- added here
                  />
                  <FaCalendar className="go-to-icon" title="Go-to" />
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "16px" }}
                    title="Delete Post"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPost && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={closeModal}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "12px",
              minWidth: "300px",
              maxWidth: "600px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "12px" }}>{selectedPost.title}</h3>
            <p><strong>Date:</strong> {selectedPost.date}</p>
            <p><strong>Content:</strong> {selectedPost.content}</p>
            {selectedPost.hashtags && Array.isArray(selectedPost.hashtags) && selectedPost.hashtags.length > 0 && (
  <p><strong>Hashtags:</strong> {selectedPost.hashtags.join(", ")}</p>
)}
            {selectedPost.imageUrl && (
              <img
                src={selectedPost.imageUrl}
                alt="Post image"
                style={{ width: "100%", marginTop: "12px", borderRadius: "8px" }}
              />
            )}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;
