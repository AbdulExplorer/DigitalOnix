
"use client";

import React, { useMemo } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { AdminClient } from "@/types/admin";

function renderSymbol(symbol: AdminClient["symbol"]) {
  const props = {
    viewBox: "0 0 24 24",
    width: 44,
    height: 44,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (symbol) {
    case "hexagon":
      return <svg {...props}><polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" /></svg>;

    case "diamond":
      return <svg {...props}><polygon points="12 2 22 12 12 22 2 12 12 2" /></svg>;

    case "circle-nodes":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <circle cx="19" cy="5" r="2" />
          <circle cx="5" cy="19" r="2" />
          <line x1="12" y1="9" x2="19" y2="7" />
          <line x1="12" y1="15" x2="5" y2="17" />
        </svg>
      );

    case "rings":
      return (
        <svg {...props}>
          <circle cx="9" cy="12" r="6" />
          <circle cx="15" cy="12" r="6" />
        </svg>
      );

    case "triangle":
      return <svg {...props}><polygon points="12 3 22 20 2 20 12 3" /></svg>;

    case "cross":
      return (
        <svg {...props}>
          <rect x="9" y="3" width="6" height="18" rx="1" />
          <rect x="3" y="9" width="18" height="6" rx="1" />
        </svg>
      );

    case "wave":
      return <svg {...props}><path d="M2 12c3-4 6-4 9 0s6 4 9 0" /></svg>;

    case "cube":
      return (
        <svg {...props}>
          <polygon points="12 2 22 7 22 17 12 22 2 17 2 7 12 2" />
          <line x1="12" y1="12" x2="12" y2="22" />
          <line x1="12" y1="12" x2="22" y2="7" />
          <line x1="12" y1="12" x2="2" y2="7" />
        </svg>
      );

    default:
      return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

function LogoItem({
  client,
  duplicate = false,
}: {
  client: AdminClient;
  duplicate?: boolean;
}) {
  return (
    <div
      className="client-logo-card"
      role={duplicate ? undefined : "listitem"}
      title={client.name}
    >
      <div className="client-logo-image">
        {client.logoUrl ? (
          <>
            <img
              src={client.logoUrl}
              alt={duplicate ? "" : `${client.name} logo`}
              loading="lazy"
              decoding="async"
              draggable={false}
              onError={(event) => {
                event.currentTarget.style.display = "none";

                const fallback =
                  event.currentTarget.parentElement?.querySelector(
                    ".client-logo-fallback"
                  );

                if (fallback) {
                  (fallback as HTMLElement).style.display = "flex";
                }
              }}
            />

            <div className="client-logo-fallback" style={{ display: "none" }}>
              {renderSymbol(client.symbol)}
            </div>
          </>
        ) : (
          <div className="client-logo-fallback">
            {renderSymbol(client.symbol)}
          </div>
        )}
      </div>

      <span className="client-logo-name">{client.name}</span>
    </div>
  );
}

export function ClientLogos() {
  const { clients } = useAdminData();

  const activeClients = useMemo(
    () => clients.filter((client) => client.status === "active"),
    [clients]
  );

  // Repeat the source list enough times to avoid empty gaps
  // when the original client list is relatively small.
  const marqueeClients = useMemo(() => {
    if (activeClients.length === 0) return [];

    const result = [...activeClients];

    while (result.length < 12) {
      result.push(...activeClients);
    }

    return result;
  }, [activeClients]);

  if (activeClients.length === 0) return null;

  return (
    <section className="logos-section" aria-label="Our clients">
      <div className="container">
        <div className="logos-header">
          <div className="logos-heading-content">
            <span className="logos-eyebrow">OUR CLIENTS</span>

            <h2 className="logos-title">
              Trusted by <span>250+ growing brands.</span>
            </h2>

            <p className="logos-description">
              Businesses that trust us to move their brands forward.
            </p>
          </div>
        </div>
      </div>

      <div className="logos-marquee">
        <div className="logos-marquee-track">
          {/* First group */}
          <div className="logos-marquee-group" role="list" aria-label="Client brands">
            {marqueeClients.map((client, index) => (
              <LogoItem
                key={`first-${client.id}-${index}`}
                client={client}
              />
            ))}
          </div>

          {/* Identical second group creates the seamless loop */}
          <div className="logos-marquee-group" aria-hidden="true">
            {marqueeClients.map((client, index) => (
              <LogoItem
                key={`second-${client.id}-${index}`}
                client={client}
                duplicate
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
