import React, { useState, useEffect } from "react";
import {
  getTeams,
  createTeam,
  getUsers,
  addMemberToTeam,
  removeMemberFromTeam,
  leaveTeam,
  disbandTeam,
} from "../services/apiService";
import "./css/TeamPage.css";
import { jwtDecode } from "jwt-decode";

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

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

  const handleAddMember = async (teamId, userId) => {
    await addMemberToTeam({ teamId, userId });
    fetchAllData();
  };

  const handleRemoveMember = async (teamId, userId) => {
    await removeMemberFromTeam({ teamId, userId });
    fetchAllData();
  };

  const handleLeaveTeam = async (teamId) => {
    await leaveTeam({ teamId });
    fetchAllData();
  };

  const handleDisbandTeam = async (teamId) => {
    await disbandTeam({ teamId });
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

            {currentUser === team.leader && (
              <div className="add-member-form">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const userId = e.target.elements.user.value;
                    handleAddMember(team._id, userId);
                  }}
                >
                  <select name="user">
                    <option value="">Select a User to Add</option>
                    {users
                      .filter(
                        (user) => !team.members.some((m) => m._id === user._id)
                      )
                      .map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                  <button type="submit">Add Member</button>
                </form>
                <button onClick={() => handleDisbandTeam(team._id)}>
                  Disband Team
                </button>
              </div>
            )}

            {userTeam &&
              userTeam._id === team._id &&
              currentUser !== team.leader && (
                <button onClick={() => handleLeaveTeam(team._id)}>
                  Leave Team
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
