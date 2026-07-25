export interface Partner {
  name: string;
  label: string;
  address: string;
  icon: "spark" | "orbit" | "grid";
}

/** 本分支仅展示单家合作门店 */
export const PARTNERS: Partner[] = [
  {
    name: "法律书屋",
    label: "LAW BOOKSTORE",
    address: "薛城区武夷山路与深圳路交叉口南140米",
    icon: "spark",
  },
];
