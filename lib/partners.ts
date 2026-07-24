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
    name: "金泽涮烤场",
    label: "DINING & GATHERING",
    address: "薛城区新城街道武夷山路东侧孵化园8厂房104室",
    photo: null,
    icon: "grid",
  },
];
