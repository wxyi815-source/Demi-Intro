import type { TabId, TabItem } from "@/data/tabs";

type SidebarProps = {
  tabs: TabItem[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

export function Sidebar({ tabs, activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="identity">
        <div className="avatar-placeholder">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/avatar.jpg" alt="Demi" draggable={false} />
        </div>
        <h1>Demi</h1>
        <p>
          Welc
          <br />
          ome
          <br />
          To
          <br />
          Know
          <br />
          Me
        </p>
      </div>

      <nav className="tab-list" aria-label="Primary">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === activeTab ? "tab-button is-active" : "tab-button"}
            aria-pressed={tab.id === activeTab}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
