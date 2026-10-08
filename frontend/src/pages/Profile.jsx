import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, updateUserProfile, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const profileData = {
        name,
        age: Number(age),
        gender,
      };

      await updateUserProfile(profileData);

      setSuccess("Profile updated successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");
    setPasswordSubmitting(true);

    try {
      await updatePassword(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setPasswordSuccess("Password changed successfully.");
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setPasswordSubmitting(false);
    }
  }

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

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">
              Prefer not to say
            </option>
          </select>
        </div>

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <h2>Change Password</h2>

      <form onSubmit={handlePasswordSubmit}>
        <div>
          <label htmlFor="currentPassword">
            Current Password
          </label>

          <PasswordInput
            id="currentPassword"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword">
            New Password
          </label>

          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />
        </div>

        {passwordError && <p>{passwordError}</p>}
        {passwordSuccess && <p>{passwordSuccess}</p>}

        <button type="submit" disabled={passwordSubmitting}>
          {passwordSubmitting ? "Changing..." : "Change Password"}
        </button>
      </form>

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Profile;