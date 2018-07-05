<template>
  <q-table
    ref="table"
    :data="serverData"
    :columns="columns"
    row-key="email"
    :pagination.sync="serverPagination"
    :loading="loading"
    @request="request"
  >
  </q-table>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      loading: false,
      serverPagination: {
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 100 // specifying this determines pagination is server-side
      },

      serverData: [],
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
      // we set QTable to "loading" state
      this.loading = true

      // (using Axios here, but can be anything; parameters vary based on backend implementation)
      axios
      .get(`https://randomuser.me/api/?results=${pagination.rowsPerPage}&page=${pagination.page}`)
      .then(({ data }) => {
        // updating pagination to reflect in the UI
        this.serverPagination = pagination

        // we also set (or update) rowsNumber

        // then we update the rows with the fetched ones
        this.serverData =  data.results

        // finally we tell QTable to exit the "loading" state
        this.loading = false
        setTimeout(() => {
          let td = this.$el.querySelectorAll('td')
          for (let i = 0; i < td.length; i++) {
              td[i].style.height = '30px'
          }
        }, 0);
      })
      .catch(error => {
        // there's an error... do SOMETHING

        // we tell QTable to exit the "loading" state
        this.loading = false
      })
    },
    scrolling (e) {
      if (e.path[1] == this.$el.querySelector('table')){
        console.log(e.path[0].scrollTop, e.path[0].scrollHeight)
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
    this.request({
      pagination: this.serverPagination,
    })

  },


  
}
</script>
<style>
  tbody {
      display:block;
      height: 150px !important;
      overflow:auto;
  }
  thead, tbody tr {
      display:table;
      width:100%;
      table-layout:fixed;/* even columns width , fix width of table too*/
  }
  thead {
      width: calc( 100% - 1em )/* scrollbar is average 1em/16px width, remove it from thead width */
  }
  table {
      width:400px;
  }
 
</style>