import { motion, MotionValue, useTransform } from "framer-motion";
import type { PathCard as PathCardData } from "@/data/pathCards";

type PathCardProps = {
  card: PathCardData;
  index: number;
  cardStep: number;
  trackY: MotionValue<number>;
  onSelect: () => void;
};

export function PathCard({ card, index, cardStep, trackY, onSelect }: PathCardProps) {
  const rotate = useTransform(trackY, (latest) => {
    const distanceFromCenter = Math.abs(latest + index * cardStep);
    const progress = Math.min(distanceFromCenter / cardStep, 1);
    return -10 + progress * 20;
  });

  return (
    <motion.article
      className="path-card"
      aria-label={card.id}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      style={{
        backgroundColor: card.placeholderColor,
        rotate
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="path-card-image" src={card.image} alt="" draggable={false} />
    </motion.article>
  );
}
