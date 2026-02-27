import { loadingHTML } from "./template.js";
import { alertContent } from "./objects.js";

// Inject fallback HTML into elements if they are empty
export function checkAndInjectLoader(className, fallback) {
  const mainDivs = document.querySelectorAll(className);
  mainDivs.forEach((div) => {
    if (!div.hasChildNodes() || div.innerHTML.trim() === "") {
      div.innerHTML = fallback;
    }
  });
}

// Escape HTML to prevent XSS attacks
export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function stripHtml(html) {
  let div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// Global function to listen and execute functions
export function listenAndExecute(trigger, functionToExecute, eventToListen) {
  let t = document.querySelector(trigger);
  if (t) {
    t.addEventListener(eventToListen, functionToExecute);
  }
}

export function alertTrigger(content) {
  const toastElement = `<div aria-live="polite" aria-atomic="true" class="position-fixed user-select-none toast-in" style="bottom: 10px; right: 10px;">
    <div class="toast align-items-center text-bg-${content.class} fade show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body message">
                ${content.messageHTML}
            </div>
            <button type="button" class="btn-close btn-close-white me-3 m-auto" data-bs-dismiss="toast"
                aria-label="Close"></button>
        </div>
    </div>
</div>`;

  try {
    const printElement = document.getElementById("alertContent");
    if (!printElement) return;
    printElement.innerHTML = toastElement;

    setTimeout(() => {
      // It's better to hide and then remove, to allow for CSS transitions
      const toastContainer = printElement.querySelector('.toast-in');
      if (toastContainer) {
        toastContainer.classList.remove("toast-in");
        toastContainer.classList.add("toast-out"); // Assuming you have a toast-out animation
        // Remove after animation
        setTimeout(() => {
            printElement.innerHTML = "";
        }, 500);
      } else {
        printElement.innerHTML = "";
      }
    }, content.timeOut * 1000 - 500);
  } catch (error) {
    console.error(error);
  }
}