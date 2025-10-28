/**
 * login.js — Konekta Login (Final Fixed Version)
 * Fixes double fade issue
 * - Smooth single fade + scale entry
 * - Neon glow pulse on title
 * - Password strength meter, toggle, remember me
 * - Themed success screen + redirect
 */

(() => {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorText = document.getElementById("errorText");
    const title = document.getElementById("pageTitle");
    const container = document.querySelector("main");
  
    // 🔹 Entry animation (single fade + scale + glow)
    function animateEntry() {
      // Only use JS for fade-in (no CSS overlap)
      container.style.opacity = "0";
      container.style.transform = "scale(0.95)";
      container.style.transition = "all 0.8s ease-out";
  
      // Fade in after small delay
      setTimeout(() => {
        container.style.opacity = "1";
        container.style.transform = "scale(1)";
      }, 500);
  
      // Neon glow pulse on title (after entry)
      setTimeout(() => {
        title.animate(
          [
            { textShadow: "0 0 0px #a200ff" },
            { textShadow: "0 0 25px #a200ff" },
            { textShadow: "0 0 0px #a200ff" },
          ],
          {
            duration: 1200,
            iterations: 2,
            easing: "ease-in-out",
          }
        );
      }, 900);
    }
  
    // 🔹 Create extra UI elements
    function createExtras() {
      // Show/Hide password
      const pwToggle = document.createElement("button");
      pwToggle.type = "button";
      pwToggle.className = "mt-2 text-sm text-gray-400 hover:text-pink-400";
      pwToggle.innerText = "Show password";
      passwordInput.parentNode.appendChild(pwToggle);
  
      pwToggle.addEventListener("click", () => {
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          pwToggle.innerText = "Hide password";
        } else {
          passwordInput.type = "password";
          pwToggle.innerText = "Show password";
        }
        passwordInput.focus();
      });
  
      // Password strength meter
      const meterWrap = document.createElement("div");
      meterWrap.className = "mt-3";
      meterWrap.innerHTML = `
        <div id="pwMeter" class="h-2 rounded-full bg-gray-700 overflow-hidden" aria-hidden="true">
          <div id="pwMeterFill" style="width:0%" class="h-full transition-all duration-300"></div>
        </div>
        <div id="pwStrengthText" class="text-xs mt-1 text-gray-400">Password strength: —</div>
      `;
      passwordInput.parentNode.appendChild(meterWrap);
  
      // Remember me
      const rememberWrap = document.createElement("div");
      rememberWrap.className = "flex items-center gap-2 mt-3";
      rememberWrap.innerHTML = `
        <input id="rememberMe" type="checkbox" class="w-4 h-4 rounded text-pink-400" />
        <label for="rememberMe" class="text-sm text-gray-400 select-none">Remember my email</label>
      `;
      form.insertBefore(
        rememberWrap,
        form.querySelector("button[type='submit']").parentNode
      );
    }
  
    // 🔹 Password strength logic
    function scorePassword(pw) {
      let score = 0;
      if (pw.length >= 8) score++;
      if (/[A-Z]/.test(pw)) score++;
      if (/[0-9]/.test(pw)) score++;
      if (/[^A-Za-z0-9]/.test(pw)) score++;
      return score;
    }
  
    function updatePasswordMeter() {
      const pw = passwordInput.value;
      const score = scorePassword(pw);
      const fill = document.getElementById("pwMeterFill");
      const text = document.getElementById("pwStrengthText");
      const pct = (score / 4) * 100;
      const labels = ["Very weak", "Weak", "Okay", "Strong", "Very strong"];
      const colors = [
        "#FF007A",
        "#E900B5",
        "#A200FF",
        "#00F5FF",
        "#00FFC8",
      ];
  
      if (fill) {
        fill.style.width = pct + "%";
        fill.style.background = `linear-gradient(90deg, ${colors
          .slice(0, score + 1)
          .join(", ")})`;
      }
      if (text) {
        text.textContent =
          "Password strength: " + (pw.length ? labels[score] : "—");
      }
    }
  
    // 🔹 Error handling
    function showError(msg) {
      errorText.textContent = msg;
      errorText.classList.remove("hidden");
    }
    function hideError() {
      errorText.textContent = "";
      if (!errorText.classList.contains("hidden"))
        errorText.classList.add("hidden");
    }
  
    // 🔹 Remember email
    function restoreRememberedEmail() {
      const saved = localStorage.getItem("konekta_saved_email");
      if (saved) {
        emailInput.value = saved;
        const cb = document.getElementById("rememberMe");
        if (cb) cb.checked = true;
      }
    }
  
    // 🔹 Themed success screen
    function showSuccessScreen(email) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center space-y-6 animate-fadeIn text-center">
          <div class="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF007A] via-[#A200FF] to-[#00F5FF] shadow-lg shadow-[#A200FF]/40">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-[#FF007A] via-[#A200FF] to-[#00F5FF] bg-clip-text text-transparent">Welcome, ${email.split("@")[0]}!</h2>
          <p class="text-gray-400 text-sm max-w-xs">You’ve successfully logged in. Redirecting to your dashboard...</p>
        </div>
      `;
      setTimeout(() => {
        window.location.href = "landing.html";
      }, 2500);
    }
  
    // 🔹 Handle login logic
    function handleLogin() {
      if (!form) return;
      createExtras();
      restoreRememberedEmail();
  
      const rememberBox = document.getElementById("rememberMe");
      passwordInput.addEventListener("input", updatePasswordMeter);
  
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideError();
  
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
  
        if (!email || !password) {
          showError("Please fill in both email and password.");
          return;
        }
  
        if (rememberBox && rememberBox.checked) {
          localStorage.setItem("konekta_saved_email", email);
        } else {
          localStorage.removeItem("konekta_saved_email");
        }
  
        const submitBtn = form.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Logging in...";
  
        await new Promise((res) => setTimeout(res, 1200));
  
        const FAKE_USER = { email: "student@college.edu", password: "password123" };
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
          container.style.transition = "opacity 0.6s ease";
          container.style.opacity = "0";
          setTimeout(() => {
            container.style.opacity = "1";
            showSuccessScreen(email);
          }, 600);
        } else {
          showError(
            "Invalid credentials. Try: student@college.edu / password123"
          );
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    }
  
    // 🔹 Init
    document.addEventListener("DOMContentLoaded", () => {
      animateEntry();
      handleLogin();
    });
  })();
  