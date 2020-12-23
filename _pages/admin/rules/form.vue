<template>
  <div id="pageId" class="q-layout-page layout-padding">

    <div class="relative-position q-mb-lg backend-page">
      <div class="box">
        <q-form @submit="$route.params.id ? updateItem() : createItem()" ref="formContent"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))"
                class="row q-col-gutter-x-md" autocomplete="off">
          <!-- Left Form -->
          <div class="col-md-6">
            <!--name-->
            <q-input v-model="form.name" type="text" outlined dense
                     :label="`${$tr('ui.form.name')}*`" :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
            />
            <q-select outlined dense bg-color="white" v-model="form.type"
                      :label="`${$tr('qruleable.layout.form.type')}*`" style="width: 100%;"
                      :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                      emit-value map-options :options="ruleTypes" @blur="selectRuleData" />
          </div>

          <!-- Right Form -->
          <div class="col-md-6">
            <q-select outlined dense bg-color="white" v-model="form.status"
                      :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                      :label="`${$tr('ui.form.status')}*`" style="width: 100%;"
                      emit-value map-options :options="[
                        {label: $tr('ui.label.enabled'), value: 1},
                        {label: $tr('ui.label.disabled'), value: 0},
                      ]"/>
          </div>
          <div v-for="(rule, key) in rules" :class="rule.cols || 'col-12'">
              <!--Dynamic field-->
              <dynamic-field v-if="rule.isFakeField===false" v-model="form.values[rule.name || key]" :key="key"
                             :field="{...rule, testId : (rule.testId  || rule.name || key)}"
                             :ref="`field-${rule.name || key}`" :isFakefield="true" />
              <!--Dynamic fake field-->
              <dynamic-field v-else v-model="form.values[rule.isFakeField || 'options'][rule.name || key]"
                             :key="key"
                             :field="{...rule, testId : (rule.testId || rule.name || key)}"
                             :ref="`field-${rule.isFakeField || 'options'}-${rule.name || key}`" :isFakefield="true" />
          </div>
          <q-page-sticky
            position="bottom-right"
            :offset="[18, 18]">
            <!--Update button-->
            <q-btn v-if="$route.params.id" color="positive" :loading="loading"
                   icon="fas fa-edit" :label="$tr('ui.label.update')" type="submit"/>
            <!--Save button-->
            <q-btn v-else color="positive" :loading="loading" icon="fas fa-edit"
                   :label="$tr('ui.label.create')" type="submit"/>
          </q-page-sticky>
        </q-form>
        <inner-loading :visible="loading"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        types: [],
        ruleTypes: [],
        rules:[],
        ruleData: [],
        form: {
          id: '',
          type: null,
          name: '',
          values: {},
          status: null,
        },
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.initForm()
      })
    },
    methods: {
      initForm () {
        this.$root.$on('page.data.refresh', () => this.getData(true))
        this.getData()
      },
      getData (refresh = false) {
        this.loading = true
        let params = {
          refresh: refresh,
          params: {}
        }
        if (this.$route.params.id){
          this.$crud.show('apiRoutes.qruleable.rules', this.$route.params.id, params)
            .then(response => {
                Object.assign(this.form, {...response.data})
                setTimeout(() => {
                  this.getDataFromConfig()
                  this.loading = false
                }, 1000)
            }).catch(error => {
              this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
              this.loading = false
            })
        }else{
          this.getDataFromConfig()
          this.loading = false
        }
      },
      getDataFromConfig(){
        let params = {
          refresh: true,
          params: {}
        }
        this.ruleTypes = [];
        this.$crud.index('apiRoutes.qruleable.fromConfig', params)
          .then(response => {
            let rules = response.data
            this.ruleData = this.$clone(rules)
            for(let x in this.ruleData){
              this.ruleTypes.push({label: this.ruleData[x].label, value: x})
            }
            if(this.$route.params.id)
              this.selectRuleData()
          }).catch(error => {
            console.error(error)
            this.$alert.error({ message: this.$tr('ui.message.errorRequest'), pos: 'bottom' })
          })
      },
      selectRuleData() {
        let ruleData = this.ruleData[this.form.type]
        this.rules = this.$clone(ruleData.values)
        if(Object.keys(this.form.values).length === 0) {
          for (let x in ruleData.values) {
            if (!this.form.values[ruleData.values[x].name]) {
              if (ruleData.values[x].isFakeField === false) {
                this.form.values[ruleData.values[x].name] = null
              } else {
                if(!this.form.values[ruleData.values[x].isFakeField]) {
                  this.form.values[ruleData.values[x].isFakeField] = {}
                }
                if(!this.form.values[ruleData.values[x].isFakeField][ruleData.values[x].name]) {
                  this.form.values[ruleData.values[x].isFakeField][ruleData.values[x].name] = null
                }
              }
            }
          }
        }
      },
      createItem () {
        this.loading = true
        this.$crud.create('apiRoutes.qruleable.rules', this.form)
          .then(response => {
            this.loading = false
            this.$router.push({ name: 'qruleable.admin.rules.index' })
            this.$alert.success({ message: `${this.$tr('ui.message.recordCreated')} ID: ${response.data.id}` })
          })
          .catch(error => {
            this.loading = false
            this.$alert.error({ message: this.$tr('ui.message.recordNoCreatde'), pos: 'bottom' })
          })
      },
      updateItem () {
        this.loading = true
        this.$crud.update('apiRoutes.qruleable.rules', this.form.id, this.form)
          .then(response => {
            this.loading = false
            this.$router.push({ name: 'qruleable.admin.rules.index' })
            this.$alert.success({ message: `${this.$tr('ui.message.recordUpdated')}` })
            this.initForm()
          })
          .catch(error => {
            this.loading = false
            this.$alert.error({ message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom' })
          })
      },
      generateCoupon () {
        this.form.code = this.makeCouponCode(20).toUpperCase()
      },
      makeCouponCode (length = 10) {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let charactersLength = characters.length
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
      },
    }
  }
</script>

