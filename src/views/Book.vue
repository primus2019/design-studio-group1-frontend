<template>
  <div class="Book">
    <Logo/>
    <PromptInputGroup
      id="input-group-book-date"
      prompt="Book Date:"
      inputId="book-date-input"
      inputType="date"
      :inputMin="minBookingDate"
      :inputMax="maxBookingDate"
      state="false"
      placeholder="Select book date"
      inputLiveFeedback="Must select book date"
      @input="handleBookDateInput"
    ></PromptInputGroup>
    <PromptInputGroup
      id="input-group-book-time"
      prompt="Book Time:"
      inputId="book-time-input"
      inputType="time"
      :state="validateTime"
      placeholder="Select book time"
      inputLiveFeedback="Must select book time"
      @input="handleBookTimeInput"
    ></PromptInputGroup>
    <PromptInputGroup
      id="input-group-book-guest-number"
      prompt="Book Time:"
      inputId="book-guest-number-input"
      inputType="number"
      :inputMin="minBookingGuestNumber"
      :inputMax="maxBookingGuestNumber"
      :state="false"
      placeholder="Select book time"
      inputLiveFeedback="Must select book time"
      @input="handleBookGuestNumberInput"
    ></PromptInputGroup>
    <CheckboxInputGroup
      id="checkbox-input-show-booked-tables"
      prompt="Show booked tables"
      inputId="show-booked-tables-input"
      @change="handleShowBookedTableInput"
    ></CheckboxInputGroup>
    <SearchTableButton/>
    <TableList/>
    <CheckBookingButton/>
    <PlaceBookingButton/>
  </div>
</template>

<script>
import Logo from '../components/Logo'
import PromptInputGroup from '../components/PromptInputGroup'
import SearchTableButton from '../components/SearchTableButton'
import CheckboxInputGroup from '../components/CheckboxInputGroup'
import TableList from '../components/TableList'
import CheckBookingButton from '../components/CheckBookingButton'
import PlaceBookingButton from '../components/PlaceBookingButton'

export default {
  name: 'Book',
  components: {
    Logo,
    PromptInputGroup,
    SearchTableButton,
    CheckboxInputGroup,
    TableList,
    CheckBookingButton,
    PlaceBookingButton
  },
  props: {
    minBookingTime: {
      type: String,
      default: '8:00'
    },
    maxBookingTime: {
      type: String,
      default: '20:00'
    },
    minBookingDays: {
      type: Number,
      default: 0
    },
    maxBookingDays: {
      type: Number,
      default: 3
    },
    minBookingGuestNumber: {
      type: String,
      default: '1'
    },
    maxBookingGuestNumber: {
      type: String,
      default: '10'
    }
  },
  data () {
    return {
      BookDate: null,
      BookTime: null,
      BookGuestNumber: '0',
      showBookedTables: false
    }
  },
  computed: {
    minBookingDate () {
      var today = new Date()
      today.setDate(today.getDate() + this.minBookingDays)
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0')
      var yyyy = today.getFullYear()

      today = yyyy + '-' + mm + '-' + dd
      return today
    },
    maxBookingDate () {
      var today = new Date()
      today.setDate(today.getDate() + this.maxBookingDays)
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0')
      var yyyy = today.getFullYear()

      today = yyyy + '-' + mm + '-' + dd
      return today
    }
  },
  methods: {
    validateTime () {
      const minTime = Date.parse(this.minBookingTime)
      const maxTime = Date.parse(this.maxBookingTime)
      const tmpBookTime = Date.parse(this.BookTime)
      if (tmpBookTime >= minTime && tmpBookTime <= maxTime) {
        return true
      } else {
        return false
      }
    },
    handleBookDateInput (val) {
      this.BookDate = val
    },
    handleBookTimeInput (val) {
      this.BookTime = val
    },
    handleBookGuestNumberInput (val) {
      this.BookGuestNumber = val
    },
    handleShowBookedTableInput (val) {
      if (val === 'checked') {
        this.showBookedTables = true
      } else {
        this.showBookedTables = false
      }
    }
  }
}
</script>

<style>
#input-group-book-date {
  position: absolute;
  left: 85px;
  top: 99px;
}
#input-group-book-time {
  position: absolute;
  left: 85px;
  top: 193px;
}
#input-group-book-guest-number {
  position: absolute;
  left: 669px;
  top: 99px;
}
#checkbox-input-show-booked-tables {
  position: absolute;
  left: 855px;
  top: 228px;
}
</style>
