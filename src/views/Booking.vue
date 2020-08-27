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
            <SearchTableButton @search="reviewTable"/>
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
          <CheckBooking :operations="operations" @remove="removeOperations"/>
        </b-col>
        <b-col cols="2">
          <PlaceBookingButton @commit="handleCommitOperations"/>
        </b-col>
      </b-row>
    </b-container>
    <Prompter prompterId="bookingPrompter" :promptText="promptText" @reset="promptText=null"/>
    <PromptInput
      id="cancelBookingPromptInput"
      promptInputType="number"
      promptInputText="Enter book serial"
      @submit="handleCancelBooking"
    ></PromptInput>
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
import Prompter from '../components/Prompter'
import PromptInput from '../components/PromptInput'

export default {
  name: 'Booking',
  components: {
    Logo,
    PromptInputGroup,
    SearchTableButton,
    CheckboxInputGroup,
    TableList,
    CheckBooking,
    PlaceBookingButton,
    Prompter,
    PromptInput
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
      tables: null,
      inputGroupBookingDateReset: false,
      inputGroupBookingTimeReset: false,
      inputGroupBookingGuestNumberReset: false,
      operations: {
        book: [],
        cancel: [],
        open: [],
        merge: [],
        split: []
        // close: [],
        // shut: []
      },
      commitOperationApiDict: {
        book: '/api/add_book',
        cancel: '/api/cancel_book',
        open: '/api/open_table',
        merge: '/api/merge_table',
        split: '/api/split_table'
      },
      promptText: '',
      promptInputType: null,
      promptInputText: null
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
      this.promptText = text
    },
    promptInput (text, requiredType) {
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
      this.tables = tables
      this.extendTableList()
      console.log('parent update tables', this.tables)
    },
    extendTableList () {
      for (var i = 0; i < this.tables.length; i++) {
        this.tables[i].table_type = (this.tables[i].table_content > 4) + (this.tables[i].table_content > 10)
      }
    },
    handleOperation (operation, tableId) {
      if (this.operations[operation].includes(tableId)) {
        this.prompt('Duplicated operation!', operation, tableId)
        // this.prompt = 'Duplicated operation!' + operation + tableId
      } else {
        this.operations[operation].push(tableId)
        console.log('parent operations updated', operation, tableId)
      }
    },
    removeOperations (operation, tableId) {
      if (this.operations[operation].includes(tableId)) {
        this.operations[operation] = this.operations[operation].filter(singleOperation => singleOperation !== tableId)
      } else {
        this.prompt('remove operation fails because the removed operation ' + tableId + ' is not in operations')
      }
    },
    getValidDateTime () {
      var tmpRequestTime = null
      if (this.BookingDate && this.BookingTime && this.BookingGuestNumber) {
        tmpRequestTime = this.BookingDate + ' ' + this.BookingTime
      } else {
        tmpRequestTime = null
      }
      console.log('valid dt', tmpRequestTime)
      return tmpRequestTime
    },
    handleCancelBooking (val) {
      this.cancelBookSerial = val
      this.cancel()
    },
    // /api/review_table: request/response
    reviewTable () {
      axios({
        method: 'get',
        url: 'http://localhost:8081/api/review_table',
        data: { book_time: this.getValidDateTime() }
      })
        .then(res => {
          this.updateTables(res.data.book_status)
        })
        .catch(err => console.log(err))
      console.log('parent review tables', this.tables)
    },
    // TODO: /api/open_table: request/response
    // TODO: /api/merge_table: request/response
    // TODO: /api/split_table: request/response
    handleCommitOperations (operation) {
      console.log('parent commit operation', operation, this.operations[operation])
      switch (operation) {
        case 'book':
          this.book()
          break
        case 'cancel':
          this.$bvModal.show('cancelBookingPromptInput')
          break
        case 'open':
          this.open()
          break
        case 'merge':
          this.merge()
          break
        case 'split':
          this.split()
          break
        default:
          console.log('commited operation has no handler', operation)
      }
    },
    // TODO: /api/add_book: request/response
    book () {
      console.log('Parent request book')
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/add_book',
        data: {
          book_time: this.getValidDateTime(),
          table_id_list: this.operations.book
        }
      })
        .then((res) => {
          switch (res.data.book_status) {
            case 0:
              this.prompt('该时段已预定满')
              break
            case 1:
              this.prompt('预定成功, 预定号' + this.res.data.book_serial)
              break
            case 2:
              this.prompt('预定时间非法')
              break
            default:
              console.log('bug: book opreation receives unexpected book_status in response')
          }
        })
        .catch(err => console.log(err))
    },
    // TODO: /api/cancel_book: request/response
    cancel () {
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/cancel_book',
        data: { book_serial: this.cancelBookSerial }
      })
        .then((res) => {
          if (res.data.cancel_status === 1) {
            this.prompt('流水号为' + res.data.book_serial + '的预定取消成功')
          } else {
            this.prompt('流水号为' + res.data.book_serial + '的预定取消失败')
          }
        })
        .catch(err => console.log(err))
    },
    open () {
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/open_table',
        data: {
          table_id_list: null
        }
      })
    }
  },
  mounted () {
    this.reviewTable()
    console.log('parent mounted tables', this.tables)
  }
}
</script>
