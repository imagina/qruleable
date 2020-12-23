export default {
  rules: {
    permission: 'ruleable.rules.index',
    activated: true,
    path: '/rules',
    name: 'qruleable.admin.rules.index',
    page: () => import('../_pages/admin/rules/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qruleable.sidebar.adminRules',
    icon: 'fas fa-ruler',
    authenticated: true,
    subHeader:{
      refresh: true,
    }
  },
  rulesCreate: {
    permission: 'ruleable.rules.create',
    activated: true,
    path: '/rules/create',
    name: 'qruleable.admin.rules.create',
    page: () => import('../_pages/admin/rules/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qruleable.sidebar.createRules',
    icon: 'fas fa-ruler',
    authenticated: true,
    subHeader:{
      breadcrumb: ['qruleable.rules']
    }
  },
  rulesEdit: {
    permission: 'ruleable.rules.edit',
    activated: true,
    path: '/rules/:id',
    name: 'qruleable.admin.rules.edit',
    page: () => import('../_pages/admin/rules/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qruleable.sidebar.editRules',
    icon: 'fas fa-ruler',
    authenticated: true,
    subHeader:{
      breadcrumb: ['qruleable.rules'],
      refresh: true,
    }
  },
}
