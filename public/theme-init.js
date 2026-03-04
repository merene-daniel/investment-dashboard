// Anti-flash theme initialiser — loaded before React hydrates.
// Reads the persisted theme from localStorage and applies it to <html>
// so the page never flashes the wrong theme on load.
try {
  var t = localStorage.getItem('armor-theme')
  if (t === 'light' || t === 'dark') {
    document.documentElement.setAttribute('data-theme', t)
  }
} catch (_) {}
