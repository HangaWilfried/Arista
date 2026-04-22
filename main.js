const ls = document.getElementById("love-screen"),
  progress = document.getElementById("progress"),
  dotsWrap = document.getElementById("slide-dots"),
  audio = document.getElementById("bg-music"),
  mi = document.getElementById("music-indicator");
const allSlides = ls.querySelectorAll(".slide"),
  photoBgs = ls.querySelectorAll(".photo-slide-bg");
allSlides.forEach((_, i) => {
  const d = document.createElement("div");
  d.className = "dot" + (i === 0 ? " active" : "");
  d.onclick = () => allSlides[i].scrollIntoView({ behavior: "smooth" });
  dotsWrap.appendChild(d);
});
const dots = dotsWrap.querySelectorAll(".dot");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const c = entry.target.querySelector(
        ".photo-slide-content,.finale-content",
      );
      if (c) setTimeout(() => c.classList.add("visible"), 240);
      const idx = Array.from(allSlides).indexOf(entry.target);
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    });
  },
  { root: ls, threshold: 0.55 },
);
allSlides.forEach((s) => io.observe(s));
let ticking = false;
ls.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const st = ls.scrollTop,
        sh = ls.scrollHeight - ls.clientHeight;
      progress.style.width = (sh > 0 ? (st / sh) * 100 : 0) + "%";
      photoBgs.forEach((bg) => {
        const r = bg.parentElement.getBoundingClientRect();
        const prog =
          (window.innerHeight - r.top) / (window.innerHeight + r.height);
        bg.style.transform = `scale(1.06) translateY(${(prog - 0.5) * 55}px)`;
      });
      ticking = false;
    });
  },
  { passive: true },
);
let started = false;
function tryPlay() {
  if (!started) {
    audio.volume = 0.55;
    audio
      .play()
      .then(() => {
        started = true;
        mi.style.display = "flex";
      })
      .catch(() => {});
  }
}
document.addEventListener("click", tryPlay, { once: true });
document.addEventListener("touchstart", tryPlay, { once: true });
ls.addEventListener("scroll", tryPlay, { once: true, passive: true });
function toggleMusic() {
  if (audio.paused) {
    audio.play();
    mi.classList.remove("paused");
  } else {
    audio.pause();
    mi.classList.add("paused");
  }
}
