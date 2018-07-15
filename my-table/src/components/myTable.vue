<template>

<div style="width: 100%">
    <q-table
      ref="table"
      :data="serverData"
      :columns="columns"
      row-key="id"
      :pagination.sync="serverPagination"
      :loading="loading"
      >  
    </q-table>
    
  <q-scroll-area
    ref="scrollArea"
    :style="`width: 100%; height: ${rowHeight*serverPagination.rowsPerPage}px;`"
    >
    <div v-for="(fi, index) in freezeRows" :key="index + '-freezeCell'" :style="`height:${rowHeight}px; display: flex; position: fixed; width: 100%; margin-top: ${(index) * rowHeight}px; background-color: #e6e6e6;`" class="q-row">
      <div v-for="col in columns" :key="col.name + index" :style="`width:${col.width}; background-color: #e6e6e6;`" class="q-cell">
        {{collectedData[index][col.name]}}
      </div>
    </div>

    <div ref="virtualTop" :style="`height:${getSpaceTop()}px;`"/>
    
    <div v-for="(row, index) in serverData" :key="index" :style="`height:${rowHeight}px; display: flex;`" class="q-row">
      <div v-for="col in columns" :key="col.name + index" :style="`width:${col.width}; background-color: #ffffff;`" class="q-cell">
        {{row[col.name]}}
      </div>
    </div>
    
    <div ref="virtualBottom" :style="`height:${getSpaceBottom()}px;`"/>
    <q-scroll-observable @scroll="scrolling" />
  </q-scroll-area>
</div>

</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      loading: false,
      requestSource: null,
      serverPagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 1000, // specifying this determines pagination is server-side
        rows: 20
      },
      rowHeight: 40, 
      serverData: [],
      collectedData: [],
      currentPage: 0,
      scrollOffset: 0,
      scrollUnit: 1,
      scrollUnitOffset: 0,
      freezeRows: 2,
      requestAPI: null,

      columns: [
        { name: 'no', label: 'No', field: 'no', sortable: false, width: '5%', align: 'left'},
        {
          name: 'id',
          required: true,
          label: 'Id',
          align: 'left',
          field: 'email',
          sortable: false,
          width: '15%'
        },
        { name: 'email', label: 'E-Mail', field: 'email', sortable: false, width: '30%', align: 'left',},
        { name: 'name', label: 'Name', field: 'name', sortable: false, align: 'left', width: '25%' },
        { name: 'phone', label: 'Phone', field: 'phone', sortable: false, align: 'left', width: '25%' }

      ]
    }
  },
  methods: {
    request ({ pagination }) {
      this.loading = true
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      console.log('request')
      const promise = axios
        .get(`/api/?row_per_page=${pagination.rowsPerPage}&page=${pagination.page}&rows=${pagination.rows}`, {cancelToken: source.token})
        .then(({ data }) => {
          for (let i = 0; i < data.length; i++) {
            let index = pagination.rowsPerPage * (pagination.page - 1)  + i 
            if (!this.collectedData[index]['id']) {
              this.collectedData[index] = data[i]
            }
          }
          this.renderData()
          this.loading = false
        })
        .catch(error => {
          console.log('error', error)
          this.loading = false
          this.renderData()
        })

      return {
        promise, source
      }
    },

    getSpaceTop() {
          return this.currentPage * this.rowHeight * this.serverPagination.rowsPerPage
    },

    getSpaceBottom() {
      return (this.serverPagination.rowsNumber - this.serverPagination.rowsPerPage * 2) * this.rowHeight - this.currentPage * this.rowHeight * this.serverPagination.rowsPerPage
    },


    renderData() {
      let index = this.currentPage * this.serverPagination.rowsPerPage
      for (let i = 0; i < this.serverPagination.rowsPerPage * 2 ; i++) {
        //tempData.push(this.collectedData[index + i])
        if (this.serverData.length < this.serverPagination.rowsPerPage * 2) {
          this.serverData.push(JSON.parse(JSON.stringify(this.collectedData[index + i])))
        } else {
          this.serverData[i] = JSON.parse(JSON.stringify(this.collectedData[index + i]))
        }
        
      }
      let thArray = this.$refs.table.$el.querySelectorAll('th')
      for (let i = 0; i < this.columns.length; i++) {
        thArray[i].style.width = this.columns[i].width
      }
    },



    scrolling (e) {
      const totalHeight = this.rowHeight * this.serverPagination.rowsNumber
      if (!e.position || e.position >= totalHeight) {
        //this.$refs.scrollArea.setScrollPosition(totalHeight)
        return
      }


      this.scrollUnit = totalHeight * 1.0 / this.serverPagination.rowsNumber
      this.scrollUnitOffset = (e.position * 1000 % (this.scrollUnit * 1000)) / 1000.0
      const vScrollOffset = e.position % (this.scrollUnit * this.serverPagination.rowsPerPage)

       
      
      const vCurrentPage = parseInt(e.position / totalHeight * (this.serverPagination.rowsNumber * 1.0 / this.serverPagination.rowsPerPage))
      if (this.scrollOffset == vScrollOffset && vCurrentPage - this.currentPage == 1) {
        this.currentPage = vCurrentPage - 1
        this.$refs.scrollArea.setScrollPosition(vScrollOffset + this.currentPage * this.scrollUnit * this.serverPagination.rowsPerPage)
      } else {
        this.currentPage = vCurrentPage
      }
      this.scrollOffset = vScrollOffset
      
      console.log(" curront page ", this.currentPage)

      this.isEnableScroll = false
      let index = this.currentPage * this.serverPagination.rowsPerPage

      
      let rendered = false
      if ((index < this.serverPagination.rowsNumber  &&
        !this.collectedData[index]['id'])) {
        rendered = true
        if (this.requestSource) {
          this.requestSource.cancel()
        }

        this.requestAPI = this.request({
          pagination: {
            page: this.currentPage + 1,
            rowsPerPage: this.serverPagination.rowsPerPage,
            rowsNumber: this.serverPagination.rowsNumber,
            rows: this.serverPagination.rowsPerPage * 2
          },
        })
        this.requestSource = this.requestAPI.source

      } 
      if (!rendered && (index + this.serverPagination.rowsPerPage < this.serverPagination.rowsNumber  &&
        !this.collectedData[index + this.serverPagination.rowsPerPage]['id'])) {
        
        console.log(index +this.serverPagination.rowsPerPage, "------"  )
        rendered = true
        if (this.requestSource) {
          this.requestSource.cancel()
        }

        this.requestAPI = this.request({
          pagination: {
            page: this.currentPage + 2,
            rowsPerPage: this.serverPagination.rowsPerPage,
            rowsNumber: this.serverPagination.rowsNumber,
            rows: this.serverPagination.rowsPerPage * 2
          },
        })
        this.requestSource = this.requestAPI.source

      } 

      if (!rendered) this.renderData()
    }
  },

  beforeMount() {
    this.collectedData = []
    for (let i = 0; i < this.serverPagination.rowsNumber + this.serverPagination.rowsPerPage * 2; i ++) {
      this.collectedData.push({num: i + 1, id: null, email: '' , name: '', phone: ''})
    }    
  },
  mounted () {
    const request = this.request({
      pagination: this.serverPagination,
    })
    this.requestSource = request.source
  },
  
}
</script>
<style>
  tbody {
    display: none;
  }
  .q-table-bottom {
    display: none;
  }
  .q-row {
    border-bottom: 1px solid rgba(0,0,0,.12)
  }
  .q-cell {
    display: flex;
    align-content: center;
    padding: 10px;
    font-weight: 400;
    font-size: 13px;
  }
</style>