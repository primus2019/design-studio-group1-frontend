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
            :isCurrent="isCurrent"
            @operation="handleOperation"
          ></TableList>
        </b-col>
      </b-row>
      <b-row class="bg-light pt-3 pb-2" align-h="end">
        <b-col cols="2">
          <b-form-input
            placeholder="Book serial"
            v-model="bookSerial"
          ></b-form-input>
        </b-col>
        <b-col cols="1">
          <b-button
            variant="outline-info"
            @click="open(true)"
          >
            Open
          </b-button>
        </b-col>
        <b-col cols="1">
          <b-button
            variant="outline-primary"
            @click="cancel"
          >
            Cancel
          </b-button>
        </b-col>
        <b-col cols="4"/>
        <b-col cols="2">
          <CheckBooking :operations="operations" @remove="removeOperations"/>
        </b-col>
        <b-col cols="2">
          <PlaceBookingButton @commit="handleCommitOperations"/>
        </b-col>
      </b-row>
    </b-container>
    <Prompter prompterId="bookingPrompter" :promptText="promptText" @reset="promptText=null"/>
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
    Prompter
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
        open: [],
        merge: [],
        finish: []
      },
      promptText: null,
      promptInputType: null,
      promptInputText: null,
      bookSerial: null,
      isCurrent: true
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
      if (['open', 'book', 'merge'].includes(operation)) {
        if (this.operations[operation].includes(tableId)) {
          this.prompt('Duplicated operation!', operation, tableId)
        } else {
          this.operations[operation].push(tableId)
          console.log('parent operations updated', operation, tableId)
        }
      } else {
        this.operations[operation] = [tableId]
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
        this.isCurrent = false
      } else {
        tmpRequestTime = null
        this.isCurrent = true
      }
      console.log('valid dt', tmpRequestTime)
      return tmpRequestTime
    },
    resetOperations () {
      this.operations = {
        book: [],
        open: [],
        merge: [],
        finish: []
      }
    },
    firstBusyTable (tableIdList) {
      for (var i = 0; i < tableIdList.length; i++) {
        for (var j = 0; j < this.tables.length; j++) {
          // if table_id is the same
          if (this.tables[j].table_id === tableIdList[i]) {
            // if table is busy
            if (this.tables[j].book_status === 0) {
              return tableIdList[i]
            } else {
              break
            }
          }
        }
      }
      return -1
    },
    // /api/review_table: request/response
    reviewTable () {
      console.log('parent review_table request', {
        method: 'get',
        url: 'http://localhost:8081/api/review_table',
        params: { book_time: this.getValidDateTime() }
      })
      this.resetOperations()
      axios({
        method: 'get',
        url: 'http://localhost:8081/api/review_table',
        params: { book_time: this.getValidDateTime() }
      })
        .then((res) => {
          console.log('parent review_table response.data', res.data)
          this.updateTables(res.data.book_status)
        })
        .catch((err) => console.log(err))
      console.log('parent review tables', this.tables)
    },
    handleCommitOperations (operation) {
      console.log('parent commit operation', operation, this.operations[operation])
      switch (operation) {
        case 'book':
          this.book()
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
        case 'cancel':
          this.cancel()
          break
        case 'finish':
          this.finish()
          break
        default:
          console.log('commited operation has no handler', operation)
      }
      setTimeout(() => {
        this.reviewTable()
      }, 500)
    },
    // /api/add_book: request/response
    book () {
      console.log('Parent book request', {
        book_time: this.getValidDateTime(),
        table_id_list: this.operations.book
      })
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/add_book',
        data: {
          book_time: this.getValidDateTime(),
          table_id_list: this.operations.book
        }
      })
        .then((res) => {
          console.log('parent book response', res)
          switch (res.data.book_status) {
            case 0:
              this.prompt('该时段已预定满')
              break
            case 1:
              this.prompt('预定成功, 预定号' + res.data.book_serial)
              break
            case 2:
              this.prompt('预定时间非法')
              break
            default:
              console.log('bug: book opreation receives unexpected book_status in response')
          }
        })
        .catch(err => console.log(err))
      this.operations.book = []
    },
    // /api/cancel_book: request/response
    cancel () {
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/cancel_book',
        data: { book_serial: this.bookSerial }
      })
        .then((res) => {
          if (res.data.cancel_status === 1) {
            this.prompt('流水号为' + res.data.book_serial + '的预定取消成功')
          } else {
            this.prompt('流水号为' + res.data.book_serial + '的预定取消失败')
          }
        })
        .catch(err => console.log(err))
      this.bookSerial = null
    },
    // TODO: /api/open_table: request/response
    open (book = false) {
      console.log('parent open request', {
        method: 'post',
        url: 'http://localhost:8081/api/open_table',
        data: {
          table_id_list: book ? null : this.operations.open,
          book_serial: book ? this.bookSerial : null
        }
      })
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/open_table',
        data: {
          table_id_list: book ? null : this.operations.open,
          book_serial: book ? this.bookSerial : null
        }
      })
        .then((res) => {
          if (book) {
            switch (res.data.open_status) {
              case 0:
                this.prompt('预定号无效')
                break
              case 1:
                this.prompt('预定号过期')
                break
              case 2:
                this.prompt('预定号没到')
                break
              case 3:
                this.prompt('预定桌号被现场占用')
                break
              case 4:
                this.prompt('成功')
                break
              default:
                this.prompt('bug: unexpected open_status in /api/open_table:', res.data.open_status)
            }
          } else {
            switch (res.data.open_status) {
              case 0:
                this.prompt('开台失败')
                break
              case 1:
                this.prompt('开台成功')
                break
              default:
                this.prompt('bug: unexpected open_status in /api/open_table:', res.data.open_status)
            }
          }
        })
      if (this.isCurrent) {
        this.operations.open = []
      } else {
        this.bookSerial = null
      }
    },
    // TODO: /api/merge_table: request/response
    merge () {
      const tmpMainTable = this.firstBusyTable(this.operations.merge)
      if (tmpMainTable === -1) {
        this.prompt('并台队列无合法主桌')
        return
      }
      console.log('parent merge request', {
        method: 'post',
        url: 'http://localhost:8081/api/merge_table',
        data: {
          main_table_id: tmpMainTable,
          table_id_list: this.operations.merge
        }
      })
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/merge_table',
        data: {
          main_table_id: tmpMainTable,
          table_id_list: this.operations.merge
        }
      })
        .then((res) => {
          console.log('parent merge response.data', res.data)
          if (res.data.merge_status === 0) {
            this.prompt('并台成功, 主桌号:', res.data.main_table_id)
          } else if (res.data.merge_status === 1) {
            this.prompt('并台失败')
          } else {
            this.prompt('bug: unexpected merge_status in /api/merge_table: response')
          }
        })
        .catch((err) => console.log(err))
    },
    // TODO: /api/finish_table: request/response
    finish () {
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/finish_table',
        data: { table_id: this.operations.finish[0] }
      })
        .then((res) => {
          console.log('parent finish response.data', res.data)
          if (res.data.finish_status === 0) {
            this.prompt('桌号' + res.data.table_id + '撤台成功')
          } else if (res.data.finish_status === 1) {
            this.prompt('桌号' + res.data.table_id + '撤台失败')
          } else {
            this.prompt('bug: unexpected finish_status in /api/finish_table: response')
          }
        })
        .catch((err) => console.log(err))
    }
  },
  mounted () {
    this.reviewTable()
    console.log('parent mounted tables', this.tables)
  }
}
</script>
