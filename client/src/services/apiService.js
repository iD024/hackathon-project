const API_URL = "http://localhost:5000/api/v1";

// Helper function to handle storing token
const handleAuthResponse = (data) => {
  if (data.token) {
    localStorage.setItem("civicPulseToken", data.token);
  }
  return data;
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    return handleAuthResponse(data);
  } catch (error) {
    console.error("Login error:", error);
    return { message: error.message };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return handleAuthResponse(data);
  } catch (error) {
    console.error("Registration error:", error);
    return { message: error.message };
  }
};

export const getIssues = async () => {
  try {
    const response = await fetch(`${API_URL}/issues`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch issues:", error);
    return [];
  }
};

export const createIssue = async (issueData) => {
  const token = localStorage.getItem("civicPulseToken");
  try {
    const response = await fetch(`${API_URL}/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the token to the request
      },
      body: JSON.stringify(issueData),
    });
    if (!response.ok) {
      throw new Error("Failed to create issue");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to create issue:", error);
    return null;
  }
};
