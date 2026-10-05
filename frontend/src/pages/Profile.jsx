import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>My Profile</h1>

      <p>
        <strong>Username:</strong> {user.username}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <p>
        <strong>Role:</strong> {user.role}
      </p>

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Profile;