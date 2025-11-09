import { useState } from "react";
import UsersAdmin from "./UsersAdmin";
import PersonasAdmin from "./PersonasAdmin";
import PerfilesAdmin from "./PerfilesAdmin";

export default function AdminTabs({ token }) {
  const [tab, setTab] = useState("usuarios");

  const renderTab = () => {
    switch (tab) {
      case "usuarios":
        return <UsersAdmin token={token} />;
      case "personas":
        return <PersonasAdmin token={token} />;
      case "perfiles":
        return <PerfilesAdmin token={token} />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: "usuarios", label: "Usuarios" },
    { id: "personas", label: "Personas" },
    { id: "perfiles", label: "Perfiles" },
  ];

  return (
    <div className="w-full">
      <div
        className="flex gap-2 mb-8 border-b-2"
        style={{ borderColor: "#E9E4D8" }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-6 py-3 font-medium transition-all duration-200 relative"
            style={{
              color: tab === t.id ? "#2E7D32" : "#8F9779",
              borderBottom: tab === t.id ? "3px solid #2E7D32" : "none",
              backgroundColor: tab === t.id ? "#FAFAF9" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (tab !== t.id) {
                e.target.style.color = "#A5D6A7";
              }
            }}
            onMouseLeave={(e) => {
              if (tab !== t.id) {
                e.target.style.color = "#8F9779";
              }
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 rounded-lg" style={{ backgroundColor: "#FAFAF9" }}>
        {renderTab()}
      </div>
    </div>
  );
}
