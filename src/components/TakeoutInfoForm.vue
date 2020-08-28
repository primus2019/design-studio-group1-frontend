<template>
  <div>
    <b-button
      @click="$bvModal.show(id)"
    >
      Enter your information
    </b-button>
    <b-modal
      :id="id"
      centered
      title="Takeout Information"
      @show="reset"
      @hidden="reset"
    >
      <template v-slot:modal-footer>
        <b-row>
          <b-button
            @click="handleOk"
            :disabled="disable || confirm"
          >
            Confirm
          </b-button>
        </b-row>
        <b-row>
          <b-button
            @click="confirm=false;reset();"
            :disabled="disable"
          >
            Reset
          </b-button>
        </b-row>
      </template>
      <b-form-group>
        <b-form>
          <label :for="id+'Name'">Name</label>
          <b-form-input
            :id="id+'Name'"
            :ref="id+'Name'"
            placeholder="Enter your name"
            :state="checkValidity ? ![null, ''].includes(name) : null"
            aria-describedby="input-type-check-name"
            v-model="name"
            :disabled="disable || confirm"
          ></b-form-input>
          <b-form-invalid-feedback id="input-type-check-name">
            Please enter name
          </b-form-invalid-feedback>
        </b-form>
        <b-form>
          <label :for="id+'Phone'">Phone</label>
          <b-form-input
            :id="id+'Phone'"
            :ref="id+'Phone'"
            placeholder="Enter your phone"
            :state="checkValidity ? inputNumberCheck : null"
            aria-describedby="input-type-check-phone"
            v-model="phone"
            :disabled="disable || confirm"
          ></b-form-input>
          <b-form-invalid-feedback id="input-type-check-phone">
            Please enter phone
          </b-form-invalid-feedback>
        </b-form>
        <b-form>
          <label :for="id+'Address'">Address</label>
          <b-form-input
            :id="id+'Address'"
            :ref="id+'Address'"
            placeholder="Enter your address"
            :state="checkValidity ? ![null, ''].includes(address) : null"
            v-model="address"
            :disabled="disable || confirm"
          ></b-form-input>
          <b-form-invalid-feedback id="input-type-check-address">
            Please enter address
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
        this.prompt('Invalid information')
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
