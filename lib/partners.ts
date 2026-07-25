export interface Partner {
  name: string;
  label: string;
  address: string;
  icon: "spark" | "orbit" | "grid";
}

/** 本分支仅展示单家合作门店 */
export const PARTNERS: Partner[] = [
  {
    name: "金泽涮烤场",
    label: "DINING & GATHERING",
    address: "薛城区新城街道武夷山路东侧孵化园8厂房104室",
    icon: "grid",
  },
];
