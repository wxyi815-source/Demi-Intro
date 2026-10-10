import { motion, MotionValue, useTransform } from "framer-motion";

type BackgroundTextTrackProps = {
  cardTrackY: MotionValue<number>;
};

const BACKGROUND_COPIES = Array.from({ length: 12 }, (_, index) => `bg-${index}`);

export function BackgroundTextTrack({ cardTrackY }: BackgroundTextTrackProps) {
  const backgroundY = useTransform(cardTrackY, (latest) => -latest);

  return (
    <motion.div className="background-track" style={{ y: backgroundY }} aria-hidden="true">
      {BACKGROUND_COPIES.map((copyId) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={copyId}
          className="background-svg"
          src="/assets/path-background.svg"
          alt=""
          draggable={false}
        />
      ))}
    </motion.div>
  );
}
