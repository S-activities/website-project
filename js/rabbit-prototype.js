(() => {
  const root = document.documentElement;
  const viewport = document.querySelector(".viewport");
  const world = document.querySelector(".world-art");
  const rabbit = document.querySelector(".rabbit");
  const shadow = document.querySelector(".rabbit-shadow");
  const frames = [...document.querySelectorAll(".rabbit-frame")];
  const progress = document.querySelector("#walkProgress");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  // Foot positions follow the walkway's vanishing point in the supplied painting.
  // Scroll eases between the near foreground and the smaller, distant path.
  const near = { x: 0.515, y: 0.91, scale: 1 };
  const far = { x: 0.493, y: 0.625, scale: 0.47 };
  let pointer = { x: 0, y: 0 };
  let pointerTarget = { x: 0, y: 0 };
  let scrollProgress = 0;
  let currentFrame = 0;
  let frameDirection = 1;
  let animationFrame = 0;

  function ease(value) {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  }

  function updateScroll() {
    const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scrollProgress = ease(scrollY / range);
  }

  function updatePointer(event) {
    const bounds = viewport.getBoundingClientRect();
    pointerTarget.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
    pointerTarget.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 3;
  }

  function tick() {
    pointer.x += (pointerTarget.x - pointer.x) * 0.045;
    pointer.y += (pointerTarget.y - pointer.y) * 0.045;
    const t = scrollProgress;
    const x = near.x + (far.x - near.x) * t;
    const y = near.y + (far.y - near.y) * t;
    const depth = near.scale + (far.scale - near.scale) * t;
    const responsiveY = y * viewport.clientHeight;
    const responsiveX = x * viewport.clientWidth + pointer.x * 0.22;

    rabbit.style.left = `${responsiveX}px`;
    rabbit.style.top = `${responsiveY}px`;
    rabbit.style.setProperty("--depth-scale", depth.toFixed(3));
    shadow.style.left = `${responsiveX}px`;
    shadow.style.top = `${responsiveY + 2}px`;
    shadow.style.setProperty("--depth-scale", depth.toFixed(3));
    viewport.style.setProperty("--camera-x", `${pointer.x * 0.38}px`);
    viewport.style.setProperty("--camera-y", `${pointer.y * 0.25 - t * 1.4}px`);
    root.style.setProperty("--walk-progress", t.toFixed(3));
    progress.style.height = `${Math.max(8, t * 100)}%`;
    animationFrame = requestAnimationFrame(tick);
  }

  function advanceIdle() {
    if (reducedMotion.matches) return;
    currentFrame += frameDirection;
    if (currentFrame === frames.length - 1 || currentFrame === 0) frameDirection *= -1;
    frames.forEach((frame, index) => frame.classList.toggle("is-visible", index === currentFrame));
    window.setTimeout(advanceIdle, currentFrame === 1 ? 2850 : 3400);
  }

  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll, { passive: true });
  viewport.addEventListener("pointermove", updatePointer, { passive: true });
  viewport.addEventListener("pointerleave", () => { pointerTarget = { x: 0, y: 0 }; }, { passive: true });
  updateScroll();
  animationFrame = requestAnimationFrame(tick);
  if (!reducedMotion.matches) window.setTimeout(advanceIdle, 3000);

  window.addEventListener("pagehide", () => cancelAnimationFrame(animationFrame), { once: true });
})();
