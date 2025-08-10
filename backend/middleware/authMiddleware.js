const jwt = require("jsonwebtoken");
const memcached = require("../cache/memcachedClient");
const SECRET = process.env.JWT_SECRET || "secret_key";

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token" });
  }

  // ابتدا اعتبار JWT را بررسی کن
  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;

    // سپس بررسی کن که آیا این توکن هنوز در Memcached هست یا نه
    memcached.get(token, (err, data) => {
      if (err || !data) {
        return res.status(401).json({ message: "Session expired or not found in cache" });
      }

      next(); // همه‌چی اوکی بود → برو به مرحله بعد
    });
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
