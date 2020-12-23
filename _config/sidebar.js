const pages = config('pages') // Get Pages from config

//E-commerce
export default [
  {
    title: 'qruleable.sidebar.adminGroup',
    icon: 'fas fa-ruler',
    children: [
      pages.qruleable.rules,
    ]
  }
]
