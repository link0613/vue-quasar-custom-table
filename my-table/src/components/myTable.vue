<template>

<div style="width: 100%">
    <q-table
      ref="table"
      :data="serverData"
      :columns="columns"
      row-key="email"
      :pagination.sync="serverPagination"
      :loading="loading"
      >  
    </q-table>
    
  <q-scroll-area
    @scroll="scrolling"
    ref="scrollArea"
    :style="`width: 100%; height: ${rowHeight*serverPagination.rowsPerPage}px;`"
    :thumb-style="{
      right: '4px',
      borderRadius: '5px',
      background: 'red',
      width: '10px',
      opacity: 1
    }"
    :delay="1" >
    <div v-for="(fi, index) in freezeRows" :key="index + '-freezeCell'" :style="`height:${rowHeight}px; display: flex; position: fixed; width: 100%; margin-top: ${(index) * rowHeight}px; background-color: #e6e6e6;`" class="q-row">
      <div v-for="col in columns" :key="col.name" :style="`width:${col.width}; background-color: #e6e6e6;`" class="q-cell">
        {{collectedData[index][col.name]}}
      </div>
    </div>

    <div ref="virtualTop"/>
    
    <div v-for="(row, index) in serverData" :key="index" :style="`height:${rowHeight}px; display: flex;`" class="q-row">
      <div v-for="col in columns" :key="col.name" :style="`width:${col.width}; background-color: #ffffff;`" class="q-cell">
        {{row[col.name]}}
      </div>
    </div>
    
    <div ref="virtualBottom"/>

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
      requestSource2: null,
      serverPagination: {
        page: 1,
        rowsPerPage: 6,
        rowsNumber: 60, // specifying this determines pagination is server-side
        rows: 12
      },
      rowHeight: 40, 
      serverData: [],
      collectedData: [],
      currentPage: 0, // from 0
      scrollOffset: 0,
      scrollUnit: 1,
      scrollUnitOffset: 0,
      freezeRows: 1,
      requestAPI: null,
      requestAPI2: null,

      isEnableScroll: true,
      columns: [
        {
          name: 'id',
          required: true,
          label: 'Id',
          align: 'left',
          field: 'email',
          sortable: false,
          width: '25%'
        },
        { name: 'email', label: 'E-Mail', field: 'email', sortable: false, width: '25%' },
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
        .get(`/api/?row_per_page=${pagination.rowsPerPage}&page=${pagination.page}&rows=${pagination.rowsPerPage * 2}`, {cancelToken: source.token})
        .then(({ data }) => {
          for (let i = 0; i < pagination.rowsPerPage * 2; i++) {
            let index = pagination.rowsPerPage * (pagination.page - 1)  + i 
            if (!this.collectedData[index]['id']) {
              this.collectedData[index] = data.results[i]
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


    renderData() {
      console.log("currentPage", this.currentPage + 1)
      let tempData = []
      let index = this.currentPage * this.serverPagination.rowsPerPage
      for (let i = 0; i < this.serverPagination.rowsPerPage * 2 ; i++) {
        tempData.push(this.collectedData[index + i])
      }
      this.serverData = tempData

      let vTop = this.currentPage * this.rowHeight * this.serverPagination.rowsPerPage
      this.$refs['virtualTop'].style.height = `${vTop}px`
      this.$refs['virtualBottom'].style.height = `${(this.serverPagination.rowsNumber - this.serverData.length) * this.rowHeight -vTop}px`


    },


    scrolling (e) {
      
      if (e.path[1] == this.$refs['scrollArea'].$el){
        if (!this.isEnableScroll) return
        this.isEnableScroll = false
        setTimeout(()=>{
          this.isEnableScroll = true
        },60)
        
        this.currentPage = parseInt(e.path[0].scrollTop / e.path[0].scrollHeight * (this.serverPagination.rowsNumber * 1.0 / this.serverPagination.rowsPerPage))
        if (this.currentPage >= this.serverPagination.rowNumber/this.serverPagination.rowsPerPage) this.currentPage = this.serverPagination.rowNumber/this.serverPagination.rowsPerPage - 1 
        this.scrollUnit = e.path[0].scrollHeight * 1.0 / this.serverPagination.rowsNumber
        this.scrollUnitOffset = (e.path[0].scrollTop * 1000 % (this.scrollUnit * 1000)) / 1000.0
        this.scrollOffset = e.path[0].scrollTop % (this.scrollUnit * this.serverPagination.rowsPerPage)

        let index = this.currentPage * this.serverPagination.rowsPerPage

        console.log(this.currentPage, this.collectedData[index]['email'])

        let rendered = false
        if (index < this.serverPagination.rowsNumber  &&
          !this.collectedData[index]['email']) {
            
          rendered = true
          if (this.requestSource) {
            this.requestSource.cancel()
          }

          setTimeout(()=>{
            this.requestAPI = this.request({
              pagination: {
                page: this.currentPage + 1,
                rowsPerPage: this.serverPagination.rowsPerPage,
                rowsNumber: this.serverPagination.rowsNumber,
                rows: this.serverPagination.rowsPerPage * 2
              },
            })
            this.requestSource = this.requestAPI.source
          }, 10)

          
        }  
        
        if (index + this.serverPagination.rowsPerPage <= this.serverPagination.rowsNumber  &&
          !this.collectedData[index + this.serverPagination.rowsPerPage]['email']) {
          rendered = true
         
          if (this.requestSource2) {
            this.requestSource2.cancel()
          }
          setTimeout(()=>{
            this.requestAPI2 = this.request({
              pagination: {
                page: this.currentPage + 1 + 1,
                rowsPerPage: this.serverPagination.rowsPerPage,
                rowsNumber: this.serverPagination.rowsNumber,
                rows: this.serverPagination.rowsPerPage * 2
              },
            })
            this.requestSource2 = this.requestAPI2.source
          }, 10)
 
        }
        
        this.renderData()
      }
    }
  },
  beforeMount () {
    document.addEventListener('scroll', this.scrolling, true)
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.scrolling, true)
  },
  mounted () {
    this.collectedData = []
    for (let i = 0; i < this.serverPagination.rowsNumber + this.serverPagination.rowsPerPage * 2; i ++) {
      this.collectedData.push({id:null, email:'' , name:'', phone:''})
    }
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