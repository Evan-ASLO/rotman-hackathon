"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
const mobileLayout = window.matchMedia("(max-width: 720px)");
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

const journey = document.querySelector(".page-journey");
const journeyMarks = [...journey.querySelectorAll(".journey-mark")];
const canAnimateJourney = typeof Element.prototype.animate === "function";
let journeyRoutes = [];
let journeyFrame = 0;
let journeyNeedsLayout = true;

function pageBox(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX, y: rect.top + window.scrollY,
    width: rect.width, height: rect.height,
    right: rect.right + window.scrollX, bottom: rect.bottom + window.scrollY
  };
}

function journeyKeyframes(knots, root) {
  const keyframes = [];
  const endTime = knots[knots.length - 1].at;
  for (let segment = 0; segment < knots.length - 1; segment++) {
    const from = knots[segment], to = knots[segment + 1];
    for (let step = segment === 0 ? 0 : 1; step <= 12; step++) {
      const progress = step / 12;
      // The reading rail tracks scroll linearly; bends ease through the surrounding whitespace.
      const travel = segment === 4 ? progress : progress * progress * (3 - 2 * progress);
      let sizing = travel;
      if (segment === 0) sizing = Math.min(1, travel * 3);
      if (segment === knots.length - 2) sizing = Math.max(0, (travel - .45) / .55);
      const size = from.size + (to.size - from.size) * sizing;
      const x = from.x + (to.x - from.x) * travel - root.x - size / 2;
      const y = from.y + (to.y - from.y) * travel - root.y - size / 2;
      keyframes.push({
        offset: (from.at + (to.at - from.at) * progress) / endTime,
        transform: `translate(${x}px, ${y}px) scale(${size / 128})`
      });
    }
  }
  return keyframes;
}

function measureJourney() {
  journeyRoutes.forEach(route => route.animation.cancel());
  journeyRoutes = [];
  const root = pageBox(document.querySelector("main"));
  const hero = pageBox(document.querySelector(".hero"));
  const origins = pageBox(document.querySelector(".hero-clubs"));
  const factsElement = document.querySelector(".facts");
  const facts = pageBox(factsElement);
  const railX = facts.x + parseFloat(getComputedStyle(factsElement).paddingLeft) / 2;
  const compact = window.matchMedia("(max-width: 1050px)").matches;
  const railSize = mobileLayout.matches ? 28 : 40;
  const spacing = mobileLayout.matches ? 72 : 52;
  const railTime = Math.max(280, facts.y - window.innerHeight * .52);
  journeyMarks.forEach((mark, index) => {
    const club = mark.dataset.club;
    const origin = pageBox(document.querySelector(`.journey-origin[data-club="${club}"] img`));
    const destination = document.querySelector(`.journey-destination[data-club="${club}"]`);
    const target = pageBox(destination);
    const targetX = target.x + target.width / 2;
    const targetY = target.y + target.height / 2;
    const endTime = Math.max(railTime + 300, targetY - window.innerHeight * .52);
    const footY = hero.bottom - (2 * spacing + 40) + index * spacing;
    const knots = [
      { at: 0, x: origin.x + origin.width / 2, y: origin.y + origin.height / 2, size: origin.width },
      { at: railTime * .2, x: origins.right - railSize / 2, y: compact ? origins.y + 16 + index * 72 : origin.y + origin.height / 2, size: railSize },
      { at: railTime * .48, x: origins.right - railSize / 2, y: footY, size: railSize },
      { at: railTime * .82, x: railX, y: footY, size: railSize },
      { at: railTime, x: railX, y: facts.y + index * spacing, size: railSize },
      { at: endTime - 192, x: railX, y: targetY - 192 + index * spacing, size: railSize },
      { at: endTime, x: targetX, y: targetY, size: target.width }
    ];
    const animation = mark.animate(journeyKeyframes(knots, root), {
      duration: 1000, fill: "both", easing: "linear"
    });
    animation.pause();
    animation.currentTime = 0;
    journeyRoutes.push({ animation, mark, destination, endTime, progress: -1 });
  });
  journeyNeedsLayout = false;
  journey.hidden = false;
  document.documentElement.dataset.journey = "ready";
}

function renderJourney() {
  journeyFrame = 0;
  if (journeyNeedsLayout) measureJourney();
  journeyRoutes.forEach(route => {
    const progress = Math.max(0, Math.min(1, window.scrollY / route.endTime));
    if (progress === route.progress) return;
    route.animation.currentTime = progress * 1000;
    route.mark.hidden = progress === 1;
    route.destination.classList.toggle("is-travelling", progress < 1);
    route.progress = progress;
  });
}

function queueJourneyFrame() {
  if (!journeyFrame && canAnimateJourney && !reducedMotion.matches && !document.hidden) {
    journeyFrame = requestAnimationFrame(renderJourney);
  }
}

