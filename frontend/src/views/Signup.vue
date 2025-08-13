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

    <!-- مودال قابل استفاده مجدد -->
    <VerifyEmailModal
      v-model="showVerifyPopup"
      :email="email"
      :loading="verifying"
      title="Verify your email"
      message="Please check your inbox and enter the 6‑digit code."
      :code-length="6"
      :numeric-only="true"
      placeholder="6-digit code"
      submit-text="Submit"
      :resend-cooldown="120"
      @submit="onVerifySubmit"
      @resend="onVerifyResend"
      @close="onVerifyClose"
    />
  </div>
</template>

<script>
import VerifyEmailModal from "@/components/layout/modals/VerifyEmailModal.vue";

export default {
  name: "SignupPage",
  components: { VerifyEmailModal },
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
      submitted: false,
      showVerifyPopup: false,
      verifying: false,
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
          console.log("Signup success. Open verify modal");
          this.showVerifyPopup = true;
        } else {
          console.error("Signup failed:", data.error || "Unknown error");
        }
      } catch (e) {
        console.error("Network error:", e);
      }
    },

    async onVerifySubmit(code) {
      // وقتی کاربر داخل مودال Submit زد
      if (!code) return;
      this.verifying = true;
      try {
        console.log("[Signup] verifying code for", this.email, "code:", code); // debug
        const res = await fetch("http://localhost:3000/api/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, code }),
        });
        const data = await res.json();
        if (res.ok) {
          alert("Email verified successfully.");
          this.showVerifyPopup = false;
          this.$router.push("/Dashboard");
        } else {
          alert(data.error || "Verification failed.");
        }
      } catch (err) {
        console.error("Verification request failed:", err);
        alert("Server error during verification.");
      } finally {
        this.verifying = false;
      }
    },

    async onVerifyResend() {
      // ارسال مجدد کد
      try {
        console.log("[Signup] resend code to", this.email); // debug
        await fetch("http://localhost:3000/api/resend-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email }),
        });
        // پیام دلخواه…
      } catch (e) {
        console.error("Resend failed:", e);
      }
    },

    onVerifyClose() {
      console.log("[Signup] verify modal closed"); // debug
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
  background-color: #337efe;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: #ffffff;
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
  color: #337efe;
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
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 50px;
  font-weight: 300;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-login:hover {
  background-color: #ffffff;
  color: #337efe;
}

.form-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
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
  color: #333;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #333;
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
  background-color: #337efe;
  color: #ffffff;
  border: none;
}

button[type="submit"]:hover {
  background-color: #3077ef;
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
  color: #ffffff;
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
</style>
