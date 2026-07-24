export interface Partner {
  name: string;
  label: string;
  address: string;
  /** 门头照片路径，放在 public/partners/ 目录下，如 /partners/qingbei.jpg */
  photo: string | null;
  icon: "spark" | "orbit" | "grid";
}

/** 主站展示全部 7 家合作店铺（各分支会覆盖此列表为单店） */
export const PARTNERS: Partner[] = [
  {
    name: "青北书城",
    label: "CAMPUS BOOKSTORE",
    address: "地址待补充",
    photo: null,
    icon: "spark",
  },
  {
    name: "龙门文艺书社",
    label: "LITERATURE & ARTS",
    address: "地址待补充",
    photo: null,
    icon: "orbit",
  },
  {
    name: "金泽涮烤场",
    label: "DINING & GATHERING",
    address: "地址待补充",
    photo: null,
    icon: "grid",
  },
  {
    name: "法律书屋",
    label: "LAW BOOKSTORE",
    address: "地址待补充",
    photo: null,
    icon: "spark",
  },
  {
    name: "铭宇文体超市",
    label: "STATIONERY & SPORTS",
    address: "地址待补充",
    photo: null,
    icon: "orbit",
  },
  {
    name: "九思教育",
    label: "EDUCATION SERVICES",
    address: "地址待补充",
    photo: null,
    icon: "grid",
  },
  {
    name: "想象力智能学业规划",
    label: "ACADEMIC PLANNING",
    address: "地址待补充",
    photo: null,
    icon: "spark",
  },
];
