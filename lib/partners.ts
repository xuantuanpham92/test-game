export interface Partner {
  name: string;
  label: string;
  address: string;
  icon: "spark" | "orbit" | "grid";
}

/** 本分支仅展示单家合作门店 */
export const PARTNERS: Partner[] = [
  {
    name: "想象力智能学业规划",
    label: "ACADEMIC PLANNING",
    address: "薛城区-中和路中和嘉园-东区",
    icon: "spark",
  },
];
