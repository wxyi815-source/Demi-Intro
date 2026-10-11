"use client";

import { useState } from "react";
import { ArchivePage } from "@/components/ArchivePage";
import { PathPage } from "@/components/PathPage";
import { Sidebar } from "@/components/Sidebar";
import { WordsPage } from "@/components/WordsPage";
import { tabs, type TabId } from "@/data/tabs";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("path");

  return (
    <main className="site-shell">
      <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <section className="content-stage" aria-label={`${activeTab} content`}>
        {activeTab === "path" ? <PathPage /> : null}
        {activeTab === "archive" ? <ArchivePage /> : null}
        {activeTab === "words" ? <WordsPage /> : null}
      </section>
    </main>
  );
}
