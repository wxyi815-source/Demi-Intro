export type ArchiveItemId = "coffee" | "music" | "photograph" | "exhibition";

export type ArchiveItem = {
  id: ArchiveItemId;
  title: string;
  titleImage?: string;
  image?: string;
};

export const musicRecords = [
  "./assets/archive/music/record-1.png",
  "./assets/archive/music/record-2.png",
  "./assets/archive/music/record-3.png",
  "./assets/archive/music/record-4.png",
  "./assets/archive/music/record-5.png"
];

export const archiveItems: ArchiveItem[] = [
  {
    id: "coffee",
    title: "Coffee",
    titleImage: "./assets/archive/coffee-title.svg",
    image: "./assets/archive/coffee.jpg"
  },
  {
    id: "music",
    title: "Music",
    titleImage: "./assets/archive/music/music-title.svg"
  },
  {
    id: "photograph",
    title: "Photograph",
    titleImage: "./assets/archive/photograph/photography-title.png",
    image: "./assets/archive/photograph/photos.png"
  },
  {
    id: "exhibition",
    title: "Exhibition",
    titleImage: "./assets/archive/exhibition/exhibition-title.png"
  }
];
