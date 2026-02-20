import RegisterForm from "../components/RegisterForm";
import "./Login.css";

export default function Register() {
  return (
    <div className="login-container">
      <div className="login-card">
        <RegisterForm />
      </div>
    </div>
  );
}