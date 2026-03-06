import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../shared/store/useAuthStore";
import styles from "./AuthPages.module.css";

export const LoginPage: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login({ email, password }).catch(() => {});
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Welcome Back!</h1>

        {authError && <div className={styles.error}>{authError}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Play!"}
          </button>
        </form>

        <p className={styles.linkText}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Sign up here!
          </Link>
        </p>
      </div>
    </div>
  );
};
