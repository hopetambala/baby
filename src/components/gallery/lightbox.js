import React, { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";

import * as styles from "./lightbox.module.css";

const SWIPE_DISTANCE = 80;
const DISMISS_DISTANCE = 120;

export const Lightbox = ({ photos, index, onIndexChange, onClose }) => {
  const isOpen = index !== null && index >= 0;
  const photo = isOpen ? photos[index] : null;
  const closeRef = useRef(null);

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

    // Stop the page behind the overlay from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
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

  const handleDragEnd = (_event, { offset, velocity }) => {
    if (offset.y > DISMISS_DISTANCE && velocity.y > 0) {
      onClose();
    } else if (offset.x < -SWIPE_DISTANCE) {
      step(1);
    } else if (offset.x > SWIPE_DISTANCE) {
      step(-1);
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
            className={styles.image}
            width={photo.fullWidth}
            height={photo.fullHeight}
            drag
            dragElastic={0.2}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
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
