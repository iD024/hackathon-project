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
import { jwtDecode } from "jwt-decode";

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [issues, setIssues] = useState([]);

  const fetchAllData = async () => {
    const token = localStorage.getItem("civicPulseToken");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded.id);
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
    // Maybe show a confirmation message
    alert("Invitation sent!");
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
    fetchAllData();
  };

  const handleRemoveIssue = async (teamId) => {
    await removeIssueFromTeam({ teamId });
    fetchAllData();
  };

  const handleResolveIssue = async (teamId) => {
    await resolveIssue({ teamId });
    fetchAllData();
  };

  const userTeam = teams.find((team) =>
    team.members.some((member) => member._id === currentUser)
  );

  return (
    <div className="team-page">
      <h1>Teams</h1>
      {!userTeam && (
        <div className="create-team-form">
          <h2>Create a New Team</h2>
          <form onSubmit={handleCreateTeam}>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name"
              required
            />
            <button type="submit">Create Team</button>
          </form>
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
            <div className="assigned-issue">
              <h3>Assigned Issue</h3>
              <p>{userTeam.issue.title}</p>
              <p>{userTeam.issue.description}</p>
              {userTeam.leader === currentUser && (
                <div>
                  <button onClick={() => handleRemoveIssue(userTeam._id)}>
                    Remove Issue
                  </button>
                  <button onClick={() => handleResolveIssue(userTeam._id)}>
                    Mark as Done
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>No issue assigned.</p>
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
                !(user.teams || []).some((t) => t._id === userTeam?._id) &&
                !teams.some((team) => team.leader._id === user._id)
            )
            .map((user) => (
              <li key={user._id}>
                {user.name}
                {userTeam && currentUser === userTeam.leader._id && (
                  <button
                    onClick={() => handleInviteMember(userTeam._id, user._id)}
                  >
                    Invite to Team
                  </button>
                )}
              </li>
            ))}
        </ul>
      </div>

      <div className="available-issues">
        <h2>Available Issues</h2>
        <ul>
          {issues.map((issue) => (
            <li key={issue._id}>
              {issue.title}
              {userTeam &&
                userTeam.leader === currentUser &&
                !userTeam.issue && (
                  <button
                    onClick={() => handleAssignIssue(userTeam._id, issue._id)}
                  >
                    Assign
                  </button>
                )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamPage;
