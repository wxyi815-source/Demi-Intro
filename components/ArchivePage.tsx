"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { archiveItems, musicRecords, type ArchiveItem } from "@/data/archiveItems";

const MUSIC_RECORD_INTERVAL = 2250;
const MUSIC_RECORD_PULL_DELAY = 420;
const MUSIC_RECORD_PULL_DURATION = 1040;

const exhibitionImages = [
  {
    id: "opening",
    src: "./assets/archive/exhibition/image-1.jpg",
    alt: "Exhibition opening",
    collapsed: { top: "35.833333vh", left: "20.4%", width: "13.5%", zIndex: 5 },
    expanded: { top: "8.333333vh", left: "20.4%", width: "13.5%", zIndex: 4 }
  },
  {
    id: "poster",
    src: "./assets/archive/exhibition/image-2.jpg",
    alt: "Exhibition poster",
    collapsed: { top: "37.592593vh", left: "20.4%", width: "16.6%", zIndex: 2 },
    expanded: { top: "24.907407vh", left: "20.4%", width: "16.6%", zIndex: 4 }
  },
  {
    id: "gallery",
    src: "./assets/archive/exhibition/image-3.png",
    alt: "Gallery scenes",
    collapsed: { top: "39.259259vh", left: "31.6%", width: "26.8%", zIndex: 4 },
    expanded: { top: "45.092593vh", left: "20.4%", width: "36.7%", zIndex: 4 }
  },
  {
    id: "room",
    src: "./assets/archive/exhibition/image-4.jpg",
    alt: "Museum room",
    collapsed: { top: "53.703704vh", left: "20.4%", width: "12.0%", zIndex: 3 },
    expanded: { top: "71.574074vh", left: "20.4%", width: "12.0%", zIndex: 4 }
  }
];

const getRecordPosition = (index: number, activeIndex: number, outgoingIndex: number | null) => {
  if (index === outgoingIndex) {
    return {
      opacity: 1,
      scale: 0.985,
      x: 42,
      y: -10,
      rotate: 4,
      zIndex: 8
    };
  }

  const distance = (index - activeIndex + musicRecords.length) % musicRecords.length;

  if (distance === 0) {
    return {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      zIndex: 5
    };
  }

  if (distance === 1) {
    return {
      opacity: 1,
      scale: 0.988,
      x: 7,
      y: -10,
      rotate: 1.2,
      zIndex: 4
    };
  }

  if (distance === 2) {
    return {
      opacity: 1,
      scale: 0.976,
      x: -7,
      y: -18,
      rotate: -1.3,
      zIndex: 3
    };
  }

  if (distance === 3) {
    return {
      opacity: 1,
      scale: 0.964,
      x: 8,
      y: -26,
      rotate: 1.5,
      zIndex: 2
    };
  }

  return {
    opacity: 1,
    scale: 0.952,
    x: -8,
    y: -34,
    rotate: -1.6,
    zIndex: 1
  };
};

function CoffeeArchive({ item }: { item: ArchiveItem }) {
  return (
    <article className="archive-feature-card" aria-label={item.title}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="archive-title-image" src={item.titleImage} alt={item.title} draggable={false} />
      <div className="archive-photo-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="archive-photo" src={item.image} alt="" draggable={false} />
      </div>
    </article>
  );
}

function MusicArchive({ item }: { item: ArchiveItem }) {
  const prefersReducedMotion = useReducedMotion();
  const [activeRecord, setActiveRecord] = useState(0);
  const [outgoingRecord, setOutgoingRecord] = useState<number | null>(null);
  const activeRecordRef = useRef(0);
  const isCyclingRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timers: number[] = [];
    const cycleRecord = () => {
      if (isCyclingRef.current) {
        return;
      }

      const current = activeRecordRef.current;
      const next = (current + 1) % musicRecords.length;
      isCyclingRef.current = true;
      setOutgoingRecord(current);

      timers.push(
        window.setTimeout(() => {
          activeRecordRef.current = next;
          setActiveRecord(next);
        }, MUSIC_RECORD_PULL_DELAY)
      );

      timers.push(
        window.setTimeout(() => {
          setOutgoingRecord(null);
          isCyclingRef.current = false;
        }, MUSIC_RECORD_PULL_DURATION)
      );
    };

    const timer = window.setInterval(() => {
      cycleRecord();
    }, MUSIC_RECORD_INTERVAL);

    return () => {
      window.clearInterval(timer);
      timers.forEach((queuedTimer) => window.clearTimeout(queuedTimer));
    };
  }, [prefersReducedMotion]);

  return (
    <article className="music-archive" aria-label={item.title}>
      <div className="music-record-stage" aria-label="Music records">
        {musicRecords.map((record, index) => {
          const position = getRecordPosition(index, activeRecord, outgoingRecord);

          return (
            <motion.img
              key={record}
              className="music-record"
              src={record}
              alt=""
              draggable={false}
              animate={position}
              transition={{
                type: "spring",
                stiffness: prefersReducedMotion ? 1000 : 165,
                damping: prefersReducedMotion ? 120 : 24,
                mass: prefersReducedMotion ? 0.2 : 0.9
              }}
            />
          );
        })}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="music-box" src="./assets/archive/music/box.jpg" alt="" draggable={false} />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="music-title-image" src={item.titleImage} alt={item.title} draggable={false} />
    </article>
  );
}

