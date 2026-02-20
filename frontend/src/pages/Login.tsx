import LoginForm from "../components/LoginForm";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <LoginForm />
      </div>
    </div>
  );
}