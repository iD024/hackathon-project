import React, { useState, useEffect } from "react";
import {
  getTeams,
  createTeam,
  getUsers,
  removeMemberFromTeam,
  leaveTeam,
  disbandTeam,
  getIssues,
  assignIssueToTeam,
  removeIssueFromTeam,
  resolveIssue,
  sendInvitation,
} from "../services/apiService";
import "./css/TeamPage.css";
import MapView from "./MapView/MapView";
import { jwtDecode } from "jwt-decode";

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchAllData = async () => {
    const token = localStorage.getItem("civicPulseToken");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded.id);
    }
    const teamsResponse = await getTeams();
    if (teamsResponse && teamsResponse.teams) {
      setTeams(teamsResponse.teams);
    }
    setUsers(await getUsers());
    setIssues(await getIssues());
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName) return;
    await createTeam({ name: teamName });
    setTeamName("");
    fetchAllData();
  };

  const handleInviteMember = async (teamId, recipientId) => {
    await sendInvitation({ teamId, recipientId });
    alert("Invitation sent!");
  };

  const handleAssignIssue = async (teamId, issueId) => {
    await assignIssueToTeam({ teamId, issueId });
    setSelectedIssue(null);
    fetchAllData();
  };

  const handleRemoveMember = async (teamId, userId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      await removeMemberFromTeam({ teamId, userId });
      fetchAllData();
    }
  };

  const handleLeave = async (teamId) => {
    if (window.confirm("Are you sure you want to leave this team?")) {
      await leaveTeam({ teamId });
      fetchAllData();
    }
  };

  const handleDisband = async (teamId) => {
    if (
      window.confirm(
        "Are you sure you want to disband this team? This cannot be undone."
      )
    ) {
      await disbandTeam({ teamId });
      fetchAllData();
    }
  };

  const handleRemoveIssue = async (teamId) => {
    if (window.confirm("Are you sure you want to unassign this issue?")) {
      await removeIssueFromTeam({ teamId });
      fetchAllData();
    }
  };

  const handleResolveIssue = async (teamId) => {
    if (
      window.confirm("Are you sure you want to mark this issue as resolved?")
    ) {
      await resolveIssue({ teamId });
      fetchAllData();
    }
  };

  const userTeam = teams.find((team) =>
    team.members.some((member) => member._id === currentUser)
  );

  return (
    <div className="team-page">
      <h1>Teams</h1>

      <div className="team-layout">
        <div className="team-main-content">
          {userTeam && userTeam.issue && (
            <div className="card assigned-issue-card">
              <h3>Assigned Issue</h3>
              <p>
                <strong>{userTeam.issue.title || "Untitled Issue"}</strong>
              </p>
              <p>{userTeam.issue.description}</p>
              {currentUser === userTeam.leader._id && (
                <div className="assigned-issue-actions">
                  <button
                    className="btn-resolve"
                    onClick={() => handleResolveIssue(userTeam._id)}
                  >
                    Mark as Resolved
                  </button>
                  <button
                    className="btn-unassign"
                    onClick={() => handleRemoveIssue(userTeam._id)}
                  >
                    Unassign
                  </button>
                </div>
              )}
            </div>
          )}

          {userTeam ? (
            <div className="card user-team">
              <h3>Your Team: {userTeam.name}</h3>
              <p>
                <strong>Leader:</strong> {userTeam.leader?.name}
              </p>
              <h4>Members:</h4>
              <ul className="team-members-list">
                {userTeam.members.map((member) => (
                  <li key={member._id}>
                    <span>{member.name}</span>
                    {currentUser === userTeam.leader._id &&
                      currentUser !== member._id && (
                        <button
                          className="btn-remove-member"
                          onClick={() =>
                            handleRemoveMember(userTeam._id, member._id)
                          }
                        >
                          Remove
                        </button>
                      )}
                  </li>
                ))}
              </ul>
              <div className="team-actions">
                {currentUser === userTeam.leader._id ? (
                  <button
                    className="btn-disband"
                    onClick={() => handleDisband(userTeam._id)}
                  >
                    Disband Team
                  </button>
                ) : (
                  <button
                    className="btn-leave"
                    onClick={() => handleLeave(userTeam._id)}
                  >
                    Leave Team
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="card create-team-form">
              <h3>Create a New Team</h3>
              <form onSubmit={handleCreateTeam}>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name..."
                  required
                />
                <button type="submit">Create</button>
              </form>
            </div>
          )}
        </div>

        <div className="team-sidebar">
          <div className="card">
            <h3>Available Issues</h3>
            <ul className="issue-list">
              {issues
                .filter((issue) => issue.status === "Reported")
                .map((issue) => (
                  <li key={issue._id} className="issue-list-item">
                    <span>{issue.title || "Untitled Issue"}</span>
                    <button
                      className="view-details-btn"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      View
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          <div className="card">
            <h3>Available Users</h3>
            <ul className="user-list">
              {users
                .filter(
                  (user) =>
                    !teams.some((team) =>
                      team.members.some((m) => m._id === user._id)
                    )
                )
                .map((user) => (
                  <li key={user._id} className="user-list-item">
                    <span>{user.name}</span>
                    {userTeam && userTeam.leader._id === currentUser && (
                      <button
                        className="invite-btn"
                        onClick={() =>
                          handleInviteMember(userTeam._id, user._id)
                        }
                      >
                        Invite
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {selectedIssue && (
        <div className="issue-details-modal">
          <div className="issue-details-content">
            <button
              className="close-modal-btn"
              onClick={() => setSelectedIssue(null)}
            >
              &times;
            </button>
            <h2>{selectedIssue.title || "Issue Details"}</h2>

            <div className="modal-section">
              <h4>Description</h4>
              <p>{selectedIssue.description}</p>
            </div>

            <div className="modal-section">
              <h4>Details</h4>
              <p>
                <strong>Created by:</strong>{" "}
                {selectedIssue.reportedBy?.name || "Anonymous"}
                <br />
                <strong>Status:</strong> {selectedIssue.status}
                <br />
                <strong>Priority:</strong>{" "}
                {selectedIssue.aiSeverity || "Pending"}
              </p>
            </div>

            <div className="modal-section">
              <h4>Location</h4>
              <div className="modal-map-container">
                <MapView issues={[selectedIssue]} />
              </div>
            </div>

            {userTeam &&
              userTeam.leader._id === currentUser &&
              !userTeam.issue && (
                <div className="modal-actions">
                  <button
                    className="assign-btn"
                    onClick={() =>
                      handleAssignIssue(userTeam._id, selectedIssue._id)
                    }
                  >
                    Assign to My Team
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
