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
      inputModel: null
    }
  },
  watch: {
    inputModel: {
      handler: function (val, oldVar) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style>
.prompt-input-group {
  width: 540px;
  height: 70px;
}
</style>
