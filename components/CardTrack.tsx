"use client";

import { MotionStyle, PanInfo, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pathCards } from "@/data/pathCards";
import { PathCard } from "@/components/PathCard";
import { BackgroundTextTrack } from "@/components/BackgroundTextTrack";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const CARD_WIDTH = 960;
const CARD_HEIGHT = 540;
const CARD_STEP = 570;
const INITIAL_INDEX = 2;
const SNAP_DELAY = 140;
const WHEEL_PREVIEW_DAMPING = 0.34;
const WHEEL_STEP_THRESHOLD = 38;
const DRAG_DAMPING = 0.86;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getLayout = () => {
  if (typeof window === "undefined") {
    return {
      cardWidth: CARD_WIDTH,
      cardHeight: CARD_HEIGHT,
      cardStep: CARD_STEP
    };
  }

  const scaleX = window.innerWidth / DESIGN_WIDTH;
  const scaleY = window.innerHeight / DESIGN_HEIGHT;

  return {
    cardWidth: CARD_WIDTH * scaleX,
    cardHeight: CARD_HEIGHT * scaleX,
    cardStep: CARD_STEP * scaleY
  };
};

export function CardTrack() {
  const prefersReducedMotion = useReducedMotion();
  const [layout, setLayout] = useState(getLayout);
  const activeIndex = useRef(INITIAL_INDEX);
  const targetY = useRef(-INITIAL_INDEX * layout.cardStep);
  const wheelIntent = useRef(0);
  const wasDragged = useRef(false);
  const rawTrackY = useMotionValue(-INITIAL_INDEX * layout.cardStep);
  const cardTrackY = useSpring(rawTrackY, {
    stiffness: prefersReducedMotion ? 900 : 150,
    damping: prefersReducedMotion ? 90 : 28,
    mass: prefersReducedMotion ? 0.3 : 1.05
  });
  const snapTimer = useRef<number | null>(null);

  useEffect(() => {
    const updateLayout = () => {
      const nextLayout = getLayout();
      setLayout(nextLayout);
      targetY.current = -activeIndex.current * nextLayout.cardStep;
      rawTrackY.set(targetY.current);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, [rawTrackY]);

  const bounds = useMemo(
    () => ({
      min: -(pathCards.length - 1) * layout.cardStep,
      max: 0
    }),
    [layout.cardStep]
  );

  const clearSnapTimer = useCallback(() => {
    if (snapTimer.current) {
      window.clearTimeout(snapTimer.current);
      snapTimer.current = null;
    }
  }, []);

  const snapToIndex = useCallback(
    (index: number) => {
      clearSnapTimer();
      const nextIndex = clamp(index, 0, pathCards.length - 1);
      activeIndex.current = nextIndex;
      wheelIntent.current = 0;
      targetY.current = -nextIndex * layout.cardStep;
      rawTrackY.set(targetY.current);
    },
    [clearSnapTimer, layout.cardStep, rawTrackY]
  );

  const snapToNearest = useCallback(
    (projectedValue?: number) => {
      clearSnapTimer();
      const current = projectedValue ?? rawTrackY.get();
      const nearestIndex = clamp(Math.round(Math.abs(current) / layout.cardStep), 0, pathCards.length - 1);
      snapToIndex(nearestIndex);
    },
    [clearSnapTimer, layout.cardStep, rawTrackY, snapToIndex]
  );

  const scheduleSnap = useCallback(() => {
    clearSnapTimer();
    snapTimer.current = window.setTimeout(() => snapToNearest(), SNAP_DELAY);
  }, [clearSnapTimer, snapToNearest]);

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      wheelIntent.current += event.deltaY;

      if (Math.abs(wheelIntent.current) >= WHEEL_STEP_THRESHOLD) {
        const direction = wheelIntent.current > 0 ? 1 : -1;
        snapToIndex(activeIndex.current + direction);
        return;
      }

      const previewY = clamp(
        -activeIndex.current * layout.cardStep - wheelIntent.current * WHEEL_PREVIEW_DAMPING,
        bounds.min,
        bounds.max
      );
      targetY.current = previewY;
      rawTrackY.set(targetY.current);
      scheduleSnap();
    },
    [bounds.max, bounds.min, layout.cardStep, rawTrackY, scheduleSnap, snapToIndex]
  );

  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      clearSnapTimer();
      if (Math.abs(info.offset.y) > 6) {
        wasDragged.current = true;
      }
      const next = clamp(targetY.current + info.delta.y * DRAG_DAMPING, bounds.min, bounds.max);
      targetY.current = next;
      rawTrackY.set(targetY.current);
    },
    [bounds.max, bounds.min, clearSnapTimer, rawTrackY]
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const projected = targetY.current + info.velocity.y * 0.18;
      snapToNearest(clamp(projected, bounds.min, bounds.max));
      window.setTimeout(() => {
        wasDragged.current = false;
      }, 0);
    },
    [bounds.max, bounds.min, snapToNearest]
  );

  const handleCardSelect = useCallback(
    (index: number) => {
      if (wasDragged.current) {
        return;
      }
      snapToIndex(index);
    },
    [snapToIndex]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const currentIndex = Math.round(Math.abs(targetY.current) / layout.cardStep);
      const nextIndex = clamp(currentIndex + direction, 0, pathCards.length - 1);
      snapToIndex(nextIndex);
    },
    [layout.cardStep, snapToIndex]
  );

  const cardTrackStyle = {
    y: cardTrackY,
    "--card-width": `${layout.cardWidth}px`,
    "--card-height": `${layout.cardHeight}px`,
    "--card-step": `${layout.cardStep}px`
  } as unknown as MotionStyle;

  return (
    <div className="path-interaction-layer" onWheel={handleWheel}>
      <BackgroundTextTrack cardTrackY={cardTrackY} />
      <motion.div
        className="card-track"
        style={cardTrackStyle}
        drag="y"
        dragMomentum={false}
        dragElastic={0}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        tabIndex={0}
        role="list"
        aria-label="Path cards"
        onKeyDown={handleKeyDown}
      >
        {pathCards.map((card, index) => (
          <div
            key={card.id}
            className="path-card-slot"
            role="listitem"
            onClick={() => handleCardSelect(index)}
            style={{ top: `calc(50% + ${index * layout.cardStep}px)` }}
          >
            <PathCard
              card={card}
              index={index}
              cardStep={layout.cardStep}
              trackY={cardTrackY}
              onSelect={() => handleCardSelect(index)}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
