<template>
  <div class="Booking">
    <b-container :fluid="bookingFluid">
      <b-row class="mb-5" align-v="center">
        <Logo :logoDir="bookingLogoDir"/>
      </b-row>
      <b-row class="mt-3 mb-3" align-h="center">
        <b-col cols="6">
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
            :reset="inputGroupBookingDateReset"
          ></PromptInputGroup>
        </b-col>
        <b-col cols="6">
          <PromptInputGroup
            id="input-group-booking-time"
            prompt="Booking Time:"
            inputId="booking-time-input"
            inputType="time"
            :state="validateTime"
            placeholder="Select booking time"
            inputLiveFeedback="Must select booking time"
            @input="handleBookingTimeInput"
            :reset="inputGroupBookingTimeReset"
          ></PromptInputGroup>
        </b-col>
      </b-row>
      <b-row class="mt-3 mb-3" align-h="center" align-v="end">
        <b-col cols="6">
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
            :reset="inputGroupBookingGuestNumberReset"
          ></PromptInputGroup>
        </b-col>
        <b-col cols="2">
          <b-row align-h="start" class="ml-auto">
            <SearchTableButton/>
          </b-row>
        </b-col>
        <b-col cols="3">
          <b-row align-h="start">
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
          </b-row>
        </b-col>
        <b-col cols="1"/>
      </b-row>
      <b-row>
        <b-col>
          <TableList
            :showBookedTables="showBookedTables"
            :showUnavailableTables="showUnavailableTables"
            :tableList="tables"
            @operation="handleOperation"
          ></TableList>
        </b-col>
      </b-row>
      <b-row class="bg-light pt-3 pb-2" align-h="end">
        <b-col cols="2">
          <CheckBooking :operations="operations"/>
        </b-col>
        <b-col cols="2">
          <PlaceBookingButton/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Logo from '../components/Logo'
import PromptInputGroup from '../components/PromptInputGroup'
import SearchTableButton from '../components/SearchTableButton'
import CheckboxInputGroup from '../components/CheckboxInputGroup'
import TableList from '../components/TableList'
import CheckBooking from '../components/CheckBooking'
import PlaceBookingButton from '../components/PlaceBookingButton'
import axios from 'axios'

export default {
  name: 'Booking',
  components: {
    Logo,
    PromptInputGroup,
    SearchTableButton,
    CheckboxInputGroup,
    TableList,
    CheckBooking,
    PlaceBookingButton
  },
  props: {
    minBookingHour: {
      type: Number,
      default: 8
    },
    maxBookingHour: {
      type: Number,
      default: 20
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
      bookingLogoDir: 'booking.png',
      BookingDate: null,
      BookingTime: null,
      BookingGuestNumber: null,
      showBookedTables: false,
      showUnavailableTables: false,
      bookingFluid: 'xl',
      tables: [
        { table_id: 0, book_status: 0, table_content: 1 },
        { table_id: 1, book_status: 0, table_content: 2 },
        { table_id: 2, book_status: 1, table_content: 3 },
        { table_id: 3, book_status: 0, table_content: 5 },
        { table_id: 4, book_status: 1, table_content: 10 }
      ],
      inputGroupBookingDateReset: false,
      inputGroupBookingTimeReset: false,
      inputGroupBookingGuestNumberReset: false,
      operations: {
        book: [],
        merge: [],
        split: [],
        open: [],
        shut: [],
        cancel: []
      }
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
    prompt (text) {
      console.log('Prompter:', text)
    },
    validateTime (val) {
      const tmpBookHour = parseInt(val.substring(0, 2))
      if (tmpBookHour >= this.minBookingHour && tmpBookHour <= this.maxBookingHour) {
        return true
      } else {
        return false
      }
    },
    // The validation has been implemented inside the component
    handleBookingDateInput (val) {
      var tmpBookingDate = new Date(val)
      var dd = String(tmpBookingDate.getDate()).padStart(2, '0')
      var mm = String(tmpBookingDate.getMonth() + 1).padStart(2, '0')
      var yyyy = tmpBookingDate.getFullYear()
      this.BookingDate = yyyy + mm + dd
      console.log('this.BookingDate', this.BookingDate)
    },
    // The validation cannot be implemented inside time input
    handleBookingTimeInput (val) {
      if (!this.validateTime(val)) {
        this.prompt('Invalid time selection')
        this.inputGroupBookingTimeReset = true
        this.$nextTick(() => {
          this.inputGroupBookingTimeReset = false
        })
      }
      var hh = val.substring(0, 2)
      var mm = val.substring(3, 5)
      mm = String(Number.parseInt(mm) / 10 * 10).padStart(2, '0')
      var ss = '00'
      this.BookingTime = hh + ':' + mm + ':' + ss
    },
    // The validation has been implemented inside the component
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
    },
    updateTables (tables) {
      this.tables = this.extendTableList(tables)
    },
    extendTableList (tables) {
      this.tables = tables.map(table => {
        table.table_type = (table.table_content > 4) + (table.table_content > 10)
        return table
      })
    },
    handleOperation (operation, tableId) {
      if (this.operations[operation].includes(tableId)) {
        this.prompt('Duplicated operation!', operation, tableId)
      } else {
        this.operations[operation].push(tableId)
        console.log('parent operations updated', operation, tableId)
      }
    },
    // TODO: /api/review_table: request/response
    reviewTable () {
      if (this.BookingDate && this.BookingTime && this.BookingGuestNumber) {
        axios({
          method: 'get',
          url: 'http://localhost:8081/api/review_table',
          data: { book_time: this.BookingDate + ' ' + this.BookingTime }
        })
          .then(res => this.updateTables(res.book_status))
          .catch(err => console.log(err))
      }
    }
  }
}
</script>

<style>
/* #input-group-booking-date {
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
} */
/* .logo-row {
  height: 5vh;
} */
</style>
