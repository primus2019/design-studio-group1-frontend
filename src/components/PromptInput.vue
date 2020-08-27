<template>
  <div>
    <b-modal
      :id="id"
      hide-header
      centered
      @ok="handleOk"
    >
      <form :ref="promptInputId+'FormRef'" @submit.stop.prevent="handleSubmit">
        <b-form-group>
          <label :for="promptInputId">{{ this.promptInputText }}</label>
          <b-form-input
            :id="promptInputId"
            placeholder="Enter book serial"
            :type="promptInputType"
            v-model="promptInputModel"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'PromptInput',
  props: {
    id: {
      type: String
    },
    promptInputId: {
      type: String
    },
    promptInputType: {
      type: String
    },
    promptInputText: {
      type: String
    }
  },
  data () {
    return {
      promptInputModel: null
    }
  },
  methods: {
    handleOk () {
      this.handleSubmit()
    },
    handleSubmit () {
      const valid = this.$refs[this.promptInputId + 'FormRef'].checkValidity()
      if (!valid) return
      this.$emit('submit', this.promptInputModel)
    }
  }
}
</script>
