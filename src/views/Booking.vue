<template>
  <div class="Booking">
    <b-container :fluid="bookingFluid">
      <b-row class="bg-light" align-v="center" align-h="start" style="height:5vh;">
        <b-col>
          <b-img src="../assets/booking.png" style="height:5vh;"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col xl="6" lg="6" md="6" sm="6" cols="6">
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
        <b-col xl="6" lg="6" md="6" sm="6" cols="6">
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
      <b-row>
        <b-col xl="6" lg="6" md="6" sm="6" cols="6">
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
        <b-col xl="1" lg="1" md="1" sm="1" cols="1" style="vertical-align:bottom;">
          <b-row align-h="start" align-v="end" class="ml-auto" style="height:100%;">
            <SearchTableButton @search="reviewTable"/>
          </b-row>
        </b-col>
        <b-col xl="5" lg="5" md="5" sm="5" cols="5" style="vertical-align:bottom;">
          <b-row align-h="center" align-v="end" class="ml-auto" style="height:100%;">
            <input
              type="checkbox"
              v-model="showBookedTables"
              :autocomplete="false"
              style="height:50%;width:2.5vmin;"
              class="mr-1 mb-1"
            />
            <p style="font-size:2.5vmin;margin:0;height:50%;">显示已预约</p>
            <!-- <CheckboxInputGroup
              id="checkbox-input-show-unavailable-tables"
              prompt="显示不可用桌"
              inputId="show-unavailable-tables-input"
              @change="handleshowUnavailableTablesInput"
            ></CheckboxInputGroup> -->
          </b-row>
        </b-col>
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
      <b-row class="bg-light" align-h="end">
        <b-col xl="2" lg="2" md="2" sm="2" cols="2">
          <b-form-input
            placeholder="Book serial"
            v-model="bookSerial"
          ></b-form-input>
        </b-col>
        <b-col xl="2" lg="2" md="2" sm="2" cols="2">
          <b-button-group>
            <b-button
              variant="outline-info"
              @click="open(true)"
            >
              开台
            </b-button>
            <b-button
              variant="outline-primary"
              @click="cancel"
            >
              销号
            </b-button>
          </b-button-group>
        </b-col>
        <b-col xl="4" lg="4" md="4" sm="4" cols="4"/>
        <b-col xl="4" lg="4" md="4" sm="4" cols="4">
          <b-row align-h="end">
            <b-button-group>
              <CheckBooking :operations="operations" @remove="removeOperations"/>
              <PlaceBookingButton @commit="handleCommitOperations"/>
            </b-button-group>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <Prompter prompterId="bookingPrompter" :promptText="promptText" @reset="promptText=null"/>
  </div>
</template>

<script>
import PromptInputGroup from '../components/PromptInputGroup'
import SearchTableButton from '../components/SearchTableButton'
import TableList from '../components/TableList'
import CheckBooking from '../components/CheckBooking'
import PlaceBookingButton from '../components/PlaceBookingButton'
import axios from 'axios'
import Prompter from '../components/Prompter'

export default {
  name: 'Booking',
  components: {
    PromptInputGroup,
    SearchTableButton,
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
      bookingFluid: false,
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
          this.prompt('请勿重复操作', operation, tableId)
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
      console.log('review_table request', {
        method: 'get',
        url: 'http://124.70.178.153:8081/api/review_table',
        params: { book_time: this.getValidDateTime() }
      })
      this.resetOperations()
      axios({
        method: 'get',
        url: 'http://124.70.178.153:8081/api/review_table',
        params: { book_time: this.getValidDateTime() }
      })
        .then((res) => {
          console.log('parent review_table response.data', res.data)
          this.updateTables(res.data.book_status)
        })
        .catch((err) => console.log(err))
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
      console.log('add_book request', {
        book_time: this.getValidDateTime(),
        table_id_list: this.operations.book
      })
      axios({
        method: 'post',
        url: 'http://124.70.178.153:8081/api/add_book',
        data: {
          book_time: this.getValidDateTime(),
          table_id_list: this.operations.book
        }
      })
        .then((res) => {
          console.log('add_book response.data', res.data)
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
              this.prompt('bug: add_book receives unexpected book_status in response')
          }
        })
        .catch(err => console.log(err))
      this.operations.book = []
    },
    // /api/cancel_book: request/response
    cancel () {
      if (!this.bookSerial) {
        this.prompt('请填写预约流水号')
        return
      }
      axios({
        method: 'post',
        url: 'http://124.70.178.153:8081/api/cancel_book',
        data: { book_serial: this.bookSerial }
      })
        .then((res) => {
          switch (res.data.cancel_status) {
            case 0:
              this.prompt('流水号为' + res.data.book_serial + '的预定取消失败')
              break
            case 1:
              this.prompt('流水号为' + res.data.book_serial + '的预定取消成功')
              break
            default:
              this.prompt('bug: cancel_book receives unexpected cancel_status', res.data.cancel_status)
          }
        })
        .catch(err => console.log(err))
      this.bookSerial = null
    },
    // TODO: /api/open_table: request/response
    open (book = false) {
      if (!this.bookSerial && book) {
        this.prompt('请填写预约流水号')
        return
      }
      console.log('open_table request', {
        method: 'post',
        url: 'http://124.70.178.153:8081/api/open_table',
        data: {
          table_id_list: book ? null : this.operations.open,
          book_serial: book ? this.bookSerial : null
        }
      })
      axios({
        method: 'post',
        url: 'http://124.70.178.153:8081/api/open_table',
        data: {
          table_id_list: book ? null : this.operations.open,
          book_serial: book ? this.bookSerial : null
        }
      })
        .then((res) => {
          console.log('open_table response.data', res.data)
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
      console.log('merge_table request', {
        method: 'post',
        url: 'http://124.70.178.153:8081/api/merge_table',
        data: {
          main_table_id: tmpMainTable,
          table_id_list: this.operations.merge
        }
      })
      axios({
        method: 'post',
        url: 'http://124.70.178.153:8081/api/merge_table',
        data: {
          main_table_id: tmpMainTable,
          table_id_list: this.operations.merge
        }
      })
        .then((res) => {
          console.log('merge_table response.data', res.data)
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
        url: 'http://124.70.178.153:8081/api/finish_table',
        data: { table_id: this.operations.finish[0] }
      })
        .then((res) => {
          console.log('finish_table response.data', res.data)
          switch (res.data.finish_status) {
            case 0:
              this.prompt('桌号' + res.data.table_id + '撤台成功')
              break
            case 1:
              this.prompt('桌号' + res.data.table_id + '撤台失败')
              break
            default:
              this.prompt('bug: unexpected finish_status in /api/finish_table: response')
          }
        })
        .catch((err) => console.log(err))
    }
  },
  mounted () {
    this.reviewTable()
    console.log('mounted review_table')
  }
}
</script>
