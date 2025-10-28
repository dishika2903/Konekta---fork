/**
 * signIn.js — Frontend for Two-Step Sign-Up Form with Delayed Entry Animations
 * - Step 1: Basic info (name, DOB, phone, Gmail)
 * - Step 2: Username & password
 * - Simulates 2FA verification + success animation
 * - Entry animation delayed for visibility
 */

(() => {
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const title = document.getElementById("pageTitle");
    const container = document.querySelector("main");
  
    // 🔹 Entry animation with delay (so user can actually see it)
    function animateEntry() {
      container.style.opacity = "0";
      container.style.transform = "scale(0.95)";
      container.style.transition = "all 0.8s ease-out";
  
      // Delay start for better visibility
      setTimeout(() => {
        container.style.opacity = "1";
        container.style.transform = "scale(1)";
      }, 600);
  
      // Title glow animation (starts a bit later)
      setTimeout(() => {
        title.animate(
          [
            { textShadow: "0 0 0px #a200ff" },
            { textShadow: "0 0 20px #a200ff" },
            { textShadow: "0 0 0px #a200ff" },
          ],
          {
            duration: 1200,
            iterations: 2,
            easing: "ease-in-out",
          }
        );
      }, 800);
    }
  
    // Helper: show or hide error under an input
    function showError(input, msg) {
      removeError(input);
      const error = document.createElement("p");
      error.className = "text-pink-400 text-sm mt-1";
      error.textContent = msg;
      input.insertAdjacentElement("afterend", error);
    }
  
    function removeError(input) {
      if (input.nextElementSibling?.classList.contains("text-pink-400")) {
        input.nextElementSibling.remove();
      }
    }
  
    function validateStep1() {
      let valid = true;
      const fields = ["firstName", "lastName", "dob", "phone", "gmail"];
      fields.forEach((id) => {
        const input = document.getElementById(id);
        removeError(input);
        if (!input.value.trim()) {
          showError(input, "This field is required");
          valid = false;
        } else if (id === "phone" && !/^[0-9]{10}$/.test(input.value)) {
          showError(input, "Enter a valid 10-digit number");
          valid = false;
        } else if (id === "gmail" && !/^[\\w.-]+@gmail\\.com$/.test(input.value)) {
          showError(input, "Enter a valid Gmail address");
          valid = false;
        }
      });
      return valid;
    }
  
    function validateStep2() {
      let valid = true;
      const username = document.getElementById("username");
      const password = document.getElementById("password");
      removeError(username);
      removeError(password);
  
      if (username.value.trim().length < 3) {
        showError(username, "Username must be at least 3 characters");
        valid = false;
      }
      if (password.value.length < 6) {
        showError(password, "Password must be at least 6 characters");
        valid = false;
      }
      return valid;
    }
  
    // Step 1 → Step 2
    step1.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateStep1()) return;
  
      const gmail = document.getElementById("gmail").value;
      step1.classList.add("opacity-0", "pointer-events-none");
      title.textContent = "Verifying...";
  
      setTimeout(() => {
        title.textContent = `2FA Sent to ${gmail}`;
        setTimeout(() => {
          step1.classList.add("hidden");
          step2.classList.remove("hidden");
          step2.classList.add("animate-fadeIn");
          title.textContent = "Create Account";
        }, 1000);
      }, 1200);
    });
  
    // Step 2 → Success Screen
    step2.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateStep2()) return;
  
      title.textContent = "Creating Account...";
      step2.classList.add("opacity-50");
      const username = document.getElementById("username").value;
  
      setTimeout(() => {
        container.innerHTML = `
          <div class="flex flex-col items-center justify-center space-y-6 animate-fadeIn">
            <div class="w-16 h-16 flex items-center justify-center bg-green-600 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-green-400 font-poppins">Welcome, ${username}!</h2>
            <p class="text-gray-300 text-sm text-center max-w-xs">
              Your account has been successfully created. You can now log in to continue.
            </p>
            <a href="login.html"
              class="px-4 py-2 bg-gradient-to-r from-[#FF007A] via-[#A200FF] to-[#00F5FF]
                     rounded-full text-white font-semibold hover:brightness-110 transition">
              Go to Login
            </a>
          </div>
        `;
      }, 1300);
    });
  
    // Run animations after DOM load
    document.addEventListener("DOMContentLoaded", () => {
      animateEntry();
      // Small bounce for title (subtle polish)
      title.animate(
        [{ transform: "translateY(-6px)" }, { transform: "translateY(0)" }],
        { duration: 600, easing: "ease-out", delay: 500 }
      );
    });
  })();
  