import React from 'react';
import './Login.css';

function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/api/linkedin/authorize/';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-heading">Community Management Hub</h2>
        <p className="login-subheading">
          Streamline your social presence with AI-powered tools designed for modern creators and brands.
        </p>

        <button className="linkedin-btn" onClick={handleLogin}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
            alt="LinkedIn Logo"
            className="linkedin-logo"
          />
          Continue with LinkedIn
        </button>

        <p className="terms">
          By continuing, you agree to our <a href="#">terms of service</a> and <a href="#">privacy policy</a>.
        </p>

        <div className="features">
          <h4>What you'll get access to:</h4>
          <ul>
            <li>Professional network integration</li>
            <li>AI powered post generation</li>
            <li>Automated posting & scheduling</li>
            <li>Real-time analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
