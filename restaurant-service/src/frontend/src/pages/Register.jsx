import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/axios";
import styles from './Register.module.css';

const Register = ({ darkMode }) => {
  const navigate = useNavigate();
  const firstInputRef = useRef(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // Added confirm password field
    description: "",
    telephoneNumber: "",
    location: {
      address: "",
      city: "",
      postalCode: "",
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    cuisine: "",
    logo: null,
    coverImage: null,
  });

  // Form state management
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Focus first input on component mount
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // Password strength evaluation
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (formData.password.length >= 8) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(formData.password)) strength += 1;
    // Contains lowercase
    if (/[a-z]/.test(formData.password)) strength += 1;
    // Contains number
    if (/[0-9]/.test(formData.password)) strength += 1;
    // Contains special char
    if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  const validateField = (name, value) => {
    let error = "";
    
    switch(name) {
      case "name":
        if (!value.trim()) {
          error = "Restaurant name is required";
        } else if (value.length < 2) {
          error = "Restaurant name must be at least 2 characters";
        } else if (value.length > 50) {
          error = "Restaurant name cannot exceed 50 characters";
        }
        break;
        
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
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(value)) {
          error = "Password must contain at least one number";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          error = "Password must contain at least one special character";
        }
        break;
        
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
        
      case "description":
        if (!value.trim()) {
          error = "Description is required";
        } else if (value.length < 20) {
          error = "Description must be at least 20 characters";
        } else if (value.length > 500) {
          error = "Description cannot exceed 500 characters";
        }
        break;
        
      case "telephoneNumber":
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!value.trim()) {
          error = "Telephone number is required";
        } else if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
          error = "Please enter a valid telephone number (10-15 digits)";
        }
        break;
        
      case "location.address":
        if (!value.trim()) {
          error = "Address is required";
        } else if (value.length > 100) {
          error = "Address cannot exceed 100 characters";
        }
        break;
        
      case "location.city":
        if (!value.trim()) {
          error = "City is required";
        } else if (value.length > 50) {
          error = "City name cannot exceed 50 characters";
        }
        break;
        
      case "location.postalCode":
        const postalRegex = /^[0-9a-zA-Z\s-]{3,10}$/;
        if (!value.trim()) {
          error = "Postal code is required";
        } else if (!postalRegex.test(value)) {
          error = "Please enter a valid postal code (3-10 alphanumeric characters)";
        }
        break;
        
      case "cuisine":
        if (value) {
          if (value.length > 100) {
            error = "Cuisine list cannot exceed 100 characters";
          } else if (!/^[a-zA-Z\s,]+$/.test(value)) {
            error = "Cuisine should only contain letters, spaces, and commas";
          }
        }
        break;
        
      case "logo":
        if (!value) {
          error = "Restaurant logo is required";
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
      if (field === 'location') {
        for (const locationField in formData.location) {
          if (locationField !== 'coordinates') {
            const error = validateField(`location.${locationField}`, formData.location[locationField]);
            if (error) newErrors[`location.${locationField}`] = error;
          }
        }
      } else if (field !== 'coverImage') { // Cover image is optional
        const value = formData[field];
        const error = validateField(field, value);
        if (error) newErrors[field] = error;
      }
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
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (files.length > 0) {
      const file = files[0];
      const fileSize = file.size / 1024 / 1024; // in MB
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      
      let error = "";
      
      if (!validTypes.includes(file.type)) {
        error = "Only image files (JPEG, PNG, GIF) are allowed";
      } else if (fileSize > 5) {
        error = "File size cannot exceed 5MB";
      } else if (file.name.length > 100) {
        error = "File name is too long (max 100 characters)";
      }
      
      setErrors(prev => ({ ...prev, [name]: error }));
      
      if (!error) {
        setFormData({ ...formData, [name]: file });
      }
    } else {
      // If user cancels file selection and field is required
      if (name === 'logo' && !formData.logo) {
        setErrors(prev => ({ ...prev, [name]: "Restaurant logo is required" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      if (field === 'location') {
        return {
          ...acc,
          'location.address': true,
          'location.city': true,
          'location.postalCode': true
        };
      }
      return { ...acc, [field]: true };
    }, {});
    
    setTouched(allTouched);
    
    // Validate form before submission
    if (!validateForm()) {
      // Find the first error field and scroll to it
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      
      if (errorElement) {
        errorElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        errorElement.focus();
      }
      return;
    }
    
    // Remove confirmPassword from data to be sent
    const { confirmPassword, ...dataToSubmit } = formData;
    
    setIsLoading(true);
    const form = new FormData();
    
    Object.keys(dataToSubmit).forEach((key) => {
      if (key === 'location') {
        form.append(key, JSON.stringify(dataToSubmit[key]));
      } else {
        form.append(key, dataToSubmit[key]);
      }
    });

    try {
      const response = await axios.post("/api/auth/register", form);
      setMessage(response.data.message || "Registration successful!");
      
      // Clear form after successful submission
      if (response.data.token) {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          description: "",
          telephoneNumber: "",
          location: {
            address: "",
            city: "",
            postalCode: "",
            coordinates: { latitude: 0, longitude: 0 }
          },
          cuisine: "",
          logo: null,
          coverImage: null,
        });
        setTouched({});
        
        // Store token and restaurant info
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("restaurant", JSON.stringify(response.data.restaurant));
        
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific error responses from the backend
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.status === 400) {
        setMessage("Registration failed: Invalid information provided");
      } else if (error.response?.status === 409) {
        setMessage("An account with this email already exists.");
        setErrors(prev => ({ ...prev, email: "This email is already registered" }));
      } else {
        setMessage("Registration failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return styles.weakPassword;
    if (passwordStrength <= 4) return styles.mediumPassword;
    return styles.strongPassword;
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Register Restaurant</h1>
        
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="name">
            Restaurant Name<span className={styles.requiredStar}>*</span>
          </label>
          <input
            ref={firstInputRef}
            className={`${styles.input} ${touched.name && errors.name ? styles.inputError : ''}`}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={touched.name && errors.name ? "true" : "false"}
            aria-describedby="name-error"
            required
          />
          {touched.name && errors.name && (
            <div className={styles.errorText} id="name-error" role="alert">
              {errors.name}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Email Address<span className={styles.requiredStar}>*</span>
          </label>
          <input
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
              aria-describedby="password-error password-requirements"
              autoComplete="new-password"
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
          {formData.password && (
            <div className={styles.passwordStrength}>
              <div className={styles.strengthMeter}>
                <div 
                  className={`${styles.strengthIndicator} ${getPasswordStrengthClass()}`} 
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <span className={styles.strengthLabel}>{getPasswordStrengthLabel()}</span>
            </div>
          )}
          <div className={styles.passwordHint} id="password-requirements">
            Password must be at least 8 characters with uppercase & lowercase letters, a number, and a special character.
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="confirmPassword">
            Confirm Password<span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.passwordInputContainer}>
            <input
              className={`${styles.input} ${touched.confirmPassword && errors.confirmPassword ? styles.inputError : ''}`}
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={touched.confirmPassword && errors.confirmPassword ? "true" : "false"}
              aria-describedby="confirm-password-error"
              autoComplete="new-password"
              required
            />
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <div className={styles.errorText} id="confirm-password-error" role="alert">
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="description">
            Description<span className={styles.requiredStar}>*</span>
          </label>
          <textarea
            className={`${styles.textarea} ${touched.description && errors.description ? styles.inputError : ''}`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={touched.description && errors.description ? "true" : "false"}
            aria-describedby="description-error"
            placeholder="Describe your restaurant, cuisine type, and special offerings..."
            required
          />
          {touched.description && errors.description && (
            <div className={styles.errorText} id="description-error" role="alert">
              {errors.description}
            </div>
          )}
          <div className={styles.charCounter}>{formData.description.length}/500</div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="telephoneNumber">
            Telephone Number<span className={styles.requiredStar}>*</span>
          </label>
          <input
            className={`${styles.input} ${touched.telephoneNumber && errors.telephoneNumber ? styles.inputError : ''}`}
            type="tel"
            id="telephoneNumber"
            name="telephoneNumber"
            value={formData.telephoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={touched.telephoneNumber && errors.telephoneNumber ? "true" : "false"}
            aria-describedby="tel-error"
            placeholder="e.g., +1234567890"
            autoComplete="tel"
            required
          />
          {touched.telephoneNumber && errors.telephoneNumber && (
            <div className={styles.errorText} id="tel-error" role="alert">
              {errors.telephoneNumber}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="location.address">
            Address<span className={styles.requiredStar}>*</span>
          </label>
          <input
            className={`${styles.input} ${touched['location.address'] && errors['location.address'] ? styles.inputError : ''}`}
            type="text"
            id="location.address"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={touched['location.address'] && errors['location.address'] ? "true" : "false"}
            aria-describedby="address-error"
            placeholder="Street address"
            autoComplete="street-address"
            required
          />
          {touched['location.address'] && errors['location.address'] && (
            <div className={styles.errorText} id="address-error" role="alert">
              {errors['location.address']}
            </div>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="location.city">
              City<span className={styles.requiredStar}>*</span>
            </label>
            <input
              className={`${styles.input} ${touched['location.city'] && errors['location.city'] ? styles.inputError : ''}`}
              type="text"
              id="location.city"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={touched['location.city'] && errors['location.city'] ? "true" : "false"}
              aria-describedby="city-error"
              autoComplete="address-level2"
              required
            />
            {touched['location.city'] && errors['location.city'] && (
              <div className={styles.errorText} id="city-error" role="alert">
                {errors['location.city']}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="location.postalCode">
              Postal Code<span className={styles.requiredStar}>*</span>
            </label>
            <input
              className={`${styles.input} ${touched['location.postalCode'] && errors['location.postalCode'] ? styles.inputError : ''}`}
              type="text"
              id="location.postalCode"
              name="location.postalCode"
              value={formData.location.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={touched['location.postalCode'] && errors['location.postalCode'] ? "true" : "false"}
              aria-describedby="postal-code-error"
              autoComplete="postal-code"
              required
            />
            {touched['location.postalCode'] && errors['location.postalCode'] && (
              <div className={styles.errorText} id="postal-code-error" role="alert">
                {errors['location.postalCode']}
              </div>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="cuisine">
            Cuisine Types
          </label>
          <input
            className={`${styles.input} ${touched.cuisine && errors.cuisine ? styles.inputError : ''}`}
            type="text"
            id="cuisine"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.cuisine && errors.cuisine ? "true" : "false"}
            aria-describedby="cuisine-error"
            placeholder="e.g., Italian, Chinese, Indian (comma separated)"
          />
          {touched.cuisine && errors.cuisine && (
            <div className={styles.errorText} id="cuisine-error" role="alert">
              {errors.cuisine}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="logo">
            Restaurant Logo<span className={styles.requiredStar}>*</span>
          </label>
          <input
            className={styles.fileInput}
            type="file"
            id="logo"
            name="logo"
            onChange={handleFileChange}
            onBlur={() => setTouched(prev => ({ ...prev, logo: true }))}
            accept="image/jpeg,image/png,image/gif"
            aria-required="true"
            aria-invalid={touched.logo && errors.logo ? "true" : "false"}
            aria-describedby="logo-error"
          />
          <label 
            className={`${styles.fileLabel} ${touched.logo && errors.logo ? styles.fileLabelError : ''}`} 
            htmlFor="logo"
          >
            {formData.logo ? formData.logo.name : 'Choose Logo'}
          </label>
          {touched.logo && errors.logo && (
            <div className={styles.errorText} id="logo-error" role="alert">
              {errors.logo}
            </div>
          )}
          <div className={styles.fileHint}>Recommended size: 500×500 pixels (Max 5MB)</div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="coverImage">
            Cover Image
          </label>
          <input
            className={styles.fileInput}
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={handleFileChange}
            onBlur={() => setTouched(prev => ({ ...prev, coverImage: true }))}
            accept="image/jpeg,image/png,image/gif"
            aria-invalid={touched.coverImage && errors.coverImage ? "true" : "false"}
            aria-describedby="cover-error"
          />
          <label 
            className={`${styles.fileLabel} ${touched.coverImage && errors.coverImage ? styles.fileLabelError : ''}`} 
            htmlFor="coverImage"
          >
            {formData.coverImage ? formData.coverImage.name : 'Choose Cover Image'}
          </label>
          {touched.coverImage && errors.coverImage && (
            <div className={styles.errorText} id="cover-error" role="alert">
              {errors.coverImage}
            </div>
          )}
          <div className={styles.fileHint}>Recommended size: 1200×300 pixels (Max 5MB)</div>
        </div>

        {message && (
          <div 
            className={message.includes('failed') || message.includes('Invalid') ? styles.error : styles.success}
            role="alert"
            aria-live="assertive"
          >
            {message}
          </div>
        )}

        <button 
          className={isLoading ? styles.buttonLoading : styles.button} 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register Restaurant'}
        </button>
        
        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;