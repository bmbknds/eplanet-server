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
    name: "Thông tin chung",
    icon: "far fa-user-circle",
    exact: true,
    routes: [],
  },
  {
    path: "/dashboard/student",
    name: "Học sinh",
    icon: "fas fa-user-graduate",
    exact: true,
    routes: [
      {
        path: "/dashboard/student/detail/:id",
        name: "Thông tin học sinh",
        icon: "fab fa-leanpub",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
    ],
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
  // {
  //   path: "/dashboard/account",
  //   name: "Thông tin chung",
  //   icon: "far fa-user-circle",
  //   exact: true,
  //   routes: [],
  // },
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
    path: "/dashboard/course",
    name: "Khoá học",
    icon: "fab fa-leanpub",
    exact: true,
    routes: [
      {
        path: "/dashboard/course/edit/:id",
        name: "Chi tiết khoá học",
        icon: "fab fa-leanpub",
        exact: true,
        routes: [],
        hideInMenu: true,
      },
      {
        path: "/dashboard/course/add",
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
        path: "/dashboard/teacher/edit/:id",
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
  // {
  //   path: "/dashboard/accounts",
  //   name: "Tài khoản",
  //   icon: "fas fa-user-graduate",
  //   exact: true,
  //   routes: [
  //     {
  //       path: "/dashboard/accounts/edit/:id",
  //       name: "Chi tiết tài khoản",
  //       icon: "fas fa-user-graduate",
  //       exact: true,
  //       routes: [],
  //       hideInMenu: true,
  //     },
  //     {
  //       path: "/dashboard/accounts/add",
  //       name: "Thêm tài khoản",
  //       icon: "fas fa-user-graduate",
  //       exact: true,
  //       routes: [],
  //       hideInMenu: true,
  //     },
  //   ],
  // },
  {
    path: "/dashboard/student",
    name: "Học sinh",
    icon: "fas fa-user-graduate",
    exact: true,
    routes: [
      {
        path: "/dashboard/student/edit/:id",
        name: "Chi tiết học sinh",
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
      //     path: '/dashboard/course/edit/:id',
      //     name: 'Course detail',
      //     icon: <ReadOutlined />,
      //     exact: true,
      //     routes: [],
      //     hideInMenu: true,
      //   },
      //   {
      //     path: '/dashboard/course/add',
      //     name: 'Add course',
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
