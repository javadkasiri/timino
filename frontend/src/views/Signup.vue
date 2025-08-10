<template>
  <div class="signup-wrapper">
    <!-- سمت چپ: فرم ثبت‌نام -->
    <div class="form-side">
      <!-- لوگو -->
      <router-link to="/" class="logo-area">
        <img src="@/assets/logo-01.png" alt="Logo" />
        <span class="logo-text">CNP ONE</span>
      </router-link>

      <!-- فرم ثبت‌نام -->
      <div class="signup-form">
        <h2>Signup</h2>
        <form @submit.prevent="handleSignup" novalidate>
          <!-- ایمیل -->
          <div class="form-group">
            <label for="email">Your email address</label>
            <input type="text" id="email" v-model="email" required />
            <p v-if="emailError" class="error-message">
              The email format is incorrect.
            </p>
            <p v-if="duplicateError" class="error-message">
              This email is already in use.
            </p>
          </div>

          <!-- رمز عبور -->
          <div class="form-group">
            <label for="password">Enter password</label>
            <div class="input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
              />
              <span
                class="material-icons eye-icon"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "visibility_off" : "visibility" }}
              </span>
            </div>
            <p v-if="passwordError" class="error-message">
              The password must meet all the listed requirements.
            </p>
          </div>

          <!-- تکرار رمز -->
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                required
              />
              <span
                class="material-icons eye-icon"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? "visibility_off" : "visibility" }}
              </span>
            </div>
            <p v-if="confirmError" class="error-message">
              Passwords do not match.
            </p>
          </div>

          <!-- شرایط رمز عبور -->
          <ul class="password-rules">
            <li :class="{ valid: passwordRules.minLength }">
              At least 8 characters
            </li>
            <li :class="{ valid: passwordRules.uppercase }">
              At least one uppercase letter
            </li>
            <li :class="{ valid: passwordRules.lowercase }">
              At least one lowercase letter
            </li>
            <li :class="{ valid: passwordRules.number }">
              At least one number
            </li>
          </ul>

          <!-- دکمه ثبت -->
          <button type="submit">Register</button>

          <!-- یا با گوگل -->
          <div class="divider-with-text"><span>or</span></div>
          <button type="button" class="google-button">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
            />
            Sign up with Google
          </button>

          <!-- پیام موفقیت -->
          <!--  <p v-if="s/uccessMessage" class="success-message">
            Registration was successful
          </p> -->
        </form>
      </div>
    </div>

    <!-- سمت راست: خوش‌آمدگویی -->
    <div class="image-side">
      <div class="welcome-box">
        <h1>Welcome Back!</h1>
        <p>
          To keep connected with us<br />
          please log in with your personal info
        </p>
        <router-link to="/login" class="btn-login">LOG IN</router-link>
      </div>
    </div>

    <!-- ✅ پاپ‌آپ تأیید ایمیل -->
    <div v-if="showVerifyPopup" class="verify-popup-overlay">
      <div class="verify-popup">
        <h3>Verify your email</h3>
        <p>
          We've sent a verification link to your email. Please check your inbox
          and enter the code below:
        </p>

        <!-- ✅ ورودی کد تأیید -->
        <input
          v-model="verificationCode"
          type="text"
          placeholder="Enter verification code"
          class="verify-input"
        />

        <!-- ✅ دکمه تأیید -->
        <button @click="submitVerificationCode">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignupPage",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      emailError: false,
      passwordError: false,
      confirmError: false,
      duplicateError: false,
      successMessage: false,
      showVerifyPopup: false,
      verificationCode: "", // 🔸 کد تأیید ایمیل
      submitted: false,
    };
  },
  computed: {
    passwordRules() {
      return {
        minLength: this.password.length >= 8,
        uppercase: /[A-Z]/.test(this.password),
        lowercase: /[a-z]/.test(this.password),
        number: /[0-9]/.test(this.password),
      };
    },
    isPasswordValid() {
      const r = this.passwordRules;
      return r.minLength && r.uppercase && r.lowercase && r.number;
    },
  },
  watch: {
    email(value) {
      if (this.submitted) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.emailError = !emailPattern.test(value);
      }
    },
    password() {
      if (this.submitted && this.isPasswordValid) {
        this.passwordError = false;
      }
    },
    confirmPassword() {
      if (this.submitted && this.confirmPassword === this.password) {
        this.confirmError = false;
      }
    },
  },
  methods: {
    async handleSignup() {
      this.submitted = true;

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = !emailPattern.test(this.email);
      this.passwordError = !this.isPasswordValid;
      this.confirmError = this.password !== this.confirmPassword;
      this.duplicateError = false;

      if (this.emailError || this.passwordError || this.confirmError) return;

      try {
        const res = await fetch("http://localhost:3000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (res.status === 409) {
          this.duplicateError = true;
          return;
        }

        const data = await res.json();

        if (res.ok) {
          console.log("✅ Signup successful. Showing popup...");
          this.successMessage = true;
          this.showVerifyPopup = true;
        } else {
          console.error("Signup failed:", data.error || "Unknown error");
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    },

    async submitVerificationCode() {
      if (!this.verificationCode.trim()) {
        alert("Please enter the verification code.");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            code: this.verificationCode,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("✅ Email verified successfully.");
          this.showVerifyPopup = false;
          this.$router.push("/login");
        } else {
          alert(data.error || "Verification failed.");
        }
      } catch (err) {
        console.error("Verification request failed:", err);
        alert("Server error during verification.");
      }
    },

    closePopup() {
      this.showVerifyPopup = false;
    },
  },
};
</script>

