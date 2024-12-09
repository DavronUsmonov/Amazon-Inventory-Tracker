<template>
  <div class="links">
    <RouterLink class="link" to="/dashboard">Dashboard</RouterLink>
    <RouterLink class="link" to="/Inventory">Inventory</RouterLink>
  </div>


<div style="margin: 20px;">
  <h1>Orders</h1>
  <div style="margin-bottom: 10px;">
    <button @click="addRow" style="padding: 5px 10px;">Add Row</button>
  </div>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="width: 100%; height: 400px;"
    :rowData="orders"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :animateRows="true"
    ref="gridRef"
  ></ag-grid-vue>
  <div class="orders-bottom">
    <button @click="saveOrders" style="padding: 5px 10px;">Save</button>
    <p>Total number of orders: {{ orders.length }}</p>
  </div>
</div>

</template> 


<script setup>
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Theme CSS

import axios from 'axios'
import {ref, onBeforeMount, reactive} from 'vue'

const gridRef = ref(null);

const state = reactive({
  id: null
});

const columnDefs = ref([
  { field: 'date', headerName: 'Date', sortable: true, filter: true, editable: true, cellDataType:'date', valueFormatter: p => (p.value) ? new Date().toJSON().split("T")[0] : null},
  { field: 'supplier', headerName: 'Supplier', sortable: true, filter: true, editable: true, cellDataType: 'text' },  
  { field: 'product_name', headerName: 'Item Name', sortable: true, filter: true, editable: true, cellDataType: 'text' },
  { field: 'sku', headerName: 'SKU', sortable: true, filter: true, editable: true, cellDataType: 'text' },
  { field: 'asin', headerName: 'ASIN', sortable: true, filter: true, editable: true, cellDataType: 'text' },
  { field: 'order_number', headerName: 'Order Number', sortable: true, filter: true, editable: true, cellDataType: 'text'},
  { field: 'location', headerName: 'Location', sortable: true, filter: true, editable: true, cellDataType: 'text' },
  { field: 'quantity', headerName: 'Quantity', sortable: true, filter: true, editable: true, cellDataType: 'number', valueFormatter: p => (p.value) ? ((p.value % 1 != 0) ? p.value : Math.trunc(p.value)) : null},
  { field: 'price', headerName: 'Price Per Unit($)', sortable: true, filter: true, editable: true, cellDataType: 'number', valueFormatter: p => (p.value) ? '$' + p.value : null},
  { field: 'total_price', headerName: 'Total Price', sortable: true, filter: true, editable: true, cellDataType: 'number', valueFormatter: p => (p.value) ? '$' + p.value : null },
  { field: 'status', headerName: 'Status', sortable: true, filter: true, editable: true, cellDataType: 'text' },
]);

const defaultColDef = ref({
  resizable: true,
  filter: true,
  sortable: true,
});

const addRow = () => {
  // Add a new row with blank fields
  orders.value.push({
    order_id:null,
    user_id: state.id,
    asin: '',
    supplier: '',
    product_name: '',
    quantity: null,
    price: null,
    total_price: null,
    date: null,
    status: null,
    sku: '',
    order_number: '',
    location: ''
  });

  // Adds to client side
  gridRef.value.api.applyTransaction({
    add: [{}],
  });
};

const orders = ref([])

onBeforeMount(() => {
    axios.get('http://localhost:1337/api/user/orders', {withCredentials:true})
        .then(response => {
            orders.value = response.data
            console.log(orders.value[0])
        })
        .catch((err) => {
            console.log(err) 
        })

    axios.get('http://localhost:1337/api/user/info', {withCredentials:true})
      .then(response => {
          state.id = response.data.user.id
      })
      .catch((err) => {
          console.log(err)
      })
});

const saveOrders = () => {
    axios.post('http://localhost:1337/orders/save', orders.value, {withCredentials: true}).then(response => {
        console.log(response)
    }).catch(err => {
        console.log(err)
    })
}


</script>