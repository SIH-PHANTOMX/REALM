
class RealmAuth {
  constructor() {
    this.apiBaseUrl = "http://localhost:5000/api/auth"; // ✅ Full backend path
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupPasswordToggles();
    this.setupValidation();
    this.checkExistingAuth();
  }

  bindEvents() {
    // Form switching
    document.getElementById("showSignupBtn")?.addEventListener("click", () => this.showSignup());
    document.getElementById("showLoginBtn")?.addEventListener("click", () => this.showLogin());
    document.getElementById("showAdminLoginBtn")?.addEventListener("click", () => this.showAdminLogin());
    document.getElementById("showRegularLoginBtn")?.addEventListener("click", () => this.showLogin());

    // Form submissions
    document.getElementById("loginForm")?.addEventListener("submit", (e) => this.handleLogin(e));
    document.getElementById("signupForm")?.addEventListener("submit", (e) => this.handleSignup(e));
    document.getElementById("adminLoginForm")?.addEventListener("submit", (e) => this.handleAdminLogin(e));
    document.getElementById("forgotPasswordForm")?.addEventListener("submit", (e) => this.handleForgotPassword(e));
    document.getElementById("verifyOtpBtn")?.addEventListener("click", () => this.verifyOtp());
    document.getElementById("resetPasswordBtn")?.addEventListener("click", () => this.resetPassword());
    document.getElementById("resendOtp")?.addEventListener("click", () => this.resendOtp());

    document.querySelector(".forgot-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.showForgotPassword();
    });

    document.getElementById("backToLoginBtn")?.addEventListener("click", () => this.showLogin());
  }

  checkExistingAuth() {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      this.verifyToken(token, role);
    }
  }

  async verifyToken(token, role) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        this.redirectToDashboard(role);
      } else {
        this.clearAuth();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      this.clearAuth();
    }
  }

  clearAuth() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  }

  // ✅ LOGIN
// ✅ LOGIN
async handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${this.apiBaseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Login successful: " + data.user.email);

      // Save token & role
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userId", data.user.id);

      // ✅ Redirect based on role
      if (data.user.role === "student") {
        window.location.href = "/student-dashboard.html";
      } else if (data.user.role === "alumni") {
        window.location.href = "/alumni-dashboard.html";
      } else if (data.user.role === "admin") {
        window.location.href = "/admin-dashboard.html";
      } else {
        window.location.href = "/dashboard.html";
      }
    } else {
      alert("❌ Login failed: " + data.message);
    }
  } catch (err) {
    console.error("Login error:", err);
  }
}


