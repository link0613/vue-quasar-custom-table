<template>

  <q-scroll-area
    @scroll="scrolling"
    ref="scrollArea"
    style="width: 100%; height: 200px; margin-top: 60px;"
    :thumb-style="{
      right: '4px',
      borderRadius: '5px',
      background: 'red',
      width: '10px',
      opacity: 1
    }"
    :delay="0"
  >
    <div ref="virtualTop"/>
    <q-table
      ref="table"
      :data="serverData"
      :columns="columns"
      row-key="email"
      :pagination.sync="serverPagination"
      :loading="loading"
      >  
    </q-table>
    <div ref="virtualBottom"/>
  </q-scroll-area>
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
        rowsPerPage: 5,
        rowsNumber: 30 // specifying this determines pagination is server-side
      },
      rowHeight: 30, 
      serverData: [],
      collectedData: [],
      currentPage: 0, // from 0
      scrollOffset: 0,
      scrollUnit: 1,
      scrollUnitOffset: 0,
      columns: [
        {
          name: 'email',
          required: true,
          label: 'E-Mail',
          align: 'left',
          field: 'email',
          sortable: false
        },
        { name: 'nat', label: 'Nation', field: 'nat', sortable: false },
        { name: 'phone', label: 'Phone', field: 'phone', sortable: false }

      ]
    }
  },
  methods: {
    request ({ pagination }) {
      this.loading = true
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      const promise = axios
        .get(`https://randomuser.me/api/?results=${pagination.rowsPerPage * 2}&page=${Math.ceil(pagination.page / 2.0)}`, {cancelToken: source.token})
        .then(({ data }) => {
          for (let i = 0; i < pagination.rowsPerPage * 2; i++) {
            let index = (Math.ceil(pagination.page / 2.0) - 1) * pagination.rowsPerPage * 2 + i 
            if (this.collectedData[index]['email'] !== data.results[i]['email']) {
              this.collectedData[index] = data.results[i]
            }
          }
          this.renderData()
          this.loading = false
        })
        .catch(error => {
          // there's an error... do SOMETHING
          // we tell QTable to exit the "loading" state
          this.loading = false
        })

      return {
        promise, source
      }
    },


    renderData() {
      let tempData = [{}]
      let index = this.currentPage * this.serverPagination.rowsPerPage
      for (let i = 0; i < this.serverPagination.rowsPerPage * 2; i++) {
        tempData.push(this.collectedData[index + i])
      }
      this.serverData = tempData

      setTimeout(() => {
        let tr = this.$el.querySelectorAll('tr')
        for (let i = 2; i < tr.length - 1; i++) {
            tr[i].style.height = `${this.rowHeight}px`
        }

        let vTop = this.currentPage * this.rowHeight * this.serverPagination.rowsPerPage
        //this.$refs['virtualTop'].style.height = `${vTop}px`
        tr[1].style.height = `${vTop}px`
        tr[1].style.display = 'none'
        tr[1].style.display = this.currentPage === 0 ? 'none' : ''
        this.$refs['virtualBottom'].style.height = `${(this.serverPagination.rowsNumber - this.serverPagination.rowsPerPage) * this.rowHeight -vTop}px`

      }, 0);

    },


    scrolling (e) {
      if (e.path[1] == this.$refs['scrollArea'].$el){
        this.currentPage = parseInt(e.path[0].scrollTop / e.path[0].scrollHeight * (this.serverPagination.rowsNumber * 1.0 / this.serverPagination.rowsPerPage))
        this.scrollUnit = e.path[0].scrollHeight * 1.0 / this.serverPagination.rowsNumber
        this.scrollUnitOffset = (e.path[0].scrollTop * 1000 % (this.scrollUnit * 1000)) / 1000.0
        this.scrollOffset = e.path[0].scrollTop % (this.scrollUnit * this.serverPagination.rowsPerPage)

        console.log(this.scrollOffset, this.currentPage)
        let index = this.currentPage * this.serverPagination.rowsPerPage

        console.log(index)
        let rendered = false
        if (!this.collectedData[index]['email']) {
          rendered = true
          if (this.requestSource) {
            this.requestSource.cancel()
          }
          const request= this.request({
            pagination: {
              page: this.currentPage + 1,
              rowsPerPage: this.serverPagination.rowsPerPage,
              rowsNumber: this.serverPagination.rowsNumber

            },
          })
          this.requestSource = request.source
          
        }
        if (!this.collectedData[index + this.serverPagination.rowsPerPage]['email']) {
          rendered = true
          if (this.requestSource) {
            this.requestSource.cancel()
          }
          const request= this.request({
            pagination: {
              page: this.currentPage + 1 + 1,
              rowsPerPage: this.serverPagination.rowsPerPage,
              rowsNumber: this.serverPagination.rowsNumber

            },
          })
          this.requestSource = request.source
 
        }
        if (!rendered) {
          this.renderData()
        }
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
    for (let i = 0; i < this.serverPagination.rowsNumber; i ++) {
      this.collectedData.push({email:null, nat:'...', phone:'...'})
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
      display:block;
      overflow:auto;
  }
  thead, tbody tr {
      display:table;
      width:100%;
      table-layout:fixed;/* even columns width , fix width of table too*/
  }
  thead {
      width: calc( 100% - 1em );/* scrollbar is average 1em/16px width, remove it from thead width */
      position: fixed;
      margin-top: -60px;
  }
  table {
      width:400px;
  }
  .q-table tbody td {
    height: 0px !important;
  }
  .q-table-bottom {
    display: none;
  }
</style>