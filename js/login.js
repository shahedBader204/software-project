// Helper: safe addEventListener
function on(id, event, handler){
  const el = document.getElementById(id);
  if(el) el.addEventListener(event, handler);
}

// Hint
const hint = document.getElementById("hint");
function showHint(msg){
  if(!hint) return;
  hint.textContent = msg;
  hint.classList.add("show");
  setTimeout(() => hint.classList.remove("show"), 2500);
}

// Password show/hide (safe)
const pwd = document.getElementById("password");
const toggle = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

if (pwd && toggle && eyeIcon) {
  toggle.addEventListener("click", () => {
    const isHidden = pwd.type === "password";
    pwd.type = isHidden ? "text" : "password";
    eyeIcon.className = isHidden ? "bi bi-eye-slash" : "bi bi-eye";
  });
}

// Buttons (safe)
on("googleBtn", "click", () => showHint("Google sign-in (demo) — connect your auth here."));
on("appleBtn", "click", () => showHint("Apple sign-in (demo) — connect your auth here."));

on("forgot", "click", (e) => {
  e.preventDefault();
  showHint("Forgot password (demo).");
});

on("signup", "click", (e) => {
  e.preventDefault();
  window.location.href = "signup.html";
});

// Login submit
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailEl = document.getElementById("email");
    const email = emailEl ? emailEl.value.trim() : "";
    const password = pwd ? pwd.value : "";

    if(!email || !password){
      showHint("Please enter email and password.");
      return;
    }

    // ✅ redirect
    window.location.href = "index.html";
  });
}
