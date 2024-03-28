/** start here */
window.addEventListener("DOMContentLoaded", async (event) => {
  if ("BeforeInstallPromptEvent" in window) {
    showResult("⚡️ PWA check", true);
  } else {
    showResult("❌ This browser is NOT supported");
  }
  document.querySelector("#install").addEventListener("click", installApp);
});

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevents the default mini-infobar or install dialog from appearing on mobile
  e.preventDefault();
  // Save the event because you’ll need to trigger it later.
  deferredPrompt = e;
  // Show your customized install prompt for your PWA
  document.querySelector("#installInstructions").style.display = "none";
  showResult("✅ Your browser is supported", true);
});

window.addEventListener("appinstalled", (e) => {
  showResult("✅ Synz is installed", true);
});

async function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    // Find out whether the user confirmed the installation or not
    const { outcome } = await deferredPrompt.userChoice;
    // The deferredPrompt can only be used once.
    deferredPrompt = null;
    // Act on the user's choice
    if (outcome === "accepted") {
      showResult("😀 Thank you for installing Synz app.", true);
    } else if (outcome === "dismissed") {
      showResult("😟 Hope you get back soon.");
    }
    // We hide the install button
    document.querySelector("#installInstructions").style.display = "none";
  }
}

function showResult(text, append = false) {
  console.log(text);
}
