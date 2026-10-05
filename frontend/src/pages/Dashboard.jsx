import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome, {user.username}!</p>

      <p>
        Role: <strong>{user.role}</strong>
      </p>

      <p>Email: {user.email}</p>

      <button onClick={() => navigate("/profile")}>
        View Profile
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;