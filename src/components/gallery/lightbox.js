import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";

import * as styles from "./lightbox.module.css";

const SWIPE_DISTANCE = 80;
const DISMISS_DISTANCE = 120;
const ZOOM_SCALE = 2.5;
const DOUBLE_TAP_MS = 300;
// Generous enough to reach any corner at ZOOM_SCALE without letting the photo
// be flung off screen.
const PAN_BOUNDS = { left: -400, right: 400, top: -400, bottom: 400 };

export const Lightbox = ({ photos, index, onIndexChange, onClose }) => {
  const isOpen = index !== null && index >= 0;
  const photo = isOpen ? photos[index] : null;
  const closeRef = useRef(null);
  const lastTapRef = useRef(0);
  const [zoomed, setZoomed] = useState(false);

  // A new photo (or a close) always starts back at 1x.
  useEffect(() => {
    setZoomed(false);
  }, [index]);

  const step = useCallback(
    (delta) => {
      // Wrap around so arrowing past either end keeps going.
      onIndexChange(
        (current) => (current + delta + photos.length) % photos.length
      );
    },
    [onIndexChange, photos.length]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    // iOS Safari ignores `overflow: hidden` on body, so pin the page in place
    // instead and put the scroll position back on close.
    const scrollY = window.scrollY;
    const { style } = document.body;
    const previous = {
      position: style.position,
      top: style.top,
      width: style.width,
    };
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";

    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      style.position = previous.position;
      style.top = previous.top;
      style.width = previous.width;
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, step]);

  // Warm the neighbours so arrowing through feels instant.
  useEffect(() => {
    if (!isOpen) return;
    [-1, 1].forEach((delta) => {
      const neighbour = photos[(index + delta + photos.length) % photos.length];
      if (neighbour) new Image().src = neighbour.src;
    });
  }, [isOpen, index, photos]);

  // While zoomed, dragging pans the photo instead of navigating away from it.
  const handleDragEnd = (_event, { offset, velocity }) => {
    if (zoomed) return;
    if (offset.y > DISMISS_DISTANCE && velocity.y > 0) {
      onClose();
    } else if (offset.x < -SWIPE_DISTANCE) {
      step(1);
    } else if (offset.x > SWIPE_DISTANCE) {
      step(-1);
    }
  };

  // Native pinch still works via `touch-action: pinch-zoom`; this adds the
  // double-tap shortcut people expect from a photo viewer.
  const handleTap = (event) => {
    event.stopPropagation();
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_MS) {
      setZoomed((current) => !current);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${photos.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            type="button"
            className={`${styles.control} ${styles.close}`}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>

          <button
            type="button"
            className={`${styles.control} ${styles.prev}`}
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
          >
            &#8249;
          </button>

          <motion.img
            key={photo.slug}
            src={photo.src}
            alt={photo.alt}
            className={`${styles.image} ${zoomed ? styles.zoomed : ""}`}
            width={photo.fullWidth}
            height={photo.fullHeight}
            drag
            dragElastic={zoomed ? 0 : 0.2}
            dragConstraints={
              zoomed ? PAN_BOUNDS : { left: 0, right: 0, top: 0, bottom: 0 }
            }
            onDragEnd={handleDragEnd}
            onClick={handleTap}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: zoomed ? ZOOM_SCALE : 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            draggable={false}
          />

          <button
            type="button"
            className={`${styles.control} ${styles.next}`}
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
          >
            &#8250;
          </button>

          <p className={styles.counter}>
            {index + 1} / {photos.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Lightbox.propTypes = {
  photos: PropTypes.array.isRequired,
  index: PropTypes.number,
  onIndexChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
