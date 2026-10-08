import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PasswordInput from "../components/PasswordInput";
import { registerUser } from "../services/authApi";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState("default");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await registerUser({
        username,
        email,
        age: Number(age),
        password,
        confirm_password: confirmPassword,
        avatar,
      });

      setSuccess("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="age">
            Age
          </label>

          <input
            id="age"
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(event) =>
              setAge(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="avatar">
            Choose Avatar
          </label>

          <select
            id="avatar"
            value={avatar}
            onChange={(event) =>
              setAvatar(event.target.value)
            }
          >
            <option value="default">👤 Default</option>
            <option value="girl">👩 Girl</option>
            <option value="boy">👨 Boy</option>
            <option value="student">🎓 Student</option>
            <option value="developer">👩‍💻 Developer</option>
            <option value="artist">🎨 Artist</option>
          </select>
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>

          <PasswordInput
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        {success && <p>{success}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;