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

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

export const getTeams = async () => {
  try {
    const response = await fetch(`${API_URL}/teams`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return [];
  }
};

export const createTeam = async (teamData) => {
  const token = localStorage.getItem("civicPulseToken");
  try {
    const response = await fetch(`${API_URL}/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(teamData),
    });
    if (!response.ok) {
      throw new Error("Failed to create team");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to create team:", error);
    return null;
  }
};

export const addMemberToTeam = async (data) => {
  const token = localStorage.getItem("civicPulseToken");
  try {
    const response = await fetch(`${API_URL}/teams/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to add member to team");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to add member to team:", error);
    return null;
  }
};

export const removeMemberFromTeam = async (data) => {
  const token = localStorage.getItem("civicPulseToken");
  try {
    const response = await fetch(`${API_URL}/teams/members/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to remove member from team");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to remove member from team:", error);
    return null;
  }
};

export const leaveTeam = async (data) => {
  const token = localStorage.getItem("civicPulseToken");
  try {
    const response = await fetch(`${API_URL}/teams/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to leave team");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to leave team:", error);
    return null;
  }
};

export const disbandTeam = async (data) => {
  const token = localStorage.getItem("civicPulseToken");
  try {
    const response = await fetch(`${API_URL}/teams/disband`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to disband team");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to disband team:", error);
    return null;
  }
};

export const assignIssueToTeam = async (data) => {
  const token = localStorage.getItem("civicPulseToken");
  try {
    const response = await fetch(`${API_URL}/teams/assign-issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to assign issue");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to assign issue:", error);
    return null;
  }
};