<style scoped>
.signup-wrapper {
  display: flex;
  min-height: 100vh;
}

.image-side {
  width: 40%;
  height: 100vh;
  background-color: #2d53da;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: white;
  text-align: center;
  position: relative;
}

.logo-area {
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 10px;
  cursor: pointer;
}

.logo-area img {
  width: 36px;
  height: auto;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #0e3168;
  letter-spacing: 1px;
}

.welcome-box {
  max-width: 90%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-box h1 {
  font-size: 63px;
  font-weight: 500;
  white-space: nowrap;
  margin-bottom: 15px;
}

.welcome-box p {
  font-size: 30px;
  line-height: 1.5;
  font-weight: 200;
  margin-bottom: 35px;
}

.btn-login {
  display: inline-block;
  margin-top: 15px;
  padding: 20px 75px;
  color: white;
  border: 1px solid white;
  border-radius: 50px;
  font-weight: 300;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-login:hover {
  background-color: white;
  color: #2d53da;
}

.form-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  position: relative;
}

.signup-form {
  width: 100%;
  max-width: 500px;
  padding: 50px;
  background: #fff;
  border-radius: 8px;
}

h2 {
  text-align: left;
  font-size: 35px;
  color: #2b3674;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #2b3674;
  font-size: 14px;
}

input {
  width: 100%;
  height: 48px;
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  padding-right: 44px;
}

input:focus {
  outline: none;
  /*border-color: #869dff;*/
  box-shadow: 0 0 0 1px #333; /* نازک‌تر از قبل */
}

.eye-icon {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #a3aed0;
  font-size: 22px;
}

.eye-icon:hover {
  color: #0e3168;
}

.password-rules {
  display: flex;
  flex-wrap: wrap;
  gap: 3px 20px;
  padding-left: 0;
  margin-top: -5px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #a3aed0;
  text-align: left;
}

.password-rules li {
  flex: 0 0 48%; /* حدوداً نصف عرض - برای دو ستون */
  list-style: none;
  margin: 4px 0;
}

.password-rules li.valid {
  font-weight: bold;
  color: #0e3168;
}

button[type="submit"],
.google-button {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: bold;
  padding: 0 16px;
  border-radius: 8px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #2d53da;
  color: white;
  border: none;
}

button[type="submit"]:hover {
  background-color: #2544b3;
}

.divider-with-text {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 25px 0;
  color: #999;
  font-size: 14px;
  font-weight: 500;
}

.divider-with-text::before,
.divider-with-text::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ccc;
}

.divider-with-text::before {
  margin-right: 12px;
}

.divider-with-text::after {
  margin-left: 12px;
}

.google-button {
  display: flex;
  background-color: #333;
  border: none;
  border-radius: 8px;
  color: white;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
}

.google-button:hover {
  background-color: #111;
}

.google-button img {
  width: 18px;
  height: 18px;
}

.error-message {
  color: red;
  font-size: 13px;
  margin-top: 5px;
}

.success-message {
  color: #2d53da;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}

.verify-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.verify-popup {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.verify-popup h3 {
  margin-bottom: 10px;
  font-size: 20px;
  color: #2d53da;
}

.verify-popup p {
  font-size: 14px;
  color: #333;
  margin-bottom: 20px;
}

.verify-popup button {
  background-color: #2d53da;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.verify-popup button:hover {
  background-color: #2544b3;
}

.verify-input {
  width: 100%;
  height: 40px;
  margin: 15px 0;
  padding: 0 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}
</style>
