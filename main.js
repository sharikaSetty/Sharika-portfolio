(() => {
  const $ = (s) => document.querySelector(s);
  const body = document.body;
  const vH = $("#v-hero"),
    vA = $("#v-about"),
    end = $("#about-end");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const waitUntil = (video, secondsBeforeEnd) =>
    new Promise((resolve) => {
      const revealAt = () => {
        if (
          video.duration &&
          video.currentTime >= video.duration - secondsBeforeEnd
        ) {
          video.removeEventListener("timeupdate", revealAt);
          resolve();
        }
      };
      if (
        video.ended ||
        (video.duration &&
          video.currentTime >= video.duration - secondsBeforeEnd)
      ) {
        resolve();
        return;
      }
      video.addEventListener("timeupdate", revealAt);
    });
  const waitForVideoEnd = (video) =>
    new Promise((resolve) => {
      if (video.ended) {
        resolve();
        return;
      }
      video.addEventListener("ended", resolve, { once: true });
    });

  let state = "moving"; // moving | hero | about

  /* ---------- Hero initialization (loader disabled) ---------- */
  async function initHero() {
    vH.classList.add("on");
    setNav("home");

    if (reduce) {
      vH.currentTime = Math.max(0, (vH.duration || 4) - 0.05);
    } else {
      vH.currentTime = 0;
      vH.play().catch((error) => {
        console.error("Unable to play the hero video.", error);
      });
    }

    let revealed = false;
    const revealNow = () => {
      if (revealed) return;
      revealed = true;
      body.classList.add("hero-on", "ui-on");
      state = "hero";
    };

    if (!reduce) await waitUntil(vH, 1.8);
    if (state !== "moving") return;
    revealNow();
  }

  /* ---------- Hero -> about ---------- */
  async function goAbout() {
    if (state !== "hero") return;
    state = "moving";
    body.classList.remove("hero-on");
    vH.classList.remove("direct");
    end.classList.remove("direct");
    vA.currentTime = 0;
    if (!reduce) await vA.play().catch(() => {});
    vA.classList.add("on");
    if (!reduce) await waitUntil(vA, 0.7);
    end.classList.add("on");
    body.classList.add("about-on");
    await wait(reduce ? 0 : 1800);
    setNav("about");
    state = "about";
  }

  /* ---------- About -> hero ---------- */
  async function goHero() {
    if (state !== "about") return;
    state = "moving";
    body.classList.remove("about-on");
    end.classList.remove("direct");
    end.classList.remove("on");
    await wait(900);
    vA.classList.remove("on");
    await wait(900);
    vA.pause();
    vH.currentTime = Math.max(0, (vH.duration || 4) - 0.05);
    vH.pause();
    body.classList.add("hero-on");
    setNav("home");
    await wait(700);
    state = "hero";
  }

  function showHeroDirect() {
    state = "hero";
    vA.pause();
    vA.classList.remove("on");
    end.classList.remove("on");
    vH.classList.add("direct");
    vH.currentTime = Math.max(0, (vH.duration || 4) - 0.05);
    vH.pause();
    vH.classList.add("on");
    body.classList.remove("about-on");
    body.classList.add("hero-on", "ui-on");
    setNav("home");
  }

  function showAboutDirect() {
    state = "about";
    vH.pause();
    vH.classList.remove("on");
    vA.pause();
    vA.classList.remove("on");
    end.classList.add("direct");
    end.classList.add("on");
    body.classList.remove("hero-on");
    body.classList.add("about-on", "ui-on");
    setNav("about");
  }

  /* ---------- Navigation + input ---------- */
  function setNav(which) {
    document.querySelectorAll(".nav a[data-go]").forEach((a) => {
      if (a.dataset.go === which) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }
  document.querySelectorAll("[data-go]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const direct = el.closest(".nav");
      if (direct) {
        el.dataset.go === "about" ? showAboutDirect() : showHeroDirect();
      } else {
        el.dataset.go === "about" ? goAbout() : goHero();
      }
    }),
  );

  const inCol = (t) => {
    const c = t.closest && t.closest(".col");
    return c && c.scrollHeight > c.clientHeight;
  };
  addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) < 12 || inCol(e.target)) return;
      e.deltaY > 0 ? goAbout() : showHeroDirect();
    },
    { passive: true },
  );
  let ty = null;
  addEventListener(
    "touchstart",
    (e) => {
      ty = e.touches[0].clientY;
    },
    { passive: true },
  );
  addEventListener(
    "touchend",
    (e) => {
      if (ty === null || inCol(e.target)) return;
      const d = ty - e.changedTouches[0].clientY;
      ty = null;
      if (d > 50) goAbout();
      else if (d < -50) showHeroDirect();
    },
    { passive: true },
  );
  addEventListener("keydown", (e) => {
    if (["ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      goAbout();
    }
    if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      showHeroDirect();
    }
  });

  /* ---------- Bengaluru clock on the sticky note ---------- */
  const clock = $("#clock");
  const tick2 = () => {
    if (clock)
      clock.textContent = new Date()
        .toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase();
  };
  tick2();
  setInterval(tick2, 30000);

  initHero();
})();