function PhotographArchive({ item }: { item: ArchiveItem }) {
  return (
    <article className="photograph-archive" aria-label={item.title}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="photograph-title-image" src={item.titleImage} alt={item.title} draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="photograph-grid-image" src={item.image} alt="" draggable={false} />
    </article>
  );
}

function ExhibitionArchive({ item }: { item: ArchiveItem }) {
  const prefersReducedMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="exhibition-archive" aria-label={item.title}>
      <motion.img
        className="exhibition-title-image"
        src={item.titleImage}
        alt={item.title}
        draggable={false}
        animate={{ opacity: isExpanded ? 0 : 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: "easeOut" }}
      />

      <div className={isExpanded ? "exhibition-layout is-expanded" : "exhibition-layout"}>
        {exhibitionImages.map((image) => (
          <motion.button
            key={image.id}
            type="button"
            className="exhibition-image-button"
            aria-label={`Open ${image.alt}`}
            onClick={() => setIsExpanded(true)}
            animate={isExpanded ? image.expanded : image.collapsed}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.82,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="" draggable={false} />
          </motion.button>
        ))}
      </div>

      <motion.div
        className={isExpanded ? "exhibition-copy is-visible" : "exhibition-copy"}
        aria-hidden={!isExpanded}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.72, delay: prefersReducedMotion ? 0 : 0.34 }}
      >
        <section className="exhibition-copy-group exhibition-copy-osaka">
          <div className="exhibition-label exhibition-label-yellow">2025大阪世博会</div>
        </section>

        <section className="exhibition-copy-group exhibition-copy-zju">
          <p>盛世修典：《中国历代绘画大系》成果展</p>
          <div className="exhibition-label exhibition-label-yellow">浙大X国博</div>
        </section>

        <section className="exhibition-copy-group exhibition-copy-ningbo">
          <p>湖山远旅——中国山水图像的现代演绎</p>
          <div className="exhibition-label exhibition-label-teal">宁波美术馆</div>
        </section>

        <section className="exhibition-copy-group exhibition-copy-zhejiang">
          <p>面容与印迹——维姆·文德斯与罗伯特·博西西奥影像绘画双人展</p>
          <div className="exhibition-label exhibition-label-olive">浙江美术馆</div>
        </section>
      </motion.div>
    </article>
  );
}

function ArchivePlaceholder({ item }: { item: ArchiveItem }) {
  return (
    <article className="archive-placeholder" aria-label={item.title}>
      <p>{item.title}</p>
    </article>
  );
}

function ArchiveContent({ item }: { item: ArchiveItem }) {
  if (item.id === "coffee") {
    return <CoffeeArchive item={item} />;
  }

  if (item.id === "music") {
    return <MusicArchive item={item} />;
  }

  if (item.id === "photograph") {
    return <PhotographArchive item={item} />;
  }

  if (item.id === "exhibition") {
    return <ExhibitionArchive item={item} />;
  }

  return <ArchivePlaceholder item={item} />;
}

export function ArchivePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = archiveItems[activeIndex];

  const goPrevious = () => {
    setActiveIndex((current) => (current - 1 + archiveItems.length) % archiveItems.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % archiveItems.length);
  };

  return (
    <div className="archive-page" aria-label={`Archive ${activeItem.title}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="archive-map" src="./assets/archive/archive-grid.jpg" alt="" draggable={false} />

      <div className="archive-dots" aria-hidden="true">
        {archiveItems.map((item, index) => (
          <span key={item.id} className={index === activeIndex ? "is-active" : ""} />
        ))}
      </div>

      <button className="archive-arrow archive-arrow-left" type="button" aria-label="Previous archive" onClick={goPrevious}>
        <span aria-hidden="true" />
      </button>

      <ArchiveContent item={activeItem} />

      <button className="archive-arrow archive-arrow-right" type="button" aria-label="Next archive" onClick={goNext}>
        <span aria-hidden="true" />
      </button>
    </div>
  );
}
