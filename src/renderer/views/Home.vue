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

        <el-button
          class="home-form-item"
          type="primary"
          :disabled="multipleSelection.length === 0"
          @click="getTxt">給供應商</el-button>
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
          width="180px">
          <template slot-scope="scope">
            <div>{{ $$moment(scope.row.mtime).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="checked"
          width="80px">
          <template slot-scope="scope">
            <i v-if="scope.row.checked===1" class="el-icon-check"></i>
            <i v-else-if="scope.row.checked===-1" class="el-icon-close"></i>
          </template>
        </el-table-column>

        <el-table-column
          label="discount($)"
          width="100px">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.discount"
              @change="setScope(scope.row)"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="note">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.note"
              @change="setScope(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>

      <div class="home-txt" :class="{ showTxt }">
        <div class="close">
          <i class="close-home-btn el-icon-close" @click="showTxt=false"></i>
          <i class="copy-btn el-icon-document-copy" @click="copyTxt"></i>
        </div>
        <div class="container">
          <div class="item table">
            <table class="txttable" style="width: 100%;">
              <thead>
                <tr>
                  <th><!-- Choose --></th>
                  <th>Source</th>
                  <th>Ratio</th>
                  <th>Name</th>
                  <th>Count</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in tlist" :key="item.key" :class="{ ignore: !item.choose }">
                  <td>
                    <el-checkbox v-model="item.choose" @change="setItem(item)"></el-checkbox>
                    <!-- <input type="CheckBox" name="choose" :value="item.choose"> -->
                  </td>
                  <td>
                    {{ `${item.sourceName} ${item.sourceCount}${item.sourceUnit}` }}
                  </td>
                  <td>
                    <!-- {{ item.ratio }} -->
                    <el-input
                      v-model="item.ratio"
                      @change="setItem(item)"
                      :disabled="!item.choose"
                      style="width: 60px;"></el-input>
                  </td>
                  <td>
                    <!-- {{ item.name }} -->
                    <el-input
                      v-model="item.name"
                      @change="setItem(item)"
                      :disabled="!item.choose"></el-input>
                  </td>
                  <td  style="text-align: right; padding-right: 4px;">
                    {{ item.sourceCount * item.ratio | formatNum }}
                  </td>
                  <td>
                    <!-- {{ item.unit }} -->
                    <el-input
                      v-model="item.unit"
                      @change="setItem(item)"
                      :disabled="!item.choose"
                      style="width: 60px;"></el-input>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <textarea id="txtout" class="item txt" v-model="ttext" readonly></textarea>
        </div>
      </div>
    </div>
  </j-layout>
</template>

<script>
import JLayout from '../components/JLayout.vue'
import { mapState } from 'vuex'

import * as Excel from 'exceljs/dist/es5/exceljs.browser';
import { saveAs } from 'file-saver';

import fun from '../../util/fun.js'
const { fixNumber, getCount } = fun

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
      multipleSelection: [],
      showTxt: false,
      tlist: []
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
    },
    ttext () {
      return this.tlist
        .filter(({ choose }) => choose)
        .map(({ name, sourceCount, ratio, unit }) => {
          const count = getCount(sourceCount, ratio)
          return [
            name,
            ' ',
            count,
            unit
          ].join('')
        }).join('\n')
    }
  },

  watch: {
    async dateStr (value) {
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

  filters: {
    formatNum(value) {
      if (value % 1 === 0) return value
      return value.toFixed(1)
    }
  },

  async mounted () {
    // console.log('Home mounted:', accMul('1200ttt', 100))
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
        const { code, message, data } = await this.$$back.sendIpc(msg)
        // console.log(data)
        if (code === 0) {
          txtlist = data

          for (let i = 0, len = txtlist.length; i < len; i++) {
            const item = txtlist[i]
            // console.log(item)
            const { data: { discount, note } } = await this.$$back.sendWork('getExcel', item.key)
            item.discount = fixNumber(discount)
            item.note = note
          }
        }
      }

      // console.log(txtlist)
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

    async downloadExcelTest () {
      // console.log('downloadExcelTest')

      const wbName = 'excelTestFormula.xlsx'
      const wb = new Excel.Workbook()

      const sheet = wb.addWorksheet('My Sheet')

      sheet.addRows([
        [2, 4, { formula: 'A1*B1', result: 8 }],
        [4, 6, { formula: 'A2*B2', result: 24 }],
        [3, 2, { formula: 'A3*B3', result: 6 }],
        ['', '', { formula: 'SUM(C1:C3)', result: 38 }]
      ])

      sheet.getColumn(3).font = { color: { argb: 'FF0000FF' } }

      wb.xlsx.writeBuffer()
        .then(xls64 => {
          saveAs(
            new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            wbName
          )
        }).catch(error => {
          console.error(error.message)
          const code = error.status || error.code || '1000003'
          const message = error.message || 'unknown error 1000003'

          this.$notify.error({
            position: 'bottom-left',
            title: code,
            message
          })
        })
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
            const { filepath, name, key, mtime, note } = multiple[i]
            // console.log({ filepath, name, key, mtime })

            const msg = {
              key: 'coverTxt',
              req: {
                filepath,
                name
              }
            }
            const { code, message, data } = await this.$$back.sendIpc(msg)
            const { data: { discount } } = await this.$$back.sendWork('getExcel', key)

            let checked = -1
            if (code === 0 && !isNaN(discount)) {
              checked = 1

              data.discount = discount
              data.note = note
              arr.push(data)
            }

            const index = this.findIndex(key)
            if (index > -1) {
              const row = {
                filepath,
                name,
                key,
                mtime,
                checked,
                discount: fixNumber(discount),
                note
              }
              this.txtlist.splice(index, 1, row)

              if (checked === 1) {
                this.$refs.multipleTable.toggleRowSelection(row)
              }
            }


            if (code !== 0) {
              this.$notify.error({
                position: 'bottom-left',
                title: code,
                message
              })
              loading.close()
              return
            } else if (isNaN(discount)) {
              this.$notify.error({
                position: 'bottom-left',
                title: 'discount',
                message: 'NaN'
              })
              loading.close()
              return
            }
          }

          loading.close()

          // download excel
          this.download(arr)
        } catch (error) {
          console.error(error.message)
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

    getTotal (arr) {
      const len = arr.length
      if (len === 0) return []

      const totalMap = {
        /**
         * key: '名稱,零售價'
         * value: ['名稱', '', '單位', '零售價', '數量++', '金額$++']
         */
      }
      for (let i = 0; i < len; i++) {
        const { list } = arr[i]
        this.coverlist(list, totalMap)
      }

      // Total
      return this.getTotalList2(totalMap)
    },
    async getTxt () {
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
            const { filepath, name, key, mtime, discount, note } = multiple[i]
            // console.log({ filepath, name, key, mtime })

            const msg = {
              key: 'coverTxt',
              req: {
                filepath,
                name
              }
            }
            const { code, message, data } = await this.$$back.sendIpc(msg)

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
                checked,
                discount,
                note
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

          const total = this.getTotal(arr)
          // console.log({ total })

          const tlen = total.length
          if (tlen > 0) {
            const list = []
            for (let i = 0; i < tlen; i++) {
              const [sourceName, sourceUnit, sourceCount] = total[i]

              const { data: { key, name, unit, ratio, choose } } = await this.$$back.sendWork('getTxt', { sourceName, sourceUnit })

              list.push({
                key, sourceName, sourceUnit,
                name, unit, ratio, choose,
                // 特殊不用保存到 db
                sourceCount
              })
            }
            this.tlist = list

            this.showTxt = true
          }

          loading.close()
        } catch (error) {
          console.error(error.message)
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

      const map = list.map((item, index) => {
        item[3] = fixNumber(item[3])
        // item[5] = fixNumber(item[5])
        const n = index + 2
        item[5] = { formula: `D${ n }*E${ n }`, result: fixNumber(item[5]) }
        return item
      })

      map.unshift(['名稱', '', '單位', '零售價', '總數量', '總金額$'])

      return map
    },
    getTotalList2(totalMap) {
      const list = []
      for (const key in totalMap) {
        list.push(totalMap[key])
      }

      const map = list.map(item => {
        return [
          item[0],
          // item[0].split('(')[0].trim(),
          item[2].split('/')[0].trim(),
          item[4]
        ]
      })

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
      const map = list.map((item, index) => {
        this.updateTotalMap(item, totalMap)
        item[3] = fixNumber(item[3])
        // item[5] = fixNumber(item[5])
        const n = index + 11
        item[5] = { formula: `D${ n }*E${ n }`, result: fixNumber(item[5]) }
        return item
      })

      map.unshift(['名稱', '', '單位', '零售價', '數量', '金額$'])

      return map
    },
    download (arr) {
      // console.log(arr)
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
        const { name, head, excelCount, send, discount, total, list, note } = arr[i]

        totalCount += excelCount
        totalSend += send
        totalDiscount += discount
        totalTotal += total

        const nameSheet = wb.addWorksheet(name)

        // Header
        nameSheet.addRows(head)

        nameSheet.addRow([note])

        const _list = this.coverlist(list, totalMap)
        nameSheet.addRows(_list)

        // Footer
        const _listlength = _list.length
        const excelCountObj = { formula: `SUM(E11:E${9 + _listlength})`, result: excelCount }
        const totalObj = { formula: `SUM(F11:F${9 + _listlength})`, result: fixNumber(total) }
        const allObj = { formula: `SUM(F${10 + _listlength}:F${12 + _listlength})`, result: fixNumber(total + discount + send) }
        nameSheet.addRows([
          ['', '', '', '', excelCountObj, totalObj],
          ['', '', '', '', '上門費:', fixNumber(send)],
          ['', '', '', '', '退款/折扣:', fixNumber(discount)],
          ['', '', '', '', '收入:', allObj],
          []
        ])

        // 列宽
        nameSheet.getColumn(1).width = 40 // 名稱
        nameSheet.getColumn(2).width = 40
        nameSheet.getColumn(3).width = 20 // 單位
        nameSheet.getColumn(4).width = 20 // 零售價
        nameSheet.getColumn(5).width = 20 // 數量
        nameSheet.getColumn(6).width = 20 // 金額$
        nameSheet.getColumn(6).font = { color: { argb: 'FF0000FF' } }

        // Font size
        nameSheet.getRow(1).font = { size: 14, bold: true }
        nameSheet.getRow(2).font = { size: 14, bold: true }
        nameSheet.getRow(3).font = { size: 14, bold: true }
        nameSheet.getRow(4).font = { size: 14, bold: true }
        nameSheet.getRow(5).font = { size: 14, bold: true }
        nameSheet.getRow(6).font = { size: 14, bold: true }
        nameSheet.getRow(7).font = { size: 14, bold: true }
        nameSheet.getRow(9).font = { size: 16, bold: true, color: { argb: 'FFFF0000' } }
        nameSheet.getRow(10).font = { size: 12, bold: true }
        // 合并单元格
        nameSheet.mergeCells('A10:B10')
      }

      // Total sheet
      const _totalList = this.getTotalList(totalMap)
      const totalSheet = wb.addWorksheet('Total')

      totalSheet.addRows(_totalList)

      // Footer
      const _totalListlength = _totalList.length
      const totalCountObj = { formula: `SUM(E2:E${_totalListlength})`, result: totalCount }
      const totalTotalObj = { formula: `SUM(F2:F${_totalListlength})`, result: fixNumber(totalTotal) }
      const totalAllObj = { formula: `SUM(F${1 + _totalListlength}:F${3 + _totalListlength})`, result: fixNumber(totalTotal + totalDiscount + totalSend) }
      totalSheet.addRows([
        ['', '', '', '', totalCountObj, totalTotalObj],
        ['', '', '', '', '總上門費:', fixNumber(totalSend)],
        ['', '', '', '', '總退款/折扣:', fixNumber(totalDiscount)],
        ['', '', '', '', '總收入:', totalAllObj]
        // ['', '', '', '', '總成本:', ''],
      ])

      // 列宽
      totalSheet.getColumn(1).width = 40 // 名稱
      totalSheet.getColumn(2).width = 40
      totalSheet.getColumn(3).width = 20 // 單位
      totalSheet.getColumn(4).width = 20 // 零售價
      totalSheet.getColumn(5).width = 20 // 數量
      totalSheet.getColumn(6).width = 20 // 金額$
      totalSheet.getColumn(6).font = { color: { argb: 'FF0000FF' } }
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
          console.error(error.message)
          const code = error.status || error.code || '1000003'
          const message = error.message || 'unknown error 1000003'

          this.$notify.error({
            position: 'bottom-left',
            title: code,
            message
          })
        })
    },

    copyTxt() {
      const txt = document.getElementById('txtout')
      txt.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      // alert('已复制好，可贴粘。')
      this.$notify.success({
        position: 'bottom-right',
        title: 'Copy',
        message: '已复制好，可贴粘'
      })
    },

    async setItem({ key, sourceName, sourceUnit, name, unit, ratio, choose }) {
      await this.$$back.sendWork('setTxt', {
        key,
        sourceName,
        sourceUnit,
        name,
        unit,
        ratio,
        choose
      })
    },

    async setScope({ key, discount, note }) {
      // console.log({ key, discount, note })
      await this.$$back.sendWork('setExcel', {
        key, discount, note
      })
    }
  }
}
</script>

<style scoped>
.home-search {
  margin-bottom: 16px;
}

.home-txt {
  background: white;
  position: fixed;
  z-index: 1000;
  left: 100%;
  top: 0;
  width: 100%;
  height: 100%;
  transition: left 300ms ease-out;

  display: flex;
  flex-direction: column;
}
.home-txt.showTxt {
  left: 0;
  transition: left 300ms ease-in;
}

.home-txt .close {
  display: flex;
  justify-content: space-between;
}

.close-home-btn {
  padding: 8px;
  font-size: 32px;
}

.copy-btn {
  padding: 8px;
  font-size: 24px;
  color: #409EFF;
}

.home-txt .container {
  flex: auto;
  overflow: hidden;
  display: flex;
  padding: 0 8px 8px;
}
.home-txt .container .item {
  flex: auto;
}

.item.table {
  padding: 8px;
  overflow: auto;
}

.item.txt {
  padding: 8px;
}

.txttable tr.ignore {
  color: #ddd;
  text-decoration-line: line-through;
}
.txttable td {
  border-top: 1px solid #ddd;
}
</style>
