<template>
  <div class="Booking">
    <Logo/>
    <PromptInputGroup
      id="input-group-booking-date"
      prompt="Booking Date:"
      inputId="booking-date-input"
      inputType="date"
      :inputMin="minBookingDate"
      :inputMax="maxBookingDate"
      state="false"
      placeholder="Select booking date"
      inputLiveFeedback="Must select booking date"
      @input="handleBookingDateInput"
    ></PromptInputGroup>
    <PromptInputGroup
      id="input-group-booking-time"
      prompt="Booking Time:"
      inputId="booking-time-input"
      inputType="time"
      :state="validateTime"
      placeholder="Select booking time"
      inputLiveFeedback="Must select booking time"
      @input="handleBookingTimeInput"
    ></PromptInputGroup>
    <PromptInputGroup
      id="input-group-booking-guest-number"
      prompt="Guest Number:"
      inputId="booking-guest-number-input"
      inputType="number"
      :inputMin="minBookingGuestNumber"
      :inputMax="maxBookingGuestNumber"
      :state="false"
      placeholder="Select guest number"
      inputLiveFeedback="Must select guest number"
      @input="handleBookingGuestNumberInput"
    ></PromptInputGroup>
    <CheckboxInputGroup
      id="checkbox-input-show-booked-tables"
      prompt="Show booked tables"
      inputId="show-booked-tables-input"
      @change="handleShowBookedTableInput"
    ></CheckboxInputGroup>
    <CheckboxInputGroup
      id="checkbox-input-show-unavailable-tables"
      prompt="Show unavailable tables"
      inputId="show-unavailable-tables-input"
      @change="handleshowUnavailableTablesInput"
    ></CheckboxInputGroup>
    <SearchTableButton/>
    <TableList :showBookedTables="showBookedTables" :showUnavailableTables="showUnavailableTables"/>
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
  name: 'Booking',
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
      BookingDate: null,
      BookingTime: null,
      BookingGuestNumber: '0',
      showBookedTables: false,
      showUnavailableTables: false
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
    handleBookingDateInput (val) {
      this.BookingDate = val
    },
    handleBookingTimeInput (val) {
      this.BookingTime = val
    },
    handleBookingGuestNumberInput (val) {
      this.BookingGuestNumber = val
    },
    handleShowBookedTableInput (val) {
      if (val === 'checked') {
        this.showBookedTables = true
      } else {
        this.showBookedTables = false
      }
    },
    handleshowUnavailableTablesInput (val) {
      if (val === 'checked') {
        this.showUnavailableTables = true
      } else {
        this.showUnavailableTables = false
      }
    }
  }
}
</script>

<style>
#input-group-booking-date {
  position: absolute;
  left: 85px;
  top: 99px;
}
#input-group-booking-time {
  position: absolute;
  left: 85px;
  top: 193px;
}
#input-group-booking-guest-number {
  position: absolute;
  left: 669px;
  top: 99px;
}
#checkbox-input-show-booked-tables {
  position: absolute;
  left: 855px;
  top: 210px;
}
#checkbox-input-show-unavailable-tables {
  position: absolute;
  left: 855px;
  top: 240px;
}
</style>
