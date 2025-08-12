<template>
  <div class="login-wrapper">
    <div class="image-side">
      <router-link to="/" class="logo-area">
        <img src="@/assets/logo-02.png" alt="Logo" />
        <span class="logo-text">CNP ONE</span>
      </router-link>

      <div class="welcome-box">
        <h1>Hello, Friend!</h1>
        <p>Enter your personal details<br />and start journey with us</p>
        <router-link to="/signup" class="btn-signup">SIGN UP</router-link>
      </div>
    </div>

    <div class="login-container">
      <div class="login-form">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin" novalidate>
          <!-- فیلد ایمیل -->
          <div class="form-group">
            <label for="email">Your email address</label>
            <input
              type="text"
              id="email"
              v-model="email"
              autocomplete="email"
              required
            />
          </div>

          <!-- فیلد رمز عبور با آیکون داخل input -->
          <div class="form-group">
            <label for="password">Enter password</label>
            <div class="input-with-icon">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                autocomplete="current-password"
                required
              />
              <span
                class="material-icons eye-icon"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "visibility_off" : "visibility" }}
              </span>
            </div>
          </div>

          <!-- گزینه Forgot password جداگانه -->
          <div class="login-options">
            <a href="/forgot-password" class="forgot-password"
              >Forgot password?</a
            >
          </div>

          <p v-if="loginError" class="error-message">
            The email or password is incorrect.
          </p>

          <!-- دکمه لاگین -->
          <button type="submit">Login</button>

          <!-- Divider گوگل -->
          <div class="divider-with-text">
            <span>or</span>
          </div>

          <!-- دکمه ورود با گوگل -->
          <button type="button" class="btn-google" @click="handleGoogleLogin">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              class="google-icon"
            />
            <span>Continue with Google</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../utils/auth";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      loginError: false,
    };
  },
  watch: {
    email() {
      if (this.loginError) this.loginError = false;
    },
    password() {
      if (this.loginError) this.loginError = false;
    },
  },
  methods: {
    async handleLogin() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = emailPattern.test(this.email);
      if (!isEmailValid) {
        this.loginError = true;
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          auth.isLoggedIn = true;
          this.$router.push("/dashboard");
        } else {
          this.loginError = true;
        }
      } catch (err) {
        console.error("Server error:", err);
        this.loginError = true;
      }
    },
    handleGoogleLogin() {
      window.location.href = "http://localhost:3000/api/auth/google";
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.image-side {
  width: 40%;
  height: 100%;
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

.logo-top {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 36px;
  display: block;
  cursor: pointer;
}

.logo-top img {
  width: 100%;
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
  color: #ffffff;
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
  font-family: "Inter", sans-serif;
  font-size: 63px;
  font-weight: 500;
  white-space: nowrap; /* از شکستن خط جلوگیری می‌کنه */
  margin-bottom: 15px;
}

.welcome-box p {
  font-family: "Inter", sans-serif;
  font-size: 30px;
  line-height: 1.5;
  font-weight: 200;
  margin-bottom: 35px;
}

.btn-signup {
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

.btn-signup:hover {
  background-color: #ffffff;
  color: #337efe;
}

.login-container {
  width: 60%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.login-form {
  width: 100%;
  max-width: 500px;
  background-color: #fff;
  padding: 50px;
  border-radius: 12px;
}

h2 {
  text-align: left;
  font-size: 35px;
  color: #333;
}

.form-group {
  margin-bottom: 25px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  padding-bottom: 3px;
  color: #333;
  font-size: 14px;
  /*font-weight: bold;*/
}

input {
  width: 100%;
  padding: 16px;
  border: 1px solid #b9c1d6;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

/* اختیاری برای افکت زیبا */
input:focus {
  outline: none;
  /*border-color: #869dff;*/
  box-shadow: 0 0 0 1px #333; /* نازک‌تر از قبل */
}

/* مخصوص input رمز عبور با آیکون چشم */
.input-with-icon {
  position: relative;
}

.input-with-icon input {
  width: 100%;
  padding: 16px;
  /*padding-right: 5px;*/ /* فضای کافی برای آیکون */
  border: 1px solid #b9c1d6;
}

input,
button,
.input-with-icon input {
  height: 14px;
  font-size: 15px;
  box-sizing: border-box;
}

.password-wrapper {
  position: relative;
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

button {
  width: 100%;
  padding: 10px;
  background-color: #337efe;
  border: none;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #3077ef;
}

.error-message {
  color: red;
  margin-top: 5px;
  font-size: 13px;
  text-align: left;
}

.show-password {
  margin-top: 8px;
  font-size: 13px;
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  color: #333;
  white-space: nowrap;
}

.show-password input[type="checkbox"] {
  vertical-align: middle;
  transform: translateX(-4px) translateY(-3px);
}

.divider {
  margin: 40px 0;
  border-top: 1px solid #ddd;
}

.btn-google {
  width: 100%;
  display: flex;
  background-color: #333;
  border: none;
  color: #ffffff;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-google:hover {
  background-color: #111111;
}

.google-icon {
  display: inline-block;
  background: none;
  border-radius: 0;
  width: 20px;
  height: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* برای یکسان شدن دکمه‌ها هم با input */
button,
.btn-google {
  height: 48px;
  font-size: 15px;
  padding: 0 16px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: right;
  margin: 20px 0 25px;
}

.forgot-password {
  font-size: 14px;
  color: #007aff;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-password:hover {
  text-decoration: underline;
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
.signup-link {
  margin-top: 30px;
  font-size: 14px;
  color: #2b3674;
  text-align: center;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
}

.signup-link a:hover {
  text-decoration: underline;
}

input,
button,
.input-with-icon input,
.btn-google {
  height: 48px;
  font-size: 15px;
  border-radius: 8px;
  box-sizing: border-box;
}
</style>
