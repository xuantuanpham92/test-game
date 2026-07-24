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
    name: "龙门文艺书社",
    label: "LITERATURE & ARTS",
    address: "地址待补充",
    photo: null,
    icon: "orbit",
  },
];
