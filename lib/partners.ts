export interface Partner {
  name: string;
  label: string;
  address: string;
  icon: "spark" | "orbit" | "grid";
}

/** 本分支仅展示单家合作门店 */
export const PARTNERS: Partner[] = [
  {
    name: "九思教育",
    label: "EDUCATION SERVICES",
    address: "薛城区文景嘉园北区17号楼109门市",
    icon: "grid",
  },
];
