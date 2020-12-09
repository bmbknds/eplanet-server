const teacherMenu = [
  {
    path: "/dashboard/overview",
    name: "Dashboard",
    icon: "fas fa-chalkboard",
    exact: true,
    routes: [],
  },
];
const studentMenu = [
  {
    path: "/dashboard/class-info",
    name: "Theo dõi khoá học",
    icon: "fas fa-chalkboard-teacher",
    exact: true,
    routes: [],
  },
  {
    path: "/dashboard/account",
    name: "Thông tin chung",
    icon: "far fa-user-circle",
    exact: true,
    routes: [],
  },
  {
    path: "/dashboard/feedback-history",
    name: "Lịch sử phản hồi",
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
    name: "Khoá học",
    icon: "fab fa-leanpub",
    exact: true,
    routes: [
      {
        path: "/dashboard/cours/edit",
        name: "Chi tiết khoá học",
        icon: "fab fa-leanpub",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
      {
        path: "/dashboard/cours/add",
        name: "Thêm khoá học",
        icon: "fab fa-leanpub",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
    ],
  },
  {
    path: "/dashboard/teacher",
    name: "Giáo viên",
    icon: "fas fa-chalkboard-teacher",
    exact: true,
    routes: [
      {
        path: "/dashboard/teacher/edit",
        name: "Chi tiết giáo viên",
        icon: "fas fa-chalkboard-teacher",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
      {
        path: "/dashboard/teacher/add",
        name: "Thêm giáo viên",
        icon: "fas fa-chalkboard-teacher",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
    ],
  },
  {
    path: "/dashboard/student",
    name: "Học sinh",
    icon: "fas fa-user-graduate",
    exact: true,
    routes: [
      {
        path: "/dashboard/student/edit",
        name: "Chi tiết học sinh",
        icon: "fas fa-user-graduate",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
      {
        path: "/dashboard/student/add",
        name: "Thêm học sinh",
        icon: "fas fa-user-graduate",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
    ],
  },
  {
    path: "/dashboard/finance",
    name: "Tài chính",
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
    name: "Tham số hệ thống",
    icon: "fas fa-cogs",
    exact: true,
    routes: [],
  },
];

export { teacherMenu, studentMenu, adminMenu };
