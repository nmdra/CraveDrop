import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../services/axios";
import styles from './Login.module.css';

const Login = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  // Add this state to track if admin login is selected
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  // Focus email input on component mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);
  
  // Check for message in location state (e.g., from successful registration or account deletion)
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const validateField = (name, value) => {
    let error = "";
    
    switch(name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!emailRegex.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
        
      case "password":
        if (!value) {
          error = "Password is required";
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all fields
    for (const field in formData) {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    }
    
    // Additional check for repeated login attempts
    if (loginAttempts >= 3) {
      newErrors.general = "Multiple failed login attempts detected. Please verify your credentials or reset your password.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear errors when typing
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error, general: '' }));
    }
    
    setFormData({ ...formData, [name]: value });
  };

  // Add this function to handle the toggle between user and admin login
  const toggleLoginType = () => {
    setIsAdminLogin(!isAdminLogin);
    // Clear any existing errors when switching login types
    setErrors({});
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing messages
    setMessage("");
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Different endpoint for admin login
      const endpoint = isAdminLogin ? "/api/auth/admin/login" : "/api/auth/login";
      const response = await axios.post(endpoint, formData);
      
      // Reset login attempts on successful login
      setLoginAttempts(0);
      
      if (isAdminLogin) {
        // Store admin token and info differently to distinguish from restaurant users
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminUser", JSON.stringify(response.data.user));
        
        setMessage("Admin login successful! Redirecting...");
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      } else {
        // Regular restaurant login (your existing code)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("restaurant", JSON.stringify(response.data.restaurant));
        
        setMessage("Login successful! Redirecting...");
        
        // Redirect to restaurant dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      // Increment login attempts on failure
      setLoginAttempts(prev => prev + 1);
      
      // Handle error messages
      if (error.response?.status === 401) {
        setMessage("Invalid credentials. Please check your email and password.");
      } else if (error.response?.status === 429) {
        setMessage("Too many login attempts. Please try again later.");
      } else {
        setMessage(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.loginTypeToggle}>
          <button
            type="button"
            className={`${styles.loginTypeButton} ${!isAdminLogin ? styles.active : ''}`}
            onClick={() => toggleLoginType(false)}
          >
            Restaurant Login
          </button>
          <button
            type="button"
            className={`${styles.loginTypeButton} ${isAdminLogin ? styles.active : ''}`}
            onClick={() => toggleLoginType(true)}
          >
            Admin Login
          </button>
        </div>

        <h1 className={styles.title}>{isAdminLogin ? "Admin Login" : "Restaurant Login"}</h1>
        
        {errors.general && (
          <div 
            className={styles.generalError} 
            role="alert" 
            aria-live="assertive"
          >
            {errors.general}
          </div>
        )}
        
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Email Address<span className={styles.requiredStar}>*</span>
          </label>
          <input
            ref={emailInputRef}
            className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ''}`}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={touched.email && errors.email ? "true" : "false"}
            aria-describedby="email-error"
            autoComplete="email"
            required
          />
          {touched.email && errors.email && (
            <div className={styles.errorText} id="email-error" role="alert">
              {errors.email}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="password">
            Password<span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.passwordInputContainer}>
            <input
              className={`${styles.input} ${touched.password && errors.password ? styles.inputError : ''}`}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={touched.password && errors.password ? "true" : "false"}
              aria-describedby="password-error"
              autoComplete="current-password"
              required
            />
            <button 
              type="button" 
              className={styles.togglePasswordBtn}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {touched.password && errors.password && (
            <div className={styles.errorText} id="password-error" role="alert">
              {errors.password}
            </div>
          )}
        </div>

        <div className={styles.forgotPassword}>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button 
          className={isLoading ? styles.buttonLoading : styles.button} 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <div 
            id="login-error-message"
            className={message.includes('successful') ? styles.success : styles.error}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}
        
        <p className={styles.registerLink}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;