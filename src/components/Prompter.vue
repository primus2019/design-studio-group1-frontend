<template>
  <div>
    <b-modal
      :id="prompterId"
      hide-header
      hide-footer
      centered
    >
      {{ this.promptText }}
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Prompter',
  props: {
    prompterId: {
      type: String
    },
    promptText: {
      type: String
    }
  },
  watch: {
    promptText: {
      handler: function () {
        if (this.promptText) {
          console.log('Prompter:', this.promptText)
          this.$bvModal.show(this.prompterId)
          setTimeout(() => {
            this.$bvModal.hide(this.prompterId)
            this.$emit('reset')
          }, 1000)
        }
      }
    }
  }
}
</script>
