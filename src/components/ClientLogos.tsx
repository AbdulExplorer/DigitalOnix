import React from "react";
import { clientLogos, ClientLogo } from "@/data/clients";

function renderSymbol(symbol: ClientLogo["symbol"]) {
  switch (symbol) {
    case "hexagon":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 22 12 12 22 2 12 12 2" />
        </svg>
      );
    case "circle-nodes":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <circle cx="19" cy="5" r="2" />
          <circle cx="5" cy="19" r="2" />
          <line x1="12" y1="9" x2="19" y2="7" />
          <line x1="12" y1="15" x2="5" y2="17" />
        </svg>
      );
    case "rings":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="12" r="6" />
          <circle cx="15" cy="12" r="6" />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 3 22 20 2 20 12 3" />
        </svg>
      );
    case "cross":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="3" width="6" height="18" rx="1" />
          <rect x="3" y="9" width="18" height="6" rx="1" />
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12c3-4 6-4 9 0s6 4 9 0" />
        </svg>
      );
    case "cube":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 22 7 22 17 12 22 2 17 2 7 12 2" />
          <line x1="12" y1="12" x2="12" y2="22" />
          <line x1="12" y1="12" x2="22" y2="7" />
          <line x1="12" y1="12" x2="2" y2="7" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export function ClientLogos() {
  const duplicatedLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="logos-section" aria-label="Brand Partners">
      <div className="container">
        <div className="logos-heading-wrap">
          <span className="logos-label">
            Trusted by 250+ Growing Brands
          </span>
        </div>
      </div>

      <div className="marquee-outer-container">
        <div className="marquee-inner-strip" role="list">
          {duplicatedLogos.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="logo-badge"
              role="listitem"
            >
              <div className="logo-symbol" aria-hidden="true">
                {renderSymbol(client.symbol)}
              </div>
              <span className="logo-text">{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
