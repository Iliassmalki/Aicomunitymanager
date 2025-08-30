import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart2, Eye, ThumbsUp, Users } from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState({
    impressions: 0,
    engagements: 0,
    followers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const accessToken = localStorage.getItem("jwt_token"); // your JWT
  const organizationURN = "urn:li:organization:224453521"; // Replace with your org URN
  const userURN = "78iyzl3xivecn0"; // Replace with your user URN

  // Save token from URL to localStorage once
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) localStorage.setItem("jwt_token", token);
  }, []);

  // Fetch posts and analytics
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await axios.get(
          "http://localhost:3000/api/linkedin-getsharedposts",
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setPosts(response.data.elements || []);
      } catch (err) {
        console.error("Error fetching LinkedIn posts:", err.response?.data || err.message);
        setError("Impossible de charger les posts LinkedIn.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []);
  
  
  return (
    <div className="dashboard">
      {/* Hero Banner */}
      <div className="hero-banner">
        <h1 className="welcome-text">Welcome Back!</h1>
        <p className="sub-text">LinkedIn Post Manager</p>
      </div>

    {/* Posts */}
<div className="posts-section">
  <h2 className="section-title">Your Recent Posts</h2>
  {loading ? (
    <p className="loading-text">Chargement...</p>
  ) : error ? (
    <p className="error-text">{error}</p>
  ) : posts.length === 0 ? (
    <p className="empty-text">Aucun post trouvé.</p>
  ) : (
    <div className="posts-grid">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <p className="post-text">{post.text?.text || "Sans contenu"}</p>
          {post.content?.contentEntities?.[0]?.thumbnails?.[0]?.resolvedUrl && (
            <img
              src={post.content.contentEntities[0].thumbnails[0].resolvedUrl}
              alt={post.content.title || "Post image"}
              className="post-image"
            />
          )}
          <div className="post-footer">
            <span className="post-date">
              {new Date(post.created.time).toLocaleDateString("fr-FR")}
            </span>
            {post.content?.contentEntities?.[0]?.entityLocation && (
              <a
                href={post.content.contentEntities[0].entityLocation}
                target="_blank"
                rel="noopener noreferrer"
                className="view-post-link"
              >
                View Post →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>


      {/* Analytics */}
      <div className="analytics-section">
        <h2 className="section-title">Performance Overview</h2>
        {loading ? (
          <p className="loading-text">Chargement...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="analytics-grid">
            <div className="analytics-card">
              <Eye className="analytics-icon" />
              <h3 className="analytics-title">Impressions</h3>
              <p className="analytics-value">{analytics.impressions}</p>
            </div>
            <div className="analytics-card">
              <ThumbsUp className="analytics-icon" />
              <h3 className="analytics-title">Engagements</h3>
              <p className="analytics-value">{analytics.engagements}</p>
            </div>
            <div className="analytics-card">
              <Users className="analytics-icon" />
              <h3 className="analytics-title">Followers</h3>
              <p className="analytics-value">{analytics.followers}</p>
            </div>
            <div className="analytics-card">
              <BarChart2 className="analytics-icon" />
              <h3 className="analytics-title">Growth</h3>
              <p className="analytics-value">
                {analytics.followers > 0
                  ? Math.floor((analytics.engagements / analytics.followers) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
