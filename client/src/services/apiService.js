const API_URL = "http://localhost:5000/api/v1"; // Make sure this port matches your backend server

export const getIssues = async () => {
  try {
    const response = await fetch(`${API_URL}/issues`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch issues:", error);
    return []; // Return empty array on error
  }
};

export const createIssue = async (issueData) => {
  try {
    const response = await fetch(`${API_URL}/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
