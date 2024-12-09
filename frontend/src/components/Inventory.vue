<template>
    <div class="links">
        <RouterLink class="link" to="/Dashboard">Dashboard</RouterLink>
        <RouterLink class="link" to="/Orders">Orders</RouterLink>
    </div>
    <div style="margin: 20px;">
    <h1>Inventory</h1>
    <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: 400px;"
      :rowData="inventory"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :animateRows="true"
      ref="gridRef"
    ></ag-grid-vue>
  </div>
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Theme CSS

import axios from 'axios'
import {watch, ref, onMounted, onBeforeMount, reactive, defineComponent} from 'vue'

const gridRef = ref(null);

const columnDefs = ref([
  { field: 'sku', headerName: 'SKU', sortable: true, filter: true, editable: false, cellDataType: 'text' },
  { field: 'asin', headerName: 'ASIN', sortable: true, filter: true, editable: false, cellDataType: 'text' },
  { field: 'product_name', headerName: 'Item Name', sortable: true, filter: true, editable: false, cellDataType: 'text' },
  { field: 'quantity', headerName: 'Quantity', sortable: true, filter: true, editable: false, cellDataType: 'number', valueFormatter: p => (p.value) ? ((p.value % 1 != 0) ? p.value : Math.trunc(p.value)) : null},
  { field: 'price', headerName: 'Price Per Unit($)', sortable: true, filter: true, editable: false, cellDataType: 'number', valueFormatter: p => (p.value) ? '$' + p.value : null},
  { field: 'total_price', headerName: 'Total Price', sortable: true, filter: true, editable: false, cellDataType: 'number', valueFormatter: p => (p.value) ? '$' + p.value : null },
]);

const defaultColDef = ref({
  resizable: true,
  filter: true,
  sortable: true,
});

const inventory = ref([])

onBeforeMount(() => {
    axios.get('http://localhost:1337/api/user/inventory', {withCredentials:true})
        .then(response => {
            inventory.value = response.data
        })
        .catch((err) => {
            console.log(err) 
        })
});

</script>