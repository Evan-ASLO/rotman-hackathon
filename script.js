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

const coalitionHint = document.querySelector(".coalition-scroll-hint");
const canAnimateCoalition = typeof Element.prototype.animate === "function";
let coalitionAnimations = [];
let coalitionFrame = 0;
let coalitionNeedsLayout = true;
let coalitionGeometry;
let coalitionPreview = null;
let coalitionLastProgress = -1;

function addCoalitionAnimation(element, keyframes) {
  const animation = element.animate(keyframes, { duration: 1000, fill: "both", easing: "linear" });
  animation.pause();
  animation.currentTime = 0;
  coalitionAnimations.push(animation);
}

function measureCoalition() {
  coalitionAnimations.forEach(animation => animation.cancel());
  coalitionAnimations = [];
  coalitionLastProgress = -1;
  const { top, width, height } = coalitionArt.getBoundingClientRect();
  const pageTop = top + window.scrollY;
  const start = Math.max(0, pageTop - window.innerHeight * .75);
  coalitionGeometry = {
    top: pageTop, height, start,
    end: Math.max(start + 160, pageTop - window.innerHeight * .2)
  };
  coalitionNeedsLayout = false;
  if (width === 0 || height === 0) return;
  const emblems = [...coalitionArt.querySelectorAll(".coalition-emblem")];
  emblems.forEach(emblem => {
    const route = document.getElementById(emblem.dataset.route);
    const length = route.getTotalLength();
    const start = route.getPointAtLength(0);
    const keyframes = [];
    // Sample only on layout changes; scrolling seeks the paused browser animations.
    for (let step = 0; step <= 32; step++) {
      const progress = step / 32;
      const eased = (1 - Math.cos(progress * Math.PI)) / 2;
      const point = route.getPointAtLength(length * .6 * eased);
      const dx = (point.x - start.x) * width / 600;
      const dy = (point.y - start.y) * height / 190;
      const scale = 1 - .44 * eased;
      keyframes.push({
        offset: progress,
        transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})`
      });
    }
    addCoalitionAnimation(emblem, keyframes);
    const signal = coalitionArt.querySelector(`.coalition-signal[data-route="${emblem.dataset.route}"]`);
    signal.style.strokeDasharray = String(length);
    addCoalitionAnimation(signal, [
      { strokeDashoffset: String(length), opacity: 0 },
      { strokeDashoffset: String(length * .88), opacity: 1, offset: .12 },
      { strokeDashoffset: "0", opacity: 1 }
    ]);
  });
  addCoalitionAnimation(coalitionArt.querySelector(".coalition-pulse"), [
    { transform: "scale(.7)", opacity: .15 },
    { transform: "scale(1.45)", opacity: .8 }
  ]);
  addCoalitionAnimation(document.querySelector(".coalition-result strong"), [
    { color: "var(--cp-text)", transform: "translateY(0)" },
    { color: "var(--cp-accent)", transform: "translateY(-4px)" }
  ]);
}

function coalitionScrollProgress() {
  const { start, end } = coalitionGeometry;
  return Math.max(0, Math.min(1, (window.scrollY - start) / (end - start)));
}

function queueCoalitionFrame() {
  if (!coalitionFrame && canAnimateCoalition && !reducedMotion.matches && !document.hidden) {
    coalitionFrame = requestAnimationFrame(renderCoalition);
  }
}

function renderCoalition(time) {
  coalitionFrame = 0;
  if (coalitionNeedsLayout) measureCoalition();
  const viewportTop = coalitionGeometry.top - window.scrollY;
  if (viewportTop + coalitionGeometry.height < 0 || viewportTop > window.innerHeight) {
    coalitionPreview = null;
    return;
  }
  let progress = coalitionScrollProgress();
  if (coalitionPreview) {
    const elapsed = Math.min(1, (time - coalitionPreview.start) / 1600);
    const target = coalitionPreview.origin < .5 ? 1 : 0;
    const travel = (1 - Math.cos(elapsed * Math.PI * 2)) / 2;
    progress = coalitionPreview.origin + (target - coalitionPreview.origin) * travel;
    if (elapsed < 1) queueCoalitionFrame();
    else {
      coalitionPreview = null;
      progress = coalitionScrollProgress();
    }
  }
  if (progress === coalitionLastProgress) return;
  coalitionAnimations.forEach(animation => { animation.currentTime = progress * 1000; });
  coalitionLastProgress = progress;
}

function cancelCoalitionPreview() {
  coalitionPreview = null;
  cancelAnimationFrame(coalitionFrame);
  coalitionFrame = 0;
}

function refreshCoalitionLayout() {
  cancelCoalitionPreview();
  coalitionNeedsLayout = true;
  queueCoalitionFrame();
}

replay.addEventListener("click", () => {
  if (!canAnimateCoalition || reducedMotion.matches || document.hidden) return;
  if (coalitionNeedsLayout) measureCoalition();
  coalitionPreview = { start: performance.now(), origin: coalitionScrollProgress() };
  queueCoalitionFrame();
});
window.addEventListener("scroll", () => {
  coalitionPreview = null;
  queueCoalitionFrame();
}, { passive: true });
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
  cancelCoalitionPreview();
  coalitionAnimations.forEach(animation => animation.cancel());
  coalitionAnimations = [];
  replay.hidden = coalitionHint.hidden = reducedMotion.matches || !canAnimateCoalition;
  refreshCoalitionLayout();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAnimations();
    cancelCoalitionPreview();
  } else {
    refreshCoalitionLayout();
  }
});
window.addEventListener("resize", () => {
  stopAnimations();
  refreshCoalitionLayout();
});
window.addEventListener("pageshow", refreshCoalitionLayout);

// Enable compact navigation only after its handlers are ready.
menu.hidden = !mobileLayout.matches;
mobileLayout.addEventListener("change", () => { menu.hidden = !mobileLayout.matches; });
document.documentElement.setAttribute("data-js", "ready");
replay.hidden = coalitionHint.hidden = reducedMotion.matches || !canAnimateCoalition;
if (typeof ResizeObserver === "function") {
  const coalitionResize = new ResizeObserver(refreshCoalitionLayout);
  coalitionResize.observe(document.querySelector(".hero"));
  coalitionResize.observe(document.querySelector(".site-header"));
}
queueCoalitionFrame();

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