function refreshJourneyLayout() {
  journeyNeedsLayout = true;
  queueJourneyFrame();
}

function resetJourney() {
  cancelAnimationFrame(journeyFrame);
  journeyFrame = 0;
  journeyRoutes.forEach(route => {
    route.animation.cancel();
    route.destination.classList.remove("is-travelling");
  });
  journeyRoutes = [];
  journey.hidden = true;
  delete document.documentElement.dataset.journey;
  refreshJourneyLayout();
}

window.addEventListener("scroll", queueJourneyFrame, { passive: true });
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
  resetJourney();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAnimations();
    cancelAnimationFrame(journeyFrame);
    journeyFrame = 0;
  } else {
    refreshJourneyLayout();
  }
});
window.addEventListener("resize", () => {
  stopAnimations();
  refreshJourneyLayout();
});
window.addEventListener("pageshow", refreshJourneyLayout);

// Enable compact navigation only after its handlers are ready.
menu.hidden = !mobileLayout.matches;
mobileLayout.addEventListener("change", () => { menu.hidden = !mobileLayout.matches; });
document.documentElement.setAttribute("data-js", "ready");
if (typeof ResizeObserver === "function") {
  const journeyResize = new ResizeObserver(refreshJourneyLayout);
  document.querySelectorAll(".site-header, .hero, .facts, #concept, #organizers").forEach(element => {
    journeyResize.observe(element);
  });
}
queueJourneyFrame();

const heroVideo = document.querySelector(".hero-video");
const heroPoster = document.querySelector(".hero-poster");
const videoToggle = document.querySelector(".hero-video-toggle");
const videoStatus = document.querySelector(".hero-video-status");
const connection = navigator.connection;
let wantsVideo = !reducedMotion.matches && !connection?.saveData;
let heroVisible = true;
let videoLoaded = false;
let videoFailed = false;
let playbackRequest = 0;
const failedVideoSources = new Set();

function showVideoStatus(message = "") {
  videoStatus.textContent = message;
  videoStatus.hidden = !message;
}

function updateVideoButton() {
  videoToggle.textContent = videoFailed ? "Retry background video" :
    wantsVideo ? "Pause background" : "Play background";
}

async function updateVideoPlayback() {
  const request = ++playbackRequest;
  updateVideoButton();
  if (!wantsVideo || !heroVisible || document.hidden || videoFailed) {
    heroVideo.pause();
    return;
  }
  if (!videoLoaded) {
    failedVideoSources.clear();
    heroVideo.querySelectorAll("source").forEach(source => { source.src = source.dataset.src; });
    heroVideo.load();
    videoLoaded = true;
  }
  try {
    await heroVideo.play();
    if (request !== playbackRequest) return;
    showVideoStatus();
  } catch (error) {
    if (request !== playbackRequest || error.name === "AbortError" || videoFailed) return;
    wantsVideo = false;
    showVideoStatus("Background paused. Select Play background to start.");
    updateVideoButton();
    console.warn("Hero background playback did not start:", error);
  }
}

heroVideo.muted = true;
heroVideo.addEventListener("playing", () => {
  heroVideo.hidden = false;
  heroPoster.hidden = true;
});
function showVideoFailure() {
  if (videoFailed) return;
  videoFailed = true;
  ++playbackRequest;
  heroVideo.pause();
  heroVideo.hidden = true;
  heroPoster.hidden = false;
  showVideoStatus("Background video unavailable. Showing a still image.");
  updateVideoButton();
  console.warn("Hero background video could not load:", heroVideo.error);
}
heroVideo.addEventListener("error", showVideoFailure);
const videoSources = [...heroVideo.querySelectorAll("source")];
videoSources.forEach(source => {
  source.addEventListener("error", () => {
    failedVideoSources.add(source);
    if (failedVideoSources.size === videoSources.length) showVideoFailure();
  });
});
videoToggle.addEventListener("click", () => {
  if (videoFailed) {
    videoFailed = false;
    videoLoaded = false;
    wantsVideo = true;
  } else {
    wantsVideo = !wantsVideo;
  }
  showVideoStatus();
  updateVideoPlayback();
});
reducedMotion.addEventListener("change", () => {
  wantsVideo = !reducedMotion.matches && !connection?.saveData;
  updateVideoPlayback();
});
connection?.addEventListener("change", () => {
  if (connection.saveData) {
    wantsVideo = false;
    updateVideoPlayback();
  }
});
document.addEventListener("visibilitychange", updateVideoPlayback);
videoToggle.hidden = false;
if (typeof IntersectionObserver === "function") {
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    updateVideoPlayback();
  });
  heroObserver.observe(document.querySelector(".hero"));
} else {
  updateVideoPlayback();
}
