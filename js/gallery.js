/**
 * Product gallery – auto-discovers images from a folder.
 *
 * Usage:
 *   <div id="gallery" data-folder="../assets/img/products/typhoon/"></div>
 *   <script src="../js/gallery.js"></script>
 *
 * Images must be named 1.jpg, 2.jpg, 3.jpg … up to 20.
 * The gallery hides itself if no images are found.
 */
(function () {
  const MAX_IMAGES = 20;
  const container = document.getElementById("gallery");
  if (!container) return;

  const folder = container.dataset.folder;
  if (!folder) return;

  function probe(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  async function init() {
    // Discover images
    const urls = [];
    for (let i = 1; i <= MAX_IMAGES; i++) {
      const url = folder + i + ".jpg";
      if (await probe(url)) {
        urls.push(url);
      } else {
        break;
      }
    }

    if (urls.length === 0) {
      container.setAttribute("data-empty", "");
      return;
    }

    // Build DOM
    let idx = 0;

    // Viewport + track
    const viewport = document.createElement("div");
    viewport.className = "gallery-viewport";

    const track = document.createElement("div");
    track.className = "gallery-track";

    urls.forEach((url, i) => {
      const slide = document.createElement("div");
      slide.className = "gallery-slide";
      const img = document.createElement("img");
      img.src = url;
      img.alt = "Product photo " + (i + 1);
      img.loading = i === 0 ? "eager" : "lazy";
      slide.appendChild(img);
      track.appendChild(slide);
    });

    viewport.appendChild(track);

    // Prev / Next buttons
    const prevBtn = document.createElement("button");
    prevBtn.className = "gallery-btn prev";
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Previous image");
    prevBtn.innerHTML = "&#8249;";

    const nextBtn = document.createElement("button");
    nextBtn.className = "gallery-btn next";
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Next image");
    nextBtn.innerHTML = "&#8250;";

    viewport.appendChild(prevBtn);
    viewport.appendChild(nextBtn);

    // Counter
    const counter = document.createElement("div");
    counter.className = "gallery-counter";
    viewport.appendChild(counter);

    container.appendChild(viewport);

    // Thumbnails
    const thumbStrip = document.createElement("div");
    thumbStrip.className = "gallery-thumbs";

    const thumbs = urls.map((url, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-thumb" + (i === 0 ? " active" : "");
      btn.setAttribute("aria-label", "Go to image " + (i + 1));
      const img = document.createElement("img");
      img.src = url;
      img.alt = "";
      img.loading = "lazy";
      btn.appendChild(img);
      btn.addEventListener("click", () => goTo(i));
      thumbStrip.appendChild(btn);
      return btn;
    });

    container.appendChild(thumbStrip);

    // Logic
    function update() {
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      counter.textContent = (idx + 1) + " / " + urls.length;
      thumbs.forEach((t, i) => t.classList.toggle("active", i === idx));
      // Scroll active thumb into view
      thumbs[idx].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    function goTo(i) {
      idx = ((i % urls.length) + urls.length) % urls.length;
      update();
    }

    prevBtn.addEventListener("click", () => goTo(idx - 1));
    nextBtn.addEventListener("click", () => goTo(idx + 1));

    // Keyboard
    container.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goTo(idx - 1);
      if (e.key === "ArrowRight") goTo(idx + 1);
    });

    // Touch swipe
    let startX = 0;
    let startY = 0;
    viewport.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    viewport.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        goTo(idx + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });

    update();
  }

  init();
})();
