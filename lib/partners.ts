export interface Partner {
  name: string;
  label: string;
  address: string;
  icon: "spark" | "orbit" | "grid";
}

/** 主站展示全部 7 家合作店铺（各分支会覆盖此列表为单店） */
export const PARTNERS: Partner[] = [
  {
    name: "青北书城",
    label: "CAMPUS BOOKSTORE",
    address: "薛城区黄河路111号天穹·星朗苑",
    icon: "spark",
  },
  {
    name: "龙门文艺书社",
    label: "LITERATURE & ARTS",
    address: "薛城区紫光园东门北140米",
    icon: "orbit",
  },
  {
    name: "金泽涮烤场",
    label: "DINING & GATHERING",
    address: "薛城区新城街道武夷山路东侧孵化园8厂房104室",
    icon: "grid",
  },
  {
    name: "法律书屋",
    label: "LAW BOOKSTORE",
    address: "薛城区武夷山路与深圳路交叉口南140米",
    icon: "spark",
  },
  {
    name: "铭宇文体超市",
    label: "STATIONERY & SPORTS",
    address: "薛城区永兴路与泰山中路交叉口东260米",
    icon: "orbit",
  },
  {
    name: "九思教育",
    label: "EDUCATION SERVICES",
    address: "薛城区文景嘉园北区17号楼109门市",
    icon: "grid",
  },
  {
    name: "想象力智能学业规划",
    label: "ACADEMIC PLANNING",
    address: "薛城区-中和路中和嘉园-东区",
    icon: "spark",
  },
];
