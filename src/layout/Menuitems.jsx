import {
  LayoutDashboard,
  User,
  Users,
  FileText,
  FilePlus2,
  ClipboardList,
} from "lucide-react";

const Menuitems = (userTypeId) => {
  const items = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/home",
    },
    {
      id: "master",
      title: "Master",
      icon: User,
      href: "/products",
    },
    {
      id: "users",
      title: "Users",
      icon: Users,
      href: "/user-team",
    },
    {
      id: "create-order",
      title: "Create Order",
      icon: FilePlus2,
      href: "/create-order",
    },
    // {
    //   id: "order-list",
    //   title: "Order List",
    //   icon: ClipboardList,
    //   href: "/order-list-nav",
    // },
    {
      id: "quotations",
      title: "Quotations",
      icon: FileText,
      href: "/quotations",
    },
    {
      id: "report",
      title: " Report",
      icon: FileText,
      href: "/product-report",
    },
  ];

  return items;
};

export default Menuitems;
