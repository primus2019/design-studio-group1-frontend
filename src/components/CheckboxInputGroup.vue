<template>
  <div class="checkbox-input">
    <b-form-checkbox
      :id="checkboxId"
      v-model="checkboxInput"
      value="checked"
      unchecked-value="not_checked"
    >
      <p style="font-size:3.5vmin;">{{ this.prompt }}</p>
    </b-form-checkbox>
  </div>
</template>

<script>
export default {
  name: 'CheckboxInput',
  props: {
    prompt: {
      type: String,
      default: 'checkboxDefaultPrompt'
    },
    checkboxId: {
      type: String
    }
  },
  data () {
    return {
      checkboxInput: null
    }
  },
  watch: {
    checkboxInput: {
      handler: function (val, oldVal) {
        this.$emit('change', val)
      }
    }
  }
}
</script>

<style>
.check-box-input {
  /* position: absolute; */
  width: 160px;
  height: 24px;
}
</style>
