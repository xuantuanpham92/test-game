export interface Partner {
  name: string;
  label: string;
  address: string;
  icon: "spark" | "orbit" | "grid";
}

/** 本分支仅展示单家合作门店 */
export const PARTNERS: Partner[] = [
  {
    name: "龙门文艺书社",
    label: "LITERATURE & ARTS",
    address: "薛城区紫光园东门北140米",
    icon: "orbit",
  },
];
