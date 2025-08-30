require('dotenv').config();
const express = require('express');
const postToLinkedIn= require('./utils/posttoLinkedin')
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cron = require("node-cron");
const { Authorization, Redirect } = require('./Security/AuthHelper');
const Post = require('./Models/Post.model');
const postRoutes = require('./Controllers/postController');
const User = require("./Models/User");
const authenticateJWT = require("./middleware/authenticateJWT"); 
const app = express();
const PORT = process.env.PORT || 3000;
//POST SCHEDULER

cron.schedule("* * * * *", async () => {
  console.log("⏱ Checking for scheduled posts...");

  const now = new Date();

  const posts = await Post.find({
    start: { $lte: now },
    posted: false,
  }).populate("user");

  for (let post of posts) {
    const user = post.user;
    if (!user) continue;

    try {
      await postToLinkedIn(post, user);
      post.posted = true;
      await post.save();
      console.log(`✅ Successfully posted scheduler post : ${post._id}`);
    } catch (err) {
      console.error(`❌ Failed to post scheduled post ${post._id}:`, err.message);
    }
  }
});
// Middleware
app.use(express.json());
app.use(cors());

// 1. LinkedIn authorization (send user to LinkedIn login)
app.get('/api/linkedin/authorize', (req, res) => {
  try {
    return res.redirect(Authorization());
  } catch (error) {
    console.error('Error in /api/linkedin/authorize:', error.message);
    res.status(500).json({ error: 'Failed to redirect to LinkedIn' });
  }
});

// 2. LinkedIn redirect callback (exchange code -> JWT)
app.get('/api/linkedinredirect', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    // Exchange code for access token
    const tokenData = await Redirect(code);

    // Get LinkedIn profile and email using /v2/userinfo
    const { data: profile } = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { 
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    // Extract email from userinfo response
    const email = profile.email;

    // Find or create user in MongoDB
    let user = await User.findOne({ linkedinId: profile.sub }); // Use 'sub' for user ID
    if (!user) {
      user = new User({
        linkedinId: profile.sub, 
        firstName: profile.given_name || profile.localizedFirstName,
        lastName: profile.family_name || profile.localizedLastName,
        email,
        linkedinAccessToken:String
      });
      user.linkedinAccessToken = tokenData.access_token;
      await user.save();
    }

    // Create JWT
    const jwtPayload = { id: user._id, email: user.email };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || "supersecret", {
      expiresIn: "1h",
    });

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  } catch (error) {
    console.error('Error in /api/linkedinredirect:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(500).json({ error: 'Failed to process redirect' });
  }
});
//POSTDIRERCTLY TO LINKEDIN


// Posts API
app.use('/api/posts', postRoutes);


//LINKEDIN GETPOSTS THIS ONLY GET ORGANIZATION POSTS DUE TO LINKED IN LIMITATIONS (PLUS DE DETAILS DANS LA DOCUMENTATION)
app.get("/api/linkedin-getsharedposts", authenticateJWT, async (req, res) => {
  try {
    console.log("===== /api/linkedin-shares called =====");

    const linkedInToken = req.user.linkedinAccessToken;
    let userURN = req.user.linkedinId;

    // Log token (redacted for security)
    console.log("LinkedIn Token: [REDACTED]");

    // If userURN is missing, fetch it from /me endpoint
    if (!userURN) {
      console.log("No userURN found, fetching from /me");
      const meResponse = await axios.get(
        'https://api.linkedin.com/v2/me?projection=(id)',
        {
          headers: {
            Authorization: `Bearer ${linkedInToken}`,
            "LinkedIn-Version": "202410", // Use current version
            "X-Restli-Protocol-Version": "2.0.0"
          }
        }
      );
      userURN = meResponse.data.id;
      console.log("Fetched userURN:", userURN);
    }

    // Validate userURN
    if (!userURN || !userURN.match(/^[A-Za-z0-9_-]+$/)) {
      console.error("Invalid or missing LinkedIn user ID:", userURN);
      return res.status(400).json({ error: "Invalid LinkedIn user ID" });
    }

    const fullURN = `urn:li:organization:${process.env.ORN}`;
    console.log("Constructed URN:", fullURN);

    // Fetch shares
    const response = await axios.get(
      `https://api.linkedin.com/v2/shares?q=owners&owners=${fullURN}&sortBy=LAST_MODIFIED&sharesPerOwner=10&projection=(elements*(id,created,text))`,
      {
        headers: {
          Authorization: `Bearer ${linkedInToken}`,
          "LinkedIn-Version": "202508",
         
        }
      }
    );

    console.log("LinkedIn API response status:", response.status);
    console.log("Rate limit remaining:", response.headers['x-rate-limit-remaining'] || "N/A");
    console.log("LinkedIn API response data:", response.data);

    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || err.message || "Failed to fetch LinkedIn posts";
    console.error("Error fetching LinkedIn posts:", { status, message, details: err.response?.data });
    res.status(status).json({ error: message });
  }
});
//LINKEDIN ANALYTICS API


app.get("/api/linkedin-shares", authenticateJWT, async (req, res) => {
  try {
    console.log("===== /api/linkedin-shares called =====");
    
    const linkedInToken = req.user.linkedinAccessToken;
    const URN = `urn:li:organization:${process.env.ORN}`;
    
    console.log("User in request:", req.user);
    console.log("LinkedIn Token:", linkedInToken);
    console.log("Organization URN:", URN);

    const response = await axios.get(
      `https://api.linkedin.com/rest/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${URN}`,
      {
        headers: {
          Authorization: `Bearer ${linkedInToken}`,
          "LinkedIn-Version": "202508", // YYYYMM format
        },
      }
    );

    console.log("LinkedIn API response status:", response.status);
    console.log("LinkedIn API response data:", response.data);

    res.json(response.data);
  } catch (err) {
    console.error("Error fetching LinkedIn shares:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch LinkedIn shares" });
  }
});


app.get("/api/linkedin-followers", async (req, res) => {

  try {
    const URN= `urn:li:organization:${process.env.ORN}`
    const token=`${process.env.LINKEDIN_ACCESS_TOKEN}`
    const response = await axios.get(
      `https://api.linkedin.com/rest/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=${URN}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "LinkedIn-Version": "202508"
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch LinkedIn Followers" });
  }
});

app.get("/api/Pagestats", async (req, res) => {
  try {
    const URN= `urn:li:organization:${process.env.ORN}`
  const token=`${process.env.LINKEDIN_ACCESS_TOKEN}`
    const response = await axios.get(
      `https://api.linkedin.com/rest/organizationPageStatistics?q=organization&organization=${URN}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch LinkedIn stats" });
  }
});
// MongoDB + Start Server
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydb');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Connection error:', err);
    process.exit(1);
  }
}
const generateRoutes = require("./routes/generateRoutes");

app.use("/api", generateRoutes); 
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});