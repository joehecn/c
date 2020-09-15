<template>
  <j-layout active="/">
    <div id="home">
      <div class="home-search">
        <el-date-picker
          v-model="date"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>

        <el-button
          class="home-form-item"
          type="primary"
          :disabled="multipleSelection.length === 0"
          @click="downloadExcel">Download excel</el-button>
      </div>

      <el-table
        ref="multipleTable"
        border
        :data="txtlist"
        @selection-change="handleSelectionChange">

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          label="file">
          <template slot-scope="scope">
            <div>{{ scope.row.key }}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="mtime"
          width="200px">
          <template slot-scope="scope">
            <div>{{ $$moment(scope.row.mtime).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="checked"
          width="100px">
          <template slot-scope="scope">
            <i v-if="scope.row.checked===1" class="el-icon-check"></i>
            <i v-else-if="scope.row.checked===-1" class="el-icon-close"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </j-layout>
</template>

<script>
import JLayout from '../components/JLayout.vue'
import { mapState } from 'vuex'

import * as Excel from 'exceljs/dist/es5/exceljs.browser';
import { saveAs } from 'file-saver';

import fun from '../../util/fun.js'

const { fixNumber } = fun

export default {
  components: {
    'j-layout': JLayout,
  },

  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: 'Today',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: 'Yesterday',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: 'A week ago',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      // date: new Date(),
      txtlist: [],
      multipleSelection: []
    }
  },

  computed: {
    ...mapState({
      workDir: state => state.workDir
      // enterHomeFirstTime: state => state.enterHomeFirstTime
    }),
    date: {
      get () {
      return this.$store.state.date
      },
      set (value) {
        this.$store.commit('setDate', value)
      }
    },
    dateStr () {
      if (this.date) {
        return this.$$moment(this.date).format('YYYY-MM-DD')
      }
      return ''
    }
  },

  watch: {
    async dateStr (value) {
      console.log('findTxtlistByDate from watch')
      this.txtlist = await this.findTxtlistByDate(value)
      this.$refs.multipleTable.toggleAllSelection()
    }

    // txtlist (value) {
    //   console.log('--- txtlist change')
    //   if (value.length > 0) {
    //     this.$refs.multipleTable.toggleAllSelection()
    //   }
    // }
  },

  async mounted () {
    console.log('Home mounted')
    if (!this.workDir) {
      this.$notify.warning({
        position: 'bottom-left',
        title: 'warning',
        message: 'Please chose a work directory'
      })
      this.$router.push('./config')
    } else if (this.date) {
      // this.$store.commit('setEnterHomeFirstTime')
      const dateStr = this.$$moment(this.date).format('YYYY-MM-DD')
      console.log('findTxtlistByDate from mounted')
      this.txtlist = await this.findTxtlistByDate(dateStr)
      this.$refs.multipleTable.toggleAllSelection()
    }
  },

  methods: {
    async findTxtlistByDate (date) {
      let txtlist = []

      if (date) {
        const msg = {
          key: 'findTxtlist',
          req: {
            workDir: this.workDir,
            date
          }
        }
        const { code, message, data } = await this.$$ipc.send(msg)

        if (code === 0) {
          txtlist = data
        }
      }

      return txtlist
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    findIndex (key) {
      for (let i = 0, len = this.txtlist.length; i < len; i++) {
        const item = this.txtlist[i]
        if (item.key === key) {
          return i
        }
      }
      return -1
    },

    async downloadExcel () {
      const len = this.multipleSelection.length
      if (len > 0) {

        // copy multipleSelection
        const multiple = []
        for (let i = 0; i < len; i++) {
          const item = this.multipleSelection[i]
          const copy = Object.assign({}, item)
          multiple.push(copy)
        }

        //  fullscreen
        const loading = this.$loading({
          lock: true,
          text: 'Waiting...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        try {
          // const canDownload = true
          const arr = []
          for (let i = 0; i < len; i++) {
            const { filepath, name, key, mtime } = multiple[i]
            // console.log({ filepath, name, key, mtime })

            const msg = {
              key: 'coverTxt',
              req: {
                filepath,
                name
              }
            }
            const { code, message, data } = await this.$$ipc.send(msg)

            let checked = -1
            if (code === 0) {
              arr.push(data)
              checked = 1
            }

            const index = this.findIndex(key)
            if (index > -1) {
              const row = {
                filepath,
                name,
                key,
                mtime,
                checked
              }
              this.txtlist.splice(index, 1, row)

              if (checked === 1) {
                this.$refs.multipleTable.toggleRowSelection(row)
              }
            }


            if (checked === -1) {
              this.$notify.error({
                position: 'bottom-left',
                title: code,
                message
              })
              loading.close()
              return
            }
          }

          loading.close()

          // download excel
          this.download(arr)
        } catch (error) {
          console.log(error.message)
          const code = error.status || error.code || '1000004'
          const message = error.message || 'unknown error 1000004'
          this.$notify.error({
            position: 'bottom-left',
            title: code,
            message
          })
          loading.close()
        }
      }
    },

    getTotalList(totalMap) {
      const list = []
      for (const key in totalMap) {
        list.push(totalMap[key])
      }

      const map = list.map(item => {
        item[3] = fixNumber(item[3])
        item[5] = fixNumber(item[5])
        return item
      })

      map.unshift(['名稱', '', '單位', '零售價', '總數量', '總金額$'])

      return map
    },
    updateTotalMap(item, totalMap) {
      // console.log(item)
      const [zh, en, unit, unitPrice, count, totalPrice] = item
      const key = `${en},${unitPrice}`
      if (!totalMap[key]) {
        totalMap[key] = [zh, en, unit, unitPrice, count, totalPrice]
      } else {
        totalMap[key][4] += count
        totalMap[key][5] += totalPrice
      }
    },
    coverlist(list, totalMap) {
      const map = list.map(item => {
        this.updateTotalMap(item, totalMap)
        item[3] = fixNumber(item[3])
        item[5] = fixNumber(item[5])
        return item
      })

      map.unshift(['名稱', '', '單位', '零售價', '數量', '金額$'])

      return map
    },
    download (arr) {
      const len = arr.length
      if (len === 0) return

      const wbName = `${this.$$moment(this.date).format('YYYYMMDD')}.xlsx`
      const wb = new Excel.Workbook()

      let totalCount = 0
      let totalSend = 0
      let totalDiscount = 0
      let totalTotal = 0
      const totalMap = {
        /**
         * key: '名稱,零售價'
         * value: ['名稱', '', '單位', '零售價', '數量++', '金額$++']
         */
      }
      for (let i = 0; i < len; i++) {
        const { name, head, excelCount, send, discount, total, list } = arr[i]

        totalCount += excelCount
        totalSend += send
        totalDiscount += discount
        totalTotal += total

        const [, reginValue, , pointValue] = head
        const nameSheet = wb.addWorksheet(name)

        // Header
        nameSheet.addRows([
          [`姓名: ${name}`],
          ['電話:'],
          [`地區: ${reginValue}`],
          [`地址: ${pointValue}`],
          ['']
        ])

        const _list = this.coverlist(list, totalMap)
        nameSheet.addRows(_list)

        // Footer
        nameSheet.addRows([
          ['', '', '', '', excelCount, fixNumber(total)],
          ['', '', '', '', '上門費:', fixNumber(send)],
          ['', '', '', '退款/', '首單9折:', fixNumber(discount)],
          ['', '', '', '', '總數:', fixNumber(total + discount + send)],
        ])

        // 列宽
        nameSheet.getColumn(1).width = 40 // 名稱
        nameSheet.getColumn(2).width = 40
        nameSheet.getColumn(3).width = 20 // 單位
        nameSheet.getColumn(4).width = 20 // 零售價
        nameSheet.getColumn(5).width = 20 // 數量
        nameSheet.getColumn(6).width = 20 // 金額$

        // Font size
        nameSheet.getRow(1).font = { size: 14, bold: true }
        nameSheet.getRow(2).font = { size: 14, bold: true }
        nameSheet.getRow(3).font = { size: 14, bold: true }
        nameSheet.getRow(4).font = { size: 14, bold: true }
        nameSheet.getRow(6).font = { size: 12, bold: true }
        // 合并单元格
        nameSheet.mergeCells('A6:B6')
      }

      // Total sheet
      const _totalList = this.getTotalList(totalMap)
      const totalSheet = wb.addWorksheet('Total')

      totalSheet.addRows(_totalList)

      // Footer
      totalSheet.addRows([
        ['', '', '', '', totalCount, fixNumber(totalTotal)],
        ['', '', '', '', '總上門費:', fixNumber(totalSend)],
        ['', '', '', '退款/', '首單9折:', fixNumber(totalDiscount)],
        ['', '', '', '', '總成本:', ''],
        ['', '', '', '', '總收入:', fixNumber(totalTotal + totalDiscount + totalSend)],
      ])

      // 列宽
      totalSheet.getColumn(1).width = 40 // 名稱
      totalSheet.getColumn(2).width = 40
      totalSheet.getColumn(3).width = 20 // 單位
      totalSheet.getColumn(4).width = 20 // 零售價
      totalSheet.getColumn(5).width = 20 // 數量
      totalSheet.getColumn(6).width = 20 // 金額$
      // Font size
      totalSheet.getRow(1).font = { size: 12, bold: true }
      // 合并单元格
      totalSheet.mergeCells('A1:B1')

      wb.xlsx.writeBuffer()
        .then( function (xls64) {
          saveAs(
            new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            wbName
          )
        }).catch(error => {
          console.log(error.message)
          const code = error.status || error.code || '1000003'
          const message = error.message || 'unknown error 1000003'

          this.$notify.error({
            position: 'bottom-left',
            title: code,
            message
          })
        })
    }
  }
}
</script>

<style scoped>
.home-search {
  margin-bottom: 16px;
}
</style>
