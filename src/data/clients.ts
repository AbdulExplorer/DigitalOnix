export interface ClientLogo {
  id: string;
  name: string;
  symbol: "hexagon" | "diamond" | "circle-nodes" | "rings" | "triangle" | "cross" | "wave" | "cube";
  industry: string;
}

export const clientLogos: ClientLogo[] = Array.from({ length: 30 }, (_, index) => {
  const num = (index + 1).toString().padStart(2, "0");
  const symbols: ClientLogo["symbol"][] = [
    "hexagon",
    "diamond",
    "circle-nodes",
    "rings",
    "triangle",
    "cross",
    "wave",
    "cube",
  ];
  const industries = [
    "Retail",
    "Healthcare",
    "Hospitality",
    "Technology",
    "Real Estate",
    "Education",
    "E-Commerce",
    "Automotive",
  ];
  return {
    id: `client-${num}`,
    name: `Client ${num}`,
    symbol: symbols[index % symbols.length],
    industry: industries[index % industries.length],
  };
});

