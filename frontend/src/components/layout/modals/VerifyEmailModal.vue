<template>
  <!-- مودال را به body تلپورت می‌کنیم تا مشکل z-index/اسکرول نداشته باشیم -->
  <teleport to="body">
    <div v-if="modelValue" class="verify-popup-overlay" @click.self="close">
      <div
        class="verify-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-title"
      >
        <h3 id="verify-title">{{ title }}</h3>

        <!-- متن -->
        <p>{{ message }}</p>

        <!-- ورودی کد -->
        <input
          ref="codeInput"
          v-model.trim="code"
          :type="numericOnly ? 'tel' : 'text'"
          :inputmode="numericOnly ? 'numeric' : 'text'"
          :maxlength="codeLength"
          :placeholder="
            placeholder ||
            (numericOnly
              ? `Enter ${codeLength}-digit code`
              : 'Enter verification code')
          "
          class="verify-input"
          @input="onFilterNumeric"
          @keyup.enter="onSubmit"
        />

        <!-- دکمه ارسال -->
        <button :disabled="!isValid || loading" @click="onSubmit">
          {{ loading ? "Submitting…" : submitText }}
        </button>

        <!-- لینک ارسال مجدد -->
        <button
          class="link-like"
          :disabled="resendDisabled"
          @click="onResend"
          title="Resend code"
        >
          Resend code<span v-if="resendDisabled"> ({{ cooldownLeft }}s)</span>
        </button>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: "VerifyEmailModal",
  props: {
    modelValue: { type: Boolean, default: false } /* v-model پشتیبانی */,
    email: { type: String, default: "" } /* برای نمایش در متن */,
    codeLength: { type: Number, default: 6 }, // طول کد
    numericOnly: { type: Boolean, default: true }, // فقط عدد

    /* تغییر متن‌ها بر اساس سناریو (signup/login/2FA و…) */
    title: { type: String, default: "Verify your email" },
    message: {
      type: String,
      default: "Please check your inbox and enter the 6‑digit code.",
    },
    placeholder: { type: String, default: "Enter verification code" },
    submitText: { type: String, default: "Submit" },

    /* وضعیت لودینگ از والد کنترل می‌شود */
    loading: { type: Boolean, default: false },

    /* مدیریت ارسال مجدد کد */
    resendCooldown: { type: Number, default: 120 }, // ثانیه
  },
  data() {
    return {
      code: "",
      cooldownLeft: 0,
      timer: null,
    };
  },
  computed: {
    resendDisabled() {
      return this.cooldownLeft > 0 || this.loading;
    },
    isValid() {
      if (this.numericOnly)
        return /^\d+$/.test(this.code) && this.code.length === this.codeLength;
      return this.code.length >= 1;
    },
  },
  watch: {
    modelValue(v) {
      if (v) {
        // فوکوس خودکار روی ورودی
        this.$nextTick(() => this.$refs.codeInput?.focus());
        // هر بار نمایش، شمارندهٔ ارسال مجدد را ریست کن
        this.startCooldown();
      } else {
        this.clearCooldown();
        this.code = "";
      }
    },
  },
  mounted() {
    // بستن با Escape
    this._esc = (e) => {
      if (e.key === "Escape" && this.modelValue) this.close();
    };
    window.addEventListener("keydown", this._esc);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this._esc);
    this.clearCooldown();
  },
  methods: {
    onSubmit() {
      if (!this.code) return;
      console.log("[VerifyEmailModal] submit code:", this.code); // debug
      this.$emit("submit", this.code);
    },
    onResend() {
      if (this.resendDisabled) return;
      console.log("[VerifyEmailModal] resend requested for:", this.email); // debug
      this.$emit("resend");
      this.startCooldown();
    },
    close() {
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },
    startCooldown() {
      this.clearCooldown();
      this.cooldownLeft = this.resendCooldown;
      this.timer = setInterval(() => {
        this.cooldownLeft--;
        if (this.cooldownLeft <= 0) this.clearCooldown();
      }, 1000);
    },
    clearCooldown() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.cooldownLeft = 0;
    },
    onFilterNumeric(e) {
      if (!this.numericOnly) return;
      const digits = (e.target.value || "").replace(/\D/g, "");
      if (digits !== this.code) this.code = digits.slice(0, this.codeLength);
    },
  },
};
</script>

<style scoped>
.verify-popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.verify-popup {
  background: #ffffff;
  padding: 30px;
  padding-bottom: 40px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.verify-popup h3 {
  margin-bottom: 10px;
  font-size: 20px;
  color: #337efe;
}
.verify-popup p {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}
.verify-input {
  width: 100%;
  height: 40px;
  margin: 5px 0;
  padding: 0 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}
button {
  background-color: #337efe;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.link-like {
  background: transparent;
  color: #337efe;
  margin-top: 10px;
  display: inline-block;
}
</style>
