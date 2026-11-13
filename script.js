"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
const mobileLayout = window.matchMedia("(max-width: 720px)");
const replay = document.querySelector(".replay");
const coalitionArt = document.querySelector(".coalition-art");
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
  const { width, height } = coalitionArt.getBoundingClientRect();
  if (width === 0 || height === 0) return;
  const emblems = [...coalitionArt.querySelectorAll(".coalition-emblem")];
  const result = document.querySelector(".coalition-result");
  emblems.forEach((emblem, index) => {
    const route = document.getElementById(emblem.dataset.route);
    const length = route.getTotalLength();
    const start = route.getPointAtLength(0);
    const keyframes = [];
    // Sample the drawn route once; the browser plays the motion without a frame loop.
    for (let step = 0; step <= 32; step++) {
      const progress = step / 32;
      const inward = progress <= .5 ? progress * 2 : (1 - progress) * 2;
      const eased = (1 - Math.cos(inward * Math.PI)) / 2;
      const point = route.getPointAtLength(length * .6 * eased);
      const dx = (point.x - start.x) * width / 600;
      const dy = (point.y - start.y) * height / 190;
      const scale = 1 - .44 * eased;
      keyframes.push({
        offset: progress,
        transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})`
      });
    }
    trackAnimation(emblem.animate(keyframes, {
      duration: 1600, delay: index * 60, easing: "linear"
    }));
    const signal = coalitionArt.querySelector(`.coalition-signal[data-route="${emblem.dataset.route}"]`);
    signal.style.strokeDasharray = String(length);
    trackAnimation(signal.animate([
      { strokeDashoffset: String(length), opacity: 0 },
      { strokeDashoffset: String(length), opacity: 1, offset: .05 },
      { strokeDashoffset: "0", opacity: 1, offset: .45 },
      { strokeDashoffset: "0", opacity: 1, offset: .7 },
      { strokeDashoffset: "0", opacity: 0 }
    ], { duration: 1600, delay: index * 60, easing: "linear" }));
  });
  trackAnimation(coalitionArt.querySelector(".coalition-pulse").animate([
    { transform: "scale(.7)", opacity: 0 },
    { transform: "scale(1.1)", opacity: .8, offset: .25 },
    { transform: "scale(2.4)", opacity: 0 }
  ], { duration: 800, delay: 600, easing: "linear" }));
  trackAnimation(result.animate([
    { clipPath: "inset(0 0 70% 0)", opacity: .5 },
    { clipPath: "inset(0 0 0 0)", opacity: 1 }
  ], { duration: 650, delay: 700, fill: "backwards", easing: "cubic-bezier(.16,1,.3,1)" }));
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
window.addEventListener("resize", stopAnimations);

// Enable compact navigation only after its handlers are ready.
menu.hidden = !mobileLayout.matches;
mobileLayout.addEventListener("change", () => { menu.hidden = !mobileLayout.matches; });
document.documentElement.setAttribute("data-js", "ready");
replay.hidden = reducedMotion.matches || typeof Element.prototype.animate !== "function";
if (typeof IntersectionObserver === "function") {
  let played = false;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting && !played) {
        played = true;
        converge();
      } else if (!entry.isIntersecting) {
        stopAnimations();
      }
    }
  }, { threshold: .4 });
  observer.observe(coalitionArt);
} else {
  converge();
}
