import React, { useState, useEffect } from "react";
import { getNotifications, respondToInvitation } from "../services/apiService";
import "./css/Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const notifs = await getNotifications();
    setNotifications(notifs);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleResponse = async (notificationId, response) => {
    await respondToInvitation({ notificationId, response });
    fetchNotifications();
  };

  return (
    <div className="notifications-dropdown">
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif._id} className="notification-item">
            <p>
              <strong>{notif.team.name}</strong> (Leader:{" "}
              {notif.team.leader ? notif.team.leader.name : "N/A"}) has invited
              you to join.
            </p>
            {notif.status === "pending" && (
              <div>
                <button onClick={() => handleResponse(notif._id, "accepted")}>
                  Accept
                </button>
                <button onClick={() => handleResponse(notif._id, "declined")}>
                  Decline
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
