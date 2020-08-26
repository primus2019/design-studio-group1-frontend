<template>
  <div class="prompt-input-group">
    <label :for="inputId">{{ this.prompt }}</label>
    <b-form-input
      required
      :id="inputId"
      :type="inputType"
      :step="inputStep"
      :min="inputMin"
      :max="inputMax"
      v-model="inputModel"
      :state="inputState"
      :placeholder="placeholder"
      :aria-describedby="this.inputId+'inputLiveFeedback'"
      v-if="inputShow"
    ></b-form-input>
    <b-form-invalid-feedback :id="this.inputId+'inputLiveFeedback'">
      {{ this.inputLiveFeedback}}
    </b-form-invalid-feedback>
  </div>
</template>

<script>
export default {
  name: 'PromptInputGroup',
  props: {
    reset: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String
    },
    prompt: {
      type: String
    },
    inputType: {
      type: String
    },
    inputStep: {
      type: String
    },
    inputMin: {
      type: String
    },
    inputMax: {
      type: String
    },
    inputState: {
      type: String
    },
    placeholder: {
      type: String
    },
    inputLiveFeedback: {
      type: String
    }
  },
  data () {
    return {
      inputModel: null,
      inputShow: true
    }
  },
  watch: {
    inputModel: {
      handler: function (val) {
        console.log('child component watcher: inputModel change', this.inputModel)
        if (val !== null) {
          this.$emit('input', val)
        }
      }
    },
    reset: {
      handler: function () {
        console.log('child component watcher: reset change', this.reset)
        if (this.reset) {
          this.inputModel = null
          this.inputShow = false
          this.$nextTick(() => {
            this.inputShow = true
          })
        }
      }
    }
  }
}
</script>