// ✅ SIGNUP
// ✅ SIGNUP
async handleSignup(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const role = document.querySelector('input[name="role"]:checked')?.value;

  const name = `${firstName} ${lastName}`;

  try {
    const res = await fetch(`${this.apiBaseUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Signup successful: " + data.user.email);

      // Save token & role
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userId", data.user.id);

      // ✅ Redirect based on role
      if (data.user.role === "student") {
        window.location.href = "/student-dashboard.html";
      } else if (data.user.role === "alumni") {
        window.location.href = "/alumni-dashboard.html";
      } else if (data.user.role === "admin") {
        window.location.href = "/admin-dashboard.html";
      } else {
        window.location.href = "/dashboard.html";
      }
    } else {
      alert("❌ Signup failed: " + data.message);
    }
  } catch (err) {
    console.error("Signup error:", err);
  }
}



  setupPasswordToggles() {
    const toggles = [
      { id: "toggleLogin", inputId: "loginPassword" },
      { id: "toggleSignup", inputId: "signupPassword" },
      { id: "toggleAdmin", inputId: "adminPassword" },
      { id: "toggleNewPass", inputId: "newPassword" },
      { id: "toggleConfirmPass", inputId: "confirmPassword" },
    ];
    toggles.forEach(({ id, inputId }) => {
      const toggleBtn = document.getElementById(id);
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => this.togglePassword(inputId, toggleBtn));
      }
    });
  }

  togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector("i");
    if (input && icon) {
      if (input.type === "password") {
        input.type = "text";
        icon.className = "fas fa-eye-slash";
      } else {
        input.type = "password";
        icon.className = "far fa-eye";
      }
    }
  }

  showSignup() {
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("adminLoginContainer").classList.add("hidden");
    document.getElementById("signupContainer").classList.remove("hidden");
    this.hideMessage();
    this.clearErrors();
  }

  showLogin() {
    document.getElementById("signupContainer").classList.add("hidden");
    document.getElementById("adminLoginContainer").classList.add("hidden");
    document.getElementById("loginContainer").classList.remove("hidden");
    this.hideMessage();
    this.clearErrors();
  }

  showAdminLogin() {
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("signupContainer").classList.add("hidden");
    document.getElementById("adminLoginContainer").classList.remove("hidden");
    this.hideMessage();
    this.clearErrors();
  }

  showForgotPassword() {
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("signupContainer").classList.add("hidden");
    document.getElementById("adminLoginContainer").classList.add("hidden");
    document.getElementById("forgotPasswordContainer").classList.remove("hidden");
    this.hideMessage();
    this.clearErrors();
  }

  async handleAdminLogin(e) {
    e.preventDefault();
    const btn = document.getElementById("adminLoginBtn");
    const spinner = document.getElementById("adminSpinner");
    let adminData = { email: "", password: "", accessCode: "" };

    try {
      this.setLoading(btn, spinner, true);
      this.clearErrors();

      const formData = new FormData(e.target);
      adminData = {
        email: (formData.get("email") || "").trim().toLowerCase(),
        password: formData.get("password") || "",
        accessCode: formData.get("accessCode") || "",
      };

      if (!this.validateAdminLogin(adminData)) {
        this.setLoading(btn, spinner, false);
        return;
      }

      if (!this.checkAdminRateLimit(adminData.email)) {
        this.showMessage(
          "Too many login attempts. Please try again in 30 minutes.",
          "error",
          "fas fa-clock"
        );
        this.setLoading(btn, spinner, false);
        return;
      }

      const response = await fetch(`${this.apiBaseUrl}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Access": adminData.accessCode,
          "X-Request-ID": this.generateRequestId(),
          "X-Client-Info": this.getClientInfo(),
        },
        body: JSON.stringify({
          email: adminData.email,
          password: adminData.password,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        this.storeAdminSession(result);
        this.showMessage(
          "Admin authentication successful! Redirecting...",
          "success",
          "fas fa-check-circle"
        );
        setTimeout(() => {
          window.location.href = "/REALM(ADMIN).html";
        }, 1200);
      } else {
        // count failed attempt + show message
        this.logFailedAdminAttempt(adminData.email);
        throw new Error(result.message || result.error || "Admin authentication failed");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      this.showMessage(error.message || "Admin login failed", "error", "fas fa-shield-alt");
    } finally {
      this.setLoading(btn, spinner, false);
    }
  }

  validateLogin(data) {
    let isValid = true;
    if (!this.isValidEmail(data.email)) {
      this.showFieldError("emailError", "Please enter a valid email address");
      isValid = false;
    }
    if (!data.password || data.password.length < 6) {
      this.showFieldError("passwordError", "Password must be at least 6 characters");
      isValid = false;
    }
    return isValid;
  }

  validateSignup(data) {
    let isValid = true;
    if (!data.firstName || data.firstName.length < 2) {
      this.showFieldError("firstNameError", "First name must be at least 2 characters");
      isValid = false;
    }
    if (!data.lastName || data.lastName.length < 2) {
      this.showFieldError("lastNameError", "Last name must be at least 2 characters");
      isValid = false;
    }
    if (!this.isValidEmail(data.email)) {
      this.showFieldError("signupEmailError", "Please enter a valid email address");
      isValid = false;
    }
    if (!this.isValidPassword(data.password)) {
      this.showFieldError("signupPasswordError", "Password must be 8+ characters with letters and numbers");
      isValid = false;
    }
    if (!data.role) {
      this.showFieldError("roleError", "Please select your role");
      isValid = false;
    }
    return isValid;
  }

  validateAdminLogin(data) {
    let isValid = true;
    if (!data.email || !data.email.endsWith("@admin.realm.com")) {
      this.showFieldError("adminEmailError", "Invalid administrator email domain");
      isValid = false;
    }
    if (!data.password || data.password.length < 8) {
      this.showFieldError("adminPasswordError", "Invalid administrator password");
      isValid = false;
    }
    if (!data.accessCode || data.accessCode.length !== 6) {
      this.showFieldError("adminAccessError", "Invalid access code format");
      isValid = false;
    }
    return isValid;
  }

  isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPassword(password) {
    if (!password) return false;
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  }

  showFieldError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = message;
      el.classList.add("show");
    }
  }

  clearErrors() {
    document.querySelectorAll(".error-message").forEach((el) => {
      el.classList.remove("show");
      el.textContent = "";
    });
  }

  setLoading(button, spinner, isLoading) {
    if (!button || !spinner) return;
    if (isLoading) {
      button.classList.add("loading");
      button.disabled = true;
      spinner.style.display = "inline-block";
    } else {
      button.classList.remove("loading");
      button.disabled = false;
      spinner.style.display = "none";
    }
  }

  showMessage(message, type = "info", iconClass = "") {
    const container = document.getElementById("messageContainer");
    const icon = document.getElementById("messageIcon");
    const text = document.getElementById("messageText");
    if (!container || !text) return;
    container.className = `message-container ${type}`;
    if (icon) icon.className = `message-icon ${iconClass}`;
    text.textContent = message;
    container.classList.remove("hidden");
    // auto hide
    setTimeout(() => this.hideMessage(), 4500);
  }

  hideMessage() {
    const container = document.getElementById("messageContainer");
    if (container) container.classList.add("hidden");
  }

  setupValidation() {
    // email blur validation
    ["loginEmail", "signupEmail"].forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("blur", (e) => {
          const errorId = id === "loginEmail" ? "emailError" : "signupEmailError";
          const errorElement = document.getElementById(errorId);
          if (e.target.value && !this.isValidEmail(e.target.value)) {
            this.showFieldError(errorId, "Please enter a valid email address");
          } else if (errorElement) {
            errorElement.classList.remove("show");
            errorElement.textContent = "";
          }
        });
      }
    });

    // signup password strength
    const signupPassword = document.getElementById("signupPassword");
    if (signupPassword) {
      signupPassword.addEventListener("input", (e) => {
        const password = e.target.value;
        const errorElement = document.getElementById("signupPasswordError");
        if (password.length > 0 && !this.isValidPassword(password)) {
          this.showFieldError("signupPasswordError", "Password must be 8+ characters with letters and numbers");
        } else if (password.length >= 8 && errorElement) {
          errorElement.classList.remove("show");
          errorElement.textContent = "";
        }
      });
    }
  }

  checkAdminRateLimit(email) {
    try {
      const attemptsObj = JSON.parse(localStorage.getItem("adminLoginAttempts") || "{}");
      const now = Date.now();
      const attempts = attemptsObj[email] || [];
      const recent = attempts.filter((t) => now - t < 30 * 60 * 1000); // 30 minutes
      if (recent.length >= 3) return false;
      recent.push(now);
      attemptsObj[email] = recent;
      localStorage.setItem("adminLoginAttempts", JSON.stringify(attemptsObj));
      return true;
    } catch (e) {
      // if storage broken, allow attempt but log
      console.warn("Rate limit storage issue", e);
      return true;
    }
  }

  generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  getClientInfo() {
    try {
      return btoa(JSON.stringify({
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
      }));
    } catch (e) {
      return "";
    }
  }

  storeAdminSession(result) {
    try {
      if (result && result.token) {
        localStorage.setItem("adminToken", this.encryptData(result.token));
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("adminLoginTime", Date.now());
        this.setAdminSessionTimeout();
      }
    } catch (e) {
      console.warn("Failed to store admin session", e);
    }
  }

  encryptData(data) {
    try {
      return btoa(data);
    } catch (e) {
      return data;
    }
  }

  setAdminSessionTimeout() {
    const timeout = 30 * 60 * 1000;
    setTimeout(() => this.logoutAdmin(), timeout);
  }

  logoutAdmin() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminLoginTime");
    window.location.href = "/test3.html";
  }

  logFailedAdminAttempt(email) {
    try {
      const obj = JSON.parse(localStorage.getItem("failedAdminAttempts") || "{}");
      obj[email] = obj[email] || [];
      obj[email].push(Date.now());
      localStorage.setItem("failedAdminAttempts", JSON.stringify(obj));
      if (obj[email].length >= 5) console.warn("Multiple failed admin login attempts detected");
    } catch (e) {
      console.warn("Failed to log failed admin attempt", e);
    }
  }

  async handleForgotPassword(e) {
    e.preventDefault();
    const btn = document.getElementById("sendOtpBtn");
    const spinner = document.getElementById("otpSpinner");
    try {
      this.setLoading(btn, spinner, true);
      const email = (document.getElementById("resetEmail")?.value || "").trim();
      if (!this.isValidEmail(email)) {
        this.showFieldError("resetEmailError", "Please enter a valid email address");
        this.setLoading(btn, spinner, false);
        return;
      }
      const response = await fetch(`${this.apiBaseUrl}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json().catch(()=>({}));
      if (response.ok) {
        document.getElementById("emailStep")?.classList.add("hidden");
        document.getElementById("otpStep")?.classList.remove("hidden");
        this.startOtpTimer();
        this.showMessage("OTP sent successfully!", "success", "fas fa-envelope");
      } else {
        this.showMessage(result.message || "Failed to send OTP", "error", "fas fa-exclamation-circle");
      }
    } catch (err) {
      console.error("Forgot password error", err);
      this.showMessage("Connection error. Please try again.", "error", "fas fa-wifi");
    } finally {
      this.setLoading(btn, spinner, false);
    }
  }

  startOtpTimer() {
    const timerDisplay = document.getElementById("otpTimer");
    const resendBtn = document.getElementById("resendOtp");
    if (!timerDisplay || !resendBtn) return;
    let timeLeft = 300;
    resendBtn.disabled = true;
    const timerId = setInterval(() => {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      timerDisplay.textContent = `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
      if (timeLeft <= 0) {
        clearInterval(timerId);
        resendBtn.disabled = false;
        timerDisplay.textContent = "00:00";
      }
      timeLeft--;
    }, 1000);
  }

  async verifyOtp() {
    const btn = document.getElementById("verifyOtpBtn");
    const spinner = document.getElementById("verifySpinner");
    try {
      this.setLoading(btn, spinner, true);
      const otp = (document.getElementById("otpInput")?.value || "").trim();
      const email = (document.getElementById("resetEmail")?.value || "").trim();
      if (!otp || otp.length !== 6) {
        this.showFieldError("otpError", "Please enter a valid 6-digit OTP");
        this.setLoading(btn, spinner, false);
        return;
      }
      const response = await fetch(`${this.apiBaseUrl}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json().catch(()=>({}));
      if (response.ok) {
        document.getElementById("otpStep")?.classList.add("hidden");
        document.getElementById("newPasswordStep")?.classList.remove("hidden");
        this.showMessage("OTP verified successfully!", "success", "fas fa-check-circle");
      } else {
        this.showMessage(result.message || "Invalid OTP", "error", "fas fa-exclamation-circle");
      }
    } catch (err) {
      console.error("Verify OTP error", err);
      this.showMessage("Connection error. Please try again.", "error", "fas fa-wifi");
    } finally {
      this.setLoading(btn, spinner, false);
    }
  }

  async resetPassword() {
    const btn = document.getElementById("resetPasswordBtn");
    const spinner = document.getElementById("resetSpinner");
    try {
      this.setLoading(btn, spinner, true);
      const newPassword = (document.getElementById("newPassword")?.value || "").trim();
      const confirmPassword = (document.getElementById("confirmPassword")?.value || "").trim();
      const email = (document.getElementById("resetEmail")?.value || "").trim();
      if (!this.validateNewPassword(newPassword, confirmPassword)) {
        this.setLoading(btn, spinner, false);
        return;
      }
      const response = await fetch(`${this.apiBaseUrl}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const result = await response.json().catch(()=>({}));
      if (response.ok) {
        this.showMessage("Password reset successful! Please login with your new password.", "success", "fas fa-check-circle");
        setTimeout(() => this.showLogin(), 1800);
      } else {
        this.showMessage(result.message || "Failed to reset password", "error", "fas fa-exclamation-circle");
      }
    } catch (err) {
      console.error("Reset password error", err);
      this.showMessage("Connection error. Please try again.", "error", "fas fa-wifi");
    } finally {
      this.setLoading(btn, spinner, false);
    }
  }

  validateNewPassword(password, confirmPassword) {
    let ok = true;
    if (!this.isValidPassword(password)) {
      this.showFieldError("newPasswordError", "Password must be 8+ characters with letters and numbers");
      ok = false;
    }
    if (password !== confirmPassword) {
      this.showFieldError("confirmPasswordError", "Passwords do not match");
      ok = false;
    }
    return ok;
  }

  async resendOtp() {
    const email = (document.getElementById("resetEmail")?.value || "").trim();
    const resendBtn = document.getElementById("resendOtp");
    try {
      if (!this.isValidEmail(email)) {
        this.showFieldError("resetEmailError", "Please enter your email first");
        return;
      }
      resendBtn.disabled = true;
      const response = await fetch(`${this.apiBaseUrl}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json().catch(()=>({}));
      if (response.ok) {
        this.startOtpTimer();
        this.showMessage("New OTP sent successfully!", "success", "fas fa-envelope");
      } else {
        this.showMessage(result.message || "Failed to resend OTP", "error", "fas fa-exclamation-circle");
        resendBtn.disabled = false;
      }
    } catch (err) {
      console.error("Resend OTP error", err);
      this.showMessage("Connection error. Please try again.", "error", "fas fa-wifi");
      resendBtn.disabled = false;
    }
  }
} // end class

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new RealmAuth();
});

