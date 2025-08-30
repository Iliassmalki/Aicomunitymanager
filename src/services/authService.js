import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

axios.get("http://localhost:3000/api/posts/posts", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
})


export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};
