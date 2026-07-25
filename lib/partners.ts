export interface Partner {
  name: string;
  label: string;
  address: string;
  icon: "spark" | "orbit" | "grid";
}

/** 本分支仅展示单家合作门店 */
export const PARTNERS: Partner[] = [
  {
    name: "青北书城",
    label: "CAMPUS BOOKSTORE",
    address: "薛城区黄河路111号天穹·星朗苑",
    icon: "spark",
  },
];
