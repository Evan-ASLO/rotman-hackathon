"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
const mobileLayout = window.matchMedia("(max-width: 720px)");
const replay = document.querySelector(".replay");
let activeAnimations = [];

function trackAnimation(animation) {
  activeAnimations.push(animation);
  const release = () => { activeAnimations = activeAnimations.filter(item => item !== animation); };
  animation.addEventListener("finish", release, { once: true });
  animation.addEventListener("cancel", release, { once: true });
}

function closeMenu(returnFocus = false) {
  menu.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  if (returnFocus) menu.focus();
}

menu.addEventListener("click", () => {
  const expanded = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(expanded));
  navigation.classList.toggle("is-open", expanded);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a") && mobileLayout.matches) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    closeMenu(true);
  }
});
mobileLayout.addEventListener("change", () => closeMenu());

function stopAnimations() {
  activeAnimations.forEach((animation) => animation.cancel());
  activeAnimations = [];
}

function converge() {
  stopAnimations();
  if (reducedMotion.matches || typeof Element.prototype.animate !== "function" || document.hidden) return;
  const identities = [...document.querySelectorAll(".identity")];
  const result = document.querySelector(".coalition-result");
  const offsets = [-32, 0, 32];
  identities.forEach((identity, index) => {
    trackAnimation(identity.animate([
      { transform: `translate(${offsets[index]}px, -12px)`, opacity: 0.4 },
      { transform: "translate(0, 0)", opacity: 1 }
    ], { duration: 600, delay: index * 70, fill: "backwards", easing: "cubic-bezier(.16,1,.3,1)" }));
  });
  trackAnimation(result.animate([
    { clipPath: "inset(0 0 70% 0)", opacity: 0.4 },
    { clipPath: "inset(0 0 0 0)", opacity: 1 }
  ], { duration: 650, delay: 150, fill: "backwards", easing: "cubic-bezier(.16,1,.3,1)" }));
}

replay.addEventListener("click", converge);
document.querySelectorAll(".faq-list details").forEach((details) => {
  details.addEventListener("toggle", () => {
    if (!details.open || reducedMotion.matches || typeof Element.prototype.animate !== "function") return;
    trackAnimation(details.querySelector(".faq-answer").animate([
      { transform: "translateY(-4px)", opacity: 0.6 },
      { transform: "translateY(0)", opacity: 1 }
    ], { duration: 180, easing: "ease-out" }));
  });
});
reducedMotion.addEventListener("change", () => {
  stopAnimations();
  replay.hidden = reducedMotion.matches || typeof Element.prototype.animate !== "function";
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopAnimations();
});

// Enable compact navigation only after its handlers are ready.
menu.hidden = !mobileLayout.matches;
mobileLayout.addEventListener("change", () => { menu.hidden = !mobileLayout.matches; });
document.documentElement.setAttribute("data-js", "ready");
replay.hidden = reducedMotion.matches || typeof Element.prototype.animate !== "function";
converge();
