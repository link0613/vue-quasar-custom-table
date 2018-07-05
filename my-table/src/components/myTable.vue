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
      console.log(pagination)
      axios
      .get(`https://randomuser.me/api/?results=${pagination.rowsPerPage}&page=${pagination.page}`)
      .then(({ data }) => {
        console.log (data)
        // updating pagination to reflect in the UI
        this.serverPagination = pagination

        // we also set (or update) rowsNumber

        // then we update the rows with the fetched ones
        this.serverData =  data.results
        // for (let i=0; i<this.serverPagination.rowsNumber; i++) {
        //   this.serverData[i].username = data.results[i].username
        //   this.serverData[i].city = data.results[i].city
        //   this.serverData[i].phone = data.results[i].phone
        // }


        // finally we tell QTable to exit the "loading" state
        this.loading = false
      })
      .catch(error => {
        // there's an error... do SOMETHING

        // we tell QTable to exit the "loading" state
        this.loading = false
      })
    }
  },
  mounted () {
    // once mounted, we need to trigger the initial server data fetch
    this.request({
      pagination: this.serverPagination,
    })
  }
}
</script>