export interface Partner {
  name: string;
  label: string;
  address: string;
  icon: "spark" | "orbit" | "grid";
}

/** 本分支仅展示单家合作门店 */
export const PARTNERS: Partner[] = [
  {
    name: "铭宇文体超市",
    label: "STATIONERY & SPORTS",
    address: "薛城区永兴路与泰山中路交叉口东260米",
    icon: "orbit",
  },
];
