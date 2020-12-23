const teacherMenu = [
  {
    path: "/dashboard/overview",
    name: "Dashboard",
    icon: "fas fa-chalkboard",
    exact: true,
    routes: [],
  },
  {
    path: "/dashboard/account",
    name: "Account",
    icon: "far fa-user-circle",
    exact: true,
    routes: [],
  },
];
const studentMenu = [
  {
    path: "/dashboard/class-info",
    name: "Classes information",
    icon: "fas fa-chalkboard-teacher",
    exact: true,
    routes: [],
  },
  {
    path: "/dashboard/account",
    name: "Account",
    icon: "far fa-user-circle",
    exact: true,
    routes: [],
  },
  {
    path: "/dashboard/feedback-history",
    name: "Feedback history",
    icon: "far fa-comments",
    exact: true,
    routes: [],
  },
];
const adminMenu = [
  {
    path: "/dashboard/overview",
    name: "Dashboard",
    icon: "fas fa-chalkboard",
    exact: true,
    routes: [],
  },
  {
    path: "/dashboard/cours",
    name: "Cours",
    icon: "fab fa-leanpub",
    exact: true,
    routes: [
      {
        path: "/dashboard/cours/edit",
        name: "Cours detail",
        icon: "fab fa-leanpub",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
      {
        path: "/dashboard/cours/add",
        name: "Add cours",
        icon: "fab fa-leanpub",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
    ],
  },
  {
    path: "/dashboard/teacher",
    name: "Teacher",
    icon: "fas fa-chalkboard-teacher",
    exact: true,
    routes: [
      {
        path: "/dashboard/teacher/edit",
        name: "Teacher detail",
        icon: "fas fa-chalkboard-teacher",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
      {
        path: "/dashboard/teacher/add",
        name: "Add Teacher",
        icon: "fas fa-chalkboard-teacher",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
    ],
  },
  {
    path: "/dashboard/student",
    name: "Student",
    icon: "fas fa-user-graduate",
    exact: true,
    routes: [
      {
        path: "/dashboard/student/edit",
        name: "Student detail",
        icon: "fas fa-user-graduate",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
      {
        path: "/dashboard/student/add",
        name: "Add student",
        icon: "fas fa-user-graduate",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
    ],
  },
  {
    path: "/dashboard/finance",
    name: "Finance",
    icon: "fas fa-donate",
    exact: true,
    routes: [
      //   {
      //     path: '/dashboard/cours/edit',
      //     name: 'Cours detail',
      //     icon: <ReadOutlined />,
      //     exact: true,
      //     routes: [],
      //     hideInMenu: true,
      //   },
      //   {
      //     path: '/dashboard/cours/add',
      //     name: 'Add cours',
      //     icon: <ReadOutlined />,
      //     exact: true,
      //     routes: [],
      //     hideInMenu: true,
      //   },
    ],
  },
  {
    path: "/dashboard/system-config",
    name: "System-config",
    icon: "fas fa-cogs",
    exact: true,
    routes: [],
  },
];

export { teacherMenu, studentMenu, adminMenu };
