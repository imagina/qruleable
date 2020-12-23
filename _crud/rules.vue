<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
          apiRoute: 'apiRoutes.qruleable.rules',
          permission: 'ruleable.rules',
          extraFormFields: 'crud-fields.ruleable.rules',
          create: {
            title: this.$tr('qruleable.layout.newRule'),
            to: {name: 'qruleable.admin.rules.create'}
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', align: 'left'},
              {name: 'name', label: this.$tr('ui.form.name'), field: 'name', align: 'left'},
              {name: 'createdAt', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left', format: val => this.$trd(val)},
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'right'},
            ],
            requestParams: {},
            filters: {},
          },
          update: {
            to : 'qruleable.admin.rules.edit'
          },
          delete: true,
          formLeft: {},
        }
      }
    }
  }
</script>
