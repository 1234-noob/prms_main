import React, { useEffect, useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  HelpIcon,
  WalletIcon,
  ContractIcon,
  PropertyIcon,
  TenantIcon,
  OrganizationIcon
} from "./icons";
import SidebarWidget from "./SidebarWidget";
import { useAuth } from "../../app/modules/auth/core/Auth";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Rental", path: "/", pro: false }],
  },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },

  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "404 Error", path: "/404", pro: false },
  //     { name: "Blank Page", path: "/blank", pro: false },
  //   ],
  // },
];

// const othersItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Manage",
//     subItems: [
//       { name: "Line Chart", path: "/line-chart", pro: false },
//       { name: "Bar Chart", path: "/bar-chart", pro: false },
//       { name: "Organizations", path: "/manage-organizations", pro: false },
//       { name: "Properties", path: "/manage-properties", pro: false },
//       { name: "Property Parts", path: "/manage-property-parts", pro: false },
//       { name: "My Units", path: "/my-units", pro: false },  
//       { name: "Make Payment", path: "/make-payment", pro: false },
//       { name: "Payment History", path: "/payment-history", pro: false },
//       { name: "View Contracts", path: "/view-contracts", pro: false },
//       { name: "Pending TDS Submissions", path: "/tds-pending", pro: false },
//       { name: "TDS History", path: "/tds-history", pro: false },
//       { name: "Tenants", path: "/manage-tenants", pro: false },
//       { name: "Tenant Payment History", path: "/tenant-payment-history", pro: false },
//     ],
//   },

//   {
//     icon: <BoxCubeIcon />,
//     name: "UI Elements",
//     subItems: [
//       { name: "Alerts", path: "/alerts", pro: false },
//       { name: "Avatar", path: "/avatars", pro: false },
//       { name: "Badge", path: "/badges", pro: false },
//       { name: "Buttons", path: "/buttons", pro: false },
//       { name: "Images", path: "/images", pro: false },
//       { name: "Videos", path: "/videos", pro: false },
//     ],
//   },
//   {
//     icon: <PlugInIcon />,
//     name: "Authentication",
//     subItems: [
//       { name: "Sign In", path: "/signin", pro: false },
//       { name: "Sign Up", path: "/signup", pro: false },
//     ],
//   },
// ];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Manage Organization",
    subItems: [
      { name: "Manage", path: "/manage-organizations", pro: false },
      // { name: "Bar Chart", path: "/bar-chart", pro: false },
      // { name: "Organizations", path: "/manage-organizations", pro: false },
      // { name: "Properties", path: "/manage-properties", pro: false },
      // { name: "Property Parts", path: "/manage-property-parts", pro: false },
      // { name: "My Units", path: "/my-units", pro: false },  
      // { name: "Make Payment", path: "/make-payment", pro: false },
      // { name: "Payment History", path: "/payment-history", pro: false },
      // { name: "View Contracts", path: "/view-contracts", pro: false },
      // { name: "Pending TDS Submissions", path: "/tds-pending", pro: false },
      // { name: "TDS History", path: "/tds-history", pro: false },
      // { name: "Tenants", path: "/manage-tenants", pro: false },
      // { name: "Tenant Payment History", path: "/tenant-payment-history", pro: false },
    ],
  },

  {
    icon: <BoxCubeIcon />,
    name: "Manage Property",
    subItems: [
      { name: "Properties", path: "/manage-properties", pro: false },
      { name: "Property Parts", path: "/manage-property-parts", pro: false },
      { name: "My Units", path: "/my-units", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Manage Tenants",
    subItems: [
      { name: "Tenants", path: "/manage-tenants", pro: false },
      { name: "Tenant Payment History", path: "/tenant-payment-history", pro: false },
    ],
  },
];

const superAdminItems: NavItem[]=[
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Rental", path: "/", pro: false }],
  },
  {
    icon: <OrganizationIcon />,
    name: "Organization Management",
    subItems: [
      { name: "List of Organizations", path: "/organizations-list", pro: false },
      { name: "Add/Suspend/Delete Organization", path: "/manage-organizations", pro: false },
     ],
  },
  {
    icon: <OrganizationIcon />,
    name: "Module Management",
    subItems: [
      { name: "Manage Modules", path: "/module-management", pro: false },
     ],
  }
]

const adminItems :NavItem[] = [
  {
    icon: <PropertyIcon />,
    name: "Property Management",
    subItems: [
      { name: "Add/Edit/Delete Properties", path: "/manage-properties", pro: false },
      { name: "Property Splitting", path: "/manage-property-parts", pro: false },
    ],
  },
  {
    icon: <TenantIcon />,
    name: "Tenant Management",
    subItems: [
      { name: "Add/View/Edit Tenants", path: "/manage-tenants", pro: false },
      { name: "Contract Management", path: "/manage-contract", pro: false },
      { name: "Payment History", path: "/payment-history", pro: false },
    ],
  },
  {
    icon: <ContractIcon />,
    name: "Contract & Rent Management",
    subItems: [
      { name: "Rental Agreements", path: "/rental-agreements", pro: false },
      { name: "Invoices", path: "/recurring-invoices", pro: false },
      { name: "Rent Adjustments & Renewals", path: "/rent-ajustments-renewals", pro: false },
      

    ],
  },
  {
    icon: <WalletIcon />,
    name: "Payment Tracking & TDS Management",
    subItems: [
      { name: "Payment Status", path: "/payment-status", pro: false },
      { name: "TDS Deductions & Reports", path: "/tds-deductions-reports", pro: false },
    ],
  },
  {
    icon: <WalletIcon />,
    name: "Hierarchy Management",
    subItems: [
      { name: "Hierarchy", path: "/hierarchy", pro: false },
    ],
  },

  {
    icon: <HelpIcon />,
    name: "Settings",
    subItems: [
        { "name": "Templates", "path": "/Invoice-Templates", "pro": false }
    ],
}
  
];

const tenantItems :NavItem[] = [
  {
    icon: <WalletIcon />,
    name: "Rent Payment",
    subItems: [
      { name: "Payment Methods", path: "/make-payment", pro: false },
      { name: "TDS Deduction", path: "/tds-deduction", pro: false },
      { name: "Payment Receipts", path: "/payment-receipts", pro: false },
    ],
  },
  {
    icon: <ContractIcon />,
    name: "Contract Details",
    subItems: [
      { name: "Contract Renewal Status", path: "/contract-renewal-status", pro: false },
    ],
  },
  {
    icon: <HelpIcon />,
    name: "Help & Support",
    subItems: [
      { name: "Raise Payment Disputes", path: "/raise-payment-disputes", pro: false },
      { name: "Maintenance Requests", path: "/maintenance-requests", pro: false },
      { name: "Contact Management", path: "/contact-management", pro: false },
    ],
  },
];
const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { currentUser } = useAuth();


  const menuItems = (() => {
    if (currentUser?.email === "superadmin@gmail.com") {
      return superAdminItems;
    } else if (currentUser?.email === "admin@gmail.com") {
      return adminItems;
    } else if (currentUser?.email === "tenant@gmail.com") {
      return tenantItems;
    } else {
      return []; // Default or fallback items if necessary
    }
  })();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : menuItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                } `}
            >
              <span
                className={`${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text ">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="https://dexpertsystems.in/assets/logo/web_icon.png"
                alt="Logo"
                width={50}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div> */}

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {
              renderMenuItems(menuItems, "others")}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
