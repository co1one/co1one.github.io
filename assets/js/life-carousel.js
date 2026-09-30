(function () {
  "use strict";

  var carousels = document.querySelectorAll("[data-life-carousel]");
  var autoScrollInterval = 5000;

  if (!carousels.length) {
    return;
  }

  carousels.forEach(function (carousel) {
    var viewport = carousel.querySelector("[data-life-carousel-viewport]");
    var track = carousel.querySelector(".life-carousel__track");
    var previousButton = carousel.querySelector("[data-life-carousel-prev]");
    var nextButton = carousel.querySelector("[data-life-carousel-next]");
    var scrollbar = carousel.querySelector("[data-life-carousel-scrollbar]");
    var positionLabel = carousel.querySelector("[data-life-carousel-position]");
    var items = track ? track.querySelectorAll(".life-carousel__item") : [];
    var images = track ? track.querySelectorAll(".life-carousel__image") : [];
    var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var autoScrollTimer = null;
    var isHovered = false;
    var isFocused = false;
    var isPointerDown = false;

    if (!viewport || !track || !previousButton || !nextButton) {
      return;
    }

    function prefersReducedMotion() {
      return motionQuery.matches;
    }

    function getStep() {
      var firstItem = track.querySelector(".life-carousel__item");
      var trackStyles;
      var gap;

      if (!firstItem) {
        return viewport.clientWidth;
      }

      trackStyles = window.getComputedStyle(track);
      gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
      return firstItem.getBoundingClientRect().width + gap;
    }

    function getMaxScroll() {
      return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    }

    function getWidestAspectRatio() {
      var widestAspectRatio = 0;

      images.forEach(function (image) {
        var imageWidth = image.naturalWidth;
        var imageHeight = image.naturalHeight;

        if (imageWidth && imageHeight) {
          widestAspectRatio = Math.max(widestAspectRatio, imageWidth / imageHeight);
        }
      });

      return widestAspectRatio || (16 / 9);
    }

    function updateImageHeight() {
      var trackStyles = window.getComputedStyle(track);
      var gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
      var isMobile = window.matchMedia("(max-width: 640px)").matches;
      var visibleItems = isMobile ? 1 : 1.2;
      var gapCount = visibleItems > 1 ? 1 : 0;
      var availableWidth = Math.max(1, viewport.clientWidth - (gap * gapCount));
      var referenceHeight = availableWidth / (visibleItems * getWidestAspectRatio());
      var imageHeight = Math.max(180, Math.min(referenceHeight, 320));

      track.style.setProperty("--life-carousel-image-height", imageHeight + "px");
    }

    function scrollToPosition(position) {
      viewport.scrollTo({
        left: position,
        behavior: prefersReducedMotion() ? "auto" : "smooth"
      });
    }

    function updateProgress() {
      var maximum = getMaxScroll();
      var progress = maximum > 0 ? viewport.scrollLeft / maximum : 0;
      var firstItem = Math.min(
        items.length,
        Math.round(progress * Math.max(items.length - 1, 0)) + 1
      );

      if (scrollbar) {
        scrollbar.value = String(Math.round(progress * 1000));
      }

      if (positionLabel && items.length) {
        positionLabel.textContent = firstItem + " / " + items.length;
      }
    }

    function move(direction) {
      var maximum = getMaxScroll();
      var current = viewport.scrollLeft;
      var target;

      if (maximum <= 1) {
        return;
      }

      if (direction > 0) {
        target = current >= maximum - 1 ? 0 : Math.min(current + getStep(), maximum);
      } else {
        target = current <= 1 ? maximum : Math.max(current - getStep(), 0);
      }

      scrollToPosition(target);
    }

    function stopAutoScroll() {
      if (autoScrollTimer !== null) {
        window.clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }

    function canAutoScroll() {
      return !prefersReducedMotion() &&
        !isHovered &&
        !isFocused &&
        !isPointerDown &&
        !document.hidden &&
        getMaxScroll() > 1;
    }

    function updateAutoScroll() {
      stopAutoScroll();

      if (canAutoScroll()) {
        autoScrollTimer = window.setInterval(function () {
          if (canAutoScroll()) {
            move(1);
          } else {
            stopAutoScroll();
          }
        }, autoScrollInterval);
      }
    }

    previousButton.addEventListener("click", function () {
      move(-1);
      updateAutoScroll();
    });

    nextButton.addEventListener("click", function () {
      move(1);
      updateAutoScroll();
    });

    if (scrollbar) {
      scrollbar.addEventListener("input", function () {
        var maximum = getMaxScroll();
        var percentage = Number(scrollbar.value) / 1000;

        scrollToPosition(maximum * percentage);
        updateProgress();
      });
    }

    viewport.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    });

    carousel.addEventListener("mouseenter", function () {
      isHovered = true;
      updateAutoScroll();
    });

    carousel.addEventListener("mouseleave", function () {
      isHovered = false;
      updateAutoScroll();
    });

    carousel.addEventListener("focusin", function () {
      isFocused = true;
      updateAutoScroll();
    });

    carousel.addEventListener("focusout", function (event) {
      if (!carousel.contains(event.relatedTarget)) {
        isFocused = false;
        updateAutoScroll();
      }
    });

    viewport.addEventListener("pointerdown", function () {
      isPointerDown = true;
      updateAutoScroll();
    });

    function releasePointer() {
      isPointerDown = false;
      updateAutoScroll();
    }

    window.addEventListener("pointerup", releasePointer);
    window.addEventListener("pointercancel", releasePointer);

    viewport.addEventListener("scroll", updateProgress, { passive: true });

    images.forEach(function (image) {
      image.addEventListener("load", function () {
        updateImageHeight();
        updateProgress();
      });
    });

    document.addEventListener("visibilitychange", updateAutoScroll);
    window.addEventListener("resize", function () {
      updateImageHeight();
      updateProgress();
      updateAutoScroll();
    });

    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", updateAutoScroll);
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(updateAutoScroll);
    }

    updateImageHeight();
    updateProgress();
    updateAutoScroll();
  });
}());
