export interface Partner {
  name: string;
  label: string;
  address: string;
  /** 门头照片路径，放在 public/partners/ 目录下 */
  photo: string | null;
  icon: "spark" | "orbit" | "grid";
}

/** 本分支仅展示单家合作门店 */
export const PARTNERS: Partner[] = [
  {
    name: "九思教育",
    label: "EDUCATION SERVICES",
    address: "薛城区文景嘉园北区17号楼109门市",
    photo: null,
    icon: "grid",
  },
];
