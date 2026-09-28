// A new value on every build. Appended to CSS/JS/icon URLs in base.njk so
// browsers and Cloudflare fetch fresh files after each deploy instead of
// pairing new HTML with a cached old stylesheet.
module.exports = { version: Date.now().toString(36) };
