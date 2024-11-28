
export const userAbality = [
  {
    key:1,
    label: "Browser",
  },
  {
    key:2,
    label: "Liked",
  },
  {
    key:3,
    label: "Marked",
  },
  {
    key:4,
    label: "Albums",
  },
  {
    key:5,
    label: "Slider",
  }
];
export const sidebarLinks = <{key:number,
  icon:string,
  iconsize:string,
  route: string,
  label: string,
  categorize:Array<"admin"|"premium">}[]>[
  {
    key:1,
    icon:"FaGlobeAsia",
    iconsize:"",
    route: "/",
    label: "Browser",
    categorize:[]
  },
  {
    key:2,
    icon:"BsHeartFill",
    route: "/liked",
    label: "Liked",
    categorize:[]
  },
  {
    key:3,
    icon:"BsBookmarkFill",
    route: "/marked",
    label: "Marked",
    categorize:[]
  },
  {
    key:4,
    icon:"FaCompactDisc",
    route: "/slider",
    label: "Slider",
    categorize:["admin"]
  }
];
export const sidebarSettingsLinks = [
  {
    key:0,
    icon:"FaHome",
    iconsize:"1.2rem",
    route: "/ ",
    label: "Home",
  },
  {
    key:1,
    icon:"IoPersonSharp",
    iconsize:"",
    route: "profile",
    label: "Profile",
  },
  {
    key:2,
    icon:"FaLock",
    route: "privite",
    label: "Privite",
  }
];
