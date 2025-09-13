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
  const [userType, setUserType] = useState(null);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeamForInvite, setSelectedTeamForInvite] = useState(null);

  const fetchAllData = async () => {
    const token = localStorage.getItem("civicPulseToken");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded.id);
      setUserType(decoded.userType);
    }
    const response = await getTeams();
    if (response && response.teams) {
      setTeams(response.teams);
    }
    const usersData = await getUsers();
    setUsers(usersData);
    const issuesData = await getIssues();
    setIssues(issuesData);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName) return;
    await createTeam({
      name: teamName,
    });
    setTeamName("");
    fetchAllData();
  };
  const handleInviteMember = async (teamId, recipientId) => {
    await sendInvitation({ teamId, recipientId });
    alert("Invitation sent!");
    setShowInviteModal(false);
    setSelectedTeamForInvite(null);
  };

  const openInviteModal = (teamId) => {
    setSelectedTeamForInvite(teamId);
    setShowInviteModal(true);
  };

  const handleRemoveMember = async (teamId, userId) => {
    await removeMemberFromTeam({ teamId, userId });
    fetchAllData();
  };

  const handleDisbandTeam = async (teamId) => {
    await disbandTeam({ teamId });
    fetchAllData();
  };

  const handleLeaveTeam = async (teamId) => {
    await leaveTeam({ teamId });
    fetchAllData();
  };

  const handleAssignIssue = async (teamId, issueId) => {
    await assignIssueToTeam({ teamId, issueId });
    setSelectedIssue(null); // Close modal after assignment
    fetchAllData();
  };

  const handleRemoveIssue = async (teamId) => {
    await removeIssueFromTeam({ teamId });
    setSelectedIssue(null); // Close modal after unassignment
    fetchAllData();
  };

  const handleResolveIssue = async (teamId) => {
    await resolveIssue({ teamId });
    setSelectedIssue(null); // Close modal after completion
    fetchAllData();
  };

  const userTeam = teams.find((team) =>
    team.members.some((member) => member._id === currentUser)
  );

  // Check if user is a business account
  if (userType === "business") {
    return (
      <div className="team-page">
        <div className="access-denied">
          <div className="access-denied-content">
            <h2>🚫 Access Restricted</h2>
            <p>Team features are only available for citizen accounts.</p>
            <p>Business accounts can manage their business listings instead.</p>
            <div className="access-denied-actions">
              <a href="/business" className="btn-primary">
                Go to My Business
              </a>
              <a href="/businesses" className="btn-secondary">
                View All Businesses
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="team-page">
      <h1>Teams</h1>

      {/* Team Statistics */}
      <div className="team-stats">
        <div className="stat-card">
          <div className="stat-number">{teams.length}</div>
          <div className="stat-label">Total Teams</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {issues.filter((issue) => issue.status === "Reported").length}
          </div>
          <div className="stat-label">Available Issues</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {issues.filter((issue) => issue.status === "Assigned").length}
          </div>
          <div className="stat-label">Issues in Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {issues.filter((issue) => issue.status === "Resolved").length}
          </div>
          <div className="stat-label">Resolved Issues</div>
        </div>
      </div>
      {!userTeam && (
        <div className="create-team-form">
          <h2>Create a New Team</h2>
          {!showCreateTeam ? (
            <button
              onClick={() => setShowCreateTeam(true)}
              className="btn-create-team"
            >
              🚀 Create Your First Team
            </button>
          ) : (
            <form onSubmit={handleCreateTeam}>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name..."
                required
                autoFocus
              />
              <div className="form-actions">
                <button type="submit">Create Team</button>
                <button
                  type="button"
                  onClick={() => setShowCreateTeam(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="teams-list">
        <h2>Existing Teams</h2>
        {teams.map((team) => (
          <div key={team._id} className="team-card">
            <h3>{team.name}</h3>
            <p>
              <strong>Leader:</strong> {team.leader?.name}
            </p>
            <p>
              <strong>Issue:</strong> {team.issue?.title || "Not assigned"}
            </p>
            <div className="team-members">
              <strong>Members:</strong>
              <ul>
                {team.members.map((member) => (
                  <li key={member._id}>
                    {member.name}
                    {currentUser === team.leader &&
                      currentUser !== member._id && (
                        <button
                          onClick={() =>
                            handleRemoveMember(team._id, member._id)
                          }
                        >
                          Remove
                        </button>
                      )}
                  </li>
                ))}
              </ul>
            </div>

            {currentUser === team.leader?._id && (
              <>
                <div className="team-actions">
                  <button
                    onClick={() => handleDisbandTeam(team._id)}
                    className="disband-button"
                  >
                    Disband Team
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {userTeam && (
        <div className="user-team">
          <h2>Your Team: {userTeam.name}</h2>
          {userTeam.issue ? (
            <div className="assigned-issue-card">
              <div className="issue-header">
                <h3>Assigned Issue</h3>
                <span
                  className={`status-badge status-${userTeam.issue.status?.toLowerCase()}`}
                >
                  {userTeam.issue.status || "Assigned"}
                </span>
              </div>
              <div className="issue-content">
                <h4 className="issue-title">
                  {userTeam.issue.title || "Untitled Issue"}
                </h4>
                <p className="issue-description">
                  {userTeam.issue.description}
                </p>
                <div className="issue-meta">
                  <span className="priority">
                    Priority: {userTeam.issue.aiSeverity || "Medium"}
                  </span>
                  <span className="category">
                    Category: {userTeam.issue.aiCategory || "General"}
                  </span>
                </div>
              </div>
              {userTeam.leader._id === currentUser && (
                <div className="issue-actions">
                  <button
                    onClick={() => handleRemoveIssue(userTeam._id)}
                    className="unassign-btn"
                  >
                    Unassign Issue
                  </button>
                  <button
                    onClick={() => handleResolveIssue(userTeam._id)}
                    className="complete-btn"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="no-issue-card">
              <p>No issue assigned to your team yet.</p>
            </div>
          )}
          <div className="team-members">
            <strong>Members:</strong>
            <ul>
              {userTeam.members.map((member) => (
                <li key={member._id}>{member.name}</li>
              ))}
            </ul>
          </div>
          <div className="team-actions">
            {userTeam.leader._id === currentUser ? (
              <button
                onClick={() => handleDisbandTeam(userTeam._id)}
                className="disband-button"
              >
                Disband Team
              </button>
            ) : (
              <button
                onClick={() => handleLeaveTeam(userTeam._id)}
                className="leave-button"
              >
                Leave Team
              </button>
            )}
          </div>
        </div>
      )}

      <div className="available-users">
        <h2>Available Users</h2>
        <ul>
          {users
            .filter(
              (user) =>
                user.userType === "citizen" && // Only show citizen users
                !(user.teams || []).some((t) => t._id === userTeam?._id) &&
                !teams.some((team) => team.leader._id === user._id)
            )
            .map((user) => (
              <li key={user._id}>
                {user.name}
                {userTeam && currentUser === userTeam.leader._id && (
                  <button
                    onClick={() => handleInviteMember(userTeam._id, user._id)}
                    className="invite-btn"
                  >
                    📧 Invite
                  </button>
                )}
              </li>
            ))}
        </ul>
      </div>

      <div className="available-issues">
        <h2>Available Issues</h2>
        <ul>
          {issues
            .filter((issue) => issue.status === "Reported")
            .map((issue) => (
              <li key={issue._id} className="issue-item">
                <div className="issue-content">
                  <span className="issue-title">
                    {issue.title || issue.description.substring(0, 50) + "..."}
                  </span>
                  <div className="issue-actions">
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="view-details-btn"
                    >
                      View Details
                    </button>
                    {userTeam &&
                      userTeam.leader._id === currentUser &&
                      !userTeam.issue && (
                        <button
                          onClick={() =>
                            handleAssignIssue(userTeam._id, issue._id)
                          }
                          className="assign-btn"
                        >
                          Assign
                        </button>
                      )}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
      {selectedIssue && (
        <div className="issue-details-modal">
          <div className="issue-details-content">
            <span className="close" onClick={() => setSelectedIssue(null)}>
              &times;
            </span>
            <h2>{selectedIssue.title}</h2>
            <p>
              <strong>Description:</strong> {selectedIssue.description}
            </p>
            <p>
              <strong>Created by:</strong>{" "}
              {selectedIssue.reportedBy?.name || "Anonymous"}
            </p>
            <p>
              <strong>Status:</strong> {selectedIssue.status}
            </p>
            <p>
              <strong>Priority:</strong> {selectedIssue.aiSeverity || "Pending"}
            </p>

            {/* Action buttons */}
            <div className="issue-actions">
              {userTeam &&
                userTeam.leader._id === currentUser &&
                !userTeam.issue &&
                selectedIssue.status === "Reported" && (
                  <button
                    onClick={() =>
                      handleAssignIssue(userTeam._id, selectedIssue._id)
                    }
                    className="assign-btn"
                  >
                    Assign to My Team
                  </button>
                )}

              {userTeam &&
                userTeam.issue &&
                userTeam.issue._id === selectedIssue._id &&
                userTeam.leader._id === currentUser && (
                  <div className="team-issue-actions">
                    <button
                      onClick={() => handleRemoveIssue(userTeam._id)}
                      className="unassign-btn"
                    >
                      Unassign Issue
                    </button>
                    <button
                      onClick={() => handleResolveIssue(userTeam._id)}
                      className="complete-btn"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
            </div>

            <div className="map-container">
              <MapView issues={[selectedIssue]} />
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="invite-modal">
          <div className="invite-modal-content">
            <span className="close" onClick={() => setShowInviteModal(false)}>
              &times;
            </span>
            <h3>Invite Team Members</h3>
            <p>Select users to invite to your team:</p>
            <div className="available-users-list">
              {users
                .filter(
                  (user) =>
                    user.userType === "citizen" && // Only show citizen users
                    !(user.teams || []).some((t) => t._id === userTeam?._id) &&
                    !teams.some((team) => team.leader._id === user._id) &&
                    user._id !== currentUser
                )
                .map((user) => (
                  <div key={user._id} className="user-invite-item">
                    <span>{user.name}</span>
                    <button
                      onClick={() =>
                        handleInviteMember(selectedTeamForInvite, user._id)
                      }
                      className="invite-user-btn"
                    >
                      📧 Send Invite
                    </button>
                  </div>
                ))}
            </div>
            {users.filter(
              (user) =>
                user.userType === "citizen" && // Only show citizen users
                !(user.teams || []).some((t) => t._id === userTeam?._id) &&
                !teams.some((team) => team.leader._id === user._id) &&
                user._id !== currentUser
            ).length === 0 && (
              <p className="no-users-message">No available users to invite.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
