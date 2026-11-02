export interface AgencyStat {
  id: string;
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

export const agencyStats: AgencyStat[] = [
  {
    id: "projects",
    value: 1000,
    suffix: "+",
    label: "Projects Delivered",
  },
  {
    id: "clients",
    value: 250,
    suffix: "+",
    label: "Clients Served",
  },
  {
    id: "adspend",
    value: 10,
    prefix: "₹",
    suffix: " Lakh+",
    label: "Meta Ad Spend",
  },
];
