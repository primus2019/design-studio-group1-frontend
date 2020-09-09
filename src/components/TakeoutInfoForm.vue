<template>
  <div>
    <b-modal
      :id="id"
      centered
      title="个人信息"
      @show="reset"
      @hidden="reset"
    >
      <template v-slot:modal-footer>
        <b-row>
          <b-button
            @click="handleOk"
            :disabled="disable || confirm"
          >
            确认
          </b-button>
        </b-row>
        <b-row>
          <b-button
            @click="confirm=false;reset();"
            :disabled="disable"
          >
            重置
          </b-button>
        </b-row>
      </template>
      <b-form-group>
        <b-form>
          <label :for="id+'Name'">姓名</label>
          <b-form-input
            :id="id+'Name'"
            :ref="id+'Name'"
            placeholder="请输入姓名"
            :state="checkValidity ? ![null, ''].includes(name) : null"
            aria-describedby="input-type-check-name"
            v-model="name"
            :disabled="disable || confirm"
          ></b-form-input>
          <b-form-invalid-feedback id="input-type-check-name">
            请输入姓名
          </b-form-invalid-feedback>
        </b-form>
        <b-form>
          <label :for="id+'Phone'">手机</label>
          <b-form-input
            :id="id+'Phone'"
            :ref="id+'Phone'"
            placeholder="请输入手机"
            :state="checkValidity ? inputNumberCheck : null"
            aria-describedby="input-type-check-phone"
            v-model="phone"
            :disabled="disable || confirm"
          ></b-form-input>
          <b-form-invalid-feedback id="input-type-check-phone">
            请输入手机
          </b-form-invalid-feedback>
        </b-form>
        <b-form>
          <label :for="id+'Address'">地址</label>
          <b-form-input
            :id="id+'Address'"
            :ref="id+'Address'"
            placeholder="请输入地址"
            :state="checkValidity ? ![null, ''].includes(address) : null"
            v-model="address"
            :disabled="disable || confirm"
          ></b-form-input>
          <b-form-invalid-feedback id="input-type-check-address">
            请输入地址
          </b-form-invalid-feedback>
        </b-form>
      </b-form-group>
    </b-modal>
    <Prompter
      :promptText="promptText"
      prompterId="takeoutInfoPrompter"
      @reset="promptText=null"
    ></Prompter>
  </div>
</template>

<script>
import Prompter from '../components/Prompter'

export default {
  name: 'TakeoutInfoForm',
  components: {
    Prompter
  },
  props: {
    id: {
      type: String
    },
    disable: {
      type: Boolean
    }
  },
  data () {
    return {
      name: null,
      phone: null,
      address: null,
      promptText: null,
      checkValidity: false,
      confirm: false
    }
  },
  methods: {
    prompt (text) {
      this.promptText = text
    },
    reset () {
      if (!this.disable && !this.confirm) {
        this.name = null
        this.phone = null
        this.address = null
        this.$emit('submit', {
          name: null,
          phone: null,
          address: null
        })
        this.confirm = false
        this.checkValidity = false
      }
    },
    handleOk (evt) {
      evt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit () {
      this.checkValidity = true
      const valid = (this.name !== null) && (this.phone !== null) &&
        (this.address !== null) && this.inputNumberCheck
      if (valid) {
        this.$emit('submit', {
          name: this.name,
          phone: parseInt(this.phone),
          address: this.address
        })
        this.confirm = true
        this.$nextTick(() => {
          this.$bvModal.hide(this.id)
        })
      } else {
        this.prompt('请正确填写信息')
      }
    }
  },
  computed: {
    inputNumberCheck () {
      return this.phone.match(/^(?:\d{2,3}-)*\d{8,11}$/g) !== null
    }
  }
}
</script>
