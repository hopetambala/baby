import React, { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";

import { Lightbox } from "./lightbox";
import photos from "../../data/gallery-manifest.json";
import * as styles from "./gallery.module.css";

/**
 * One auto-scrolling row. The items are rendered twice inside a max-content
 * track and the track slides exactly -50%, so the second copy lands where the
 * first started and the loop is seamless. Duration scales with item count to
 * keep both rows moving at the same speed. On mobile and for reduced-motion
 * users the CSS drops the animation and the row becomes a native swipe strip.
 */
const MarqueeRow = ({ items, reverse, onSelect }) => (
  <div className={styles.row}>
    <div
      className={`${styles.track} ${reverse ? styles.reverse : ""}`}
      style={{ "--item-count": items.length }}
    >
      {[0, 1].map((copy) =>
        items.map((photo) => (
          <button
            key={`${copy}-${photo.slug}`}
            type="button"
            className={
              copy === 1 ? `${styles.tile} ${styles.duplicate}` : styles.tile
            }
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
            onClick={(event) => onSelect(photo.slug, event.currentTarget)}
            // The duplicate copy is decoration; only the first is reachable.
            aria-hidden={copy === 1 || undefined}
            tabIndex={copy === 1 ? -1 : 0}
          >
            <img
              src={photo.thumb}
              srcSet={`${photo.thumbSmall} ${photo.thumbSmallWidth}w, ${photo.thumb} ${photo.width}w`}
              // Roughly the widest a tile gets at each breakpoint; the browser
              // folds in device pixel ratio from there.
              sizes="(max-width: 900px) 285px, 390px"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </button>
        ))
      )}
    </div>
  </div>
);

MarqueeRow.propTypes = {
  items: PropTypes.array.isRequired,
  reverse: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

export const Gallery = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const triggerRef = useRef(null);

  // Safari doesn't focus a button on click, so take the tile from the event
  // rather than reading document.activeElement.
  const handleSelect = useCallback((slug, tile) => {
    triggerRef.current = tile;
    setOpenIndex(photos.findIndex((photo) => photo.slug === slug));
  }, []);

  const handleClose = useCallback(() => {
    setOpenIndex(null);
    // Send focus back to the tile that opened the lightbox.
    if (triggerRef.current) triggerRef.current.focus();
  }, []);

  if (!photos.length) return null;

  // Alternate rather than split down the middle, so each row spans the whole
  // timeline and mixes orientations instead of clustering them.
  const top = photos.filter((_, i) => i % 2 === 0);
  const bottom = photos.filter((_, i) => i % 2 === 1);

  return (
    <>
      <div className={styles.gallery}>
        <MarqueeRow items={top} onSelect={handleSelect} />
        {bottom.length > 0 && (
          <MarqueeRow items={bottom} reverse onSelect={handleSelect} />
        )}
      </div>

      <Lightbox
        photos={photos}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={handleClose}
      />
    </>
  );
};
