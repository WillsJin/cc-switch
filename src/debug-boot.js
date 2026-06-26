(function () {
  var logs = [];
  var panel = null;

  function stringify(value) {
    try {
      if (value && value.stack) return value.stack;
      if (typeof value === "object") return JSON.stringify(value, null, 2);
      return String(value);
    } catch (_) {
      return String(value);
    }
  }

  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement("pre");
    panel.id = "cc-switch-boot-errors";
    panel.style.cssText = [
      "position:fixed",
      "z-index:2147483647",
      "top:12px",
      "right:12px",
      "left:12px",
      "max-height:70vh",
      "overflow:auto",
      "padding:12px",
      "margin:0",
      "background:#2b1111",
      "color:#ffd7d7",
      "border:1px solid #ff6b6b",
      "border-radius:6px",
      "font:12px/1.45 Menlo,Consolas,monospace",
      "white-space:pre-wrap",
      "box-shadow:0 8px 24px rgba(0,0,0,.35)",
    ].join(";");
    panel.textContent = "";
    if (document.body) {
      document.body.appendChild(panel);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        document.body.appendChild(panel);
      });
    }
    return panel;
  }

  function render() {
    ensurePanel().textContent =
      "CC Switch renderer error log\n" +
      "Safari/WebKit: " +
      navigator.userAgent +
      "\n\n" +
      logs.join("\n\n");
  }

  function record(title, detail) {
    logs.push("[" + new Date().toISOString() + "] " + title + "\n" + detail);
    window.__CC_SWITCH_BOOT_LOGS__ = logs.slice();
    render();
  }

  var originalError = console.error;
  console.error = function () {
    var parts = [];
    for (var i = 0; i < arguments.length; i += 1) {
      parts.push(stringify(arguments[i]));
    }
    record("console.error", parts.join(" "));
    return originalError.apply(console, arguments);
  };

  window.addEventListener("error", function (event) {
    var detail = [
      event.message || "Unknown error",
      event.filename ? "at " + event.filename + ":" + event.lineno + ":" + event.colno : "",
      event.error ? stringify(event.error) : "",
    ]
      .filter(Boolean)
      .join("\n");
    record("window.error", detail);
  });

  window.addEventListener("unhandledrejection", function (event) {
    record("unhandledrejection", stringify(event.reason || "Unknown rejection"));
  });
})();
