const express = require("express"); //برای ساخت یک router جدا از اپ اصلی
const router = express.Router();
const auth = require("../middleware/authMiddleware"); //برای بررسی توکن JWT
const memcached = require("../cache/memcachedClient"); //برای logout کلاینت برای مدیریت کش

//ایمپورت توابع کنترلر
const {
  signup,
  login,
  changePassword,
} = require("../controllers/authController");

//تعریف مسیرها
router.post("/signup", signup);
router.post("/login", login);
router.post("/change-password", auth, changePassword);

// مسیرهای محافظت‌شده با middleware auth
router.get("/profile", auth, (req, res) => {
  res.send(`profile: Welcome ${req.user.email} ${req.user.id}`);
});
router.get("/setting", auth, (req, res) => {
  res.send(`setting: Welcome user ${req.user.id}`);
});
router.get("/home", auth, (req, res) => {
  res.send(`home: Welcome user ${req.user.id}`);
});

// اطلاعات کاربر لاگین‌شده را برمی‌گرداند
router.get("/me", auth, (req, res) => {
  // فرض بر این است که middleware احراز هویت، req.user را ست می‌کند
  res.json({
    email: req.user.email,
    id: req.user.id,
  });
});

// مسیر logout با حذف توکن از memcached و پاک‌کردن کوکی
router.post("/logout", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    memcached.del(token, (err) => {
      if (err) {
        console.error("Memcached error during logout:", err);
        return res.status(500).json({ error: "Server error during logout" });
      }
      res.clearCookie("token");
      res.status(200).json({ message: "Logged out" });
    });
  } else {
    res.status(400).json({ error: "No token found" });
  }
});

// بررسی وضعیت سشن/توکن برای فرانت
router.get("/check-session", auth, (req, res) => {
  res.status(200).json({ message: "Session valid", user: req.user });
});
module.exports = router;
