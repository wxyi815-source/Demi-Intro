export type TabId = "path" | "archive" | "words";

export type TabItem = {
  id: TabId;
  label: string;
};

export const tabs: TabItem[] = [
  { id: "path", label: "Path" },
  { id: "archive", label: "Archive" },
  { id: "words", label: "Words" }
];
