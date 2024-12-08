<template>
<RouterLink to="/dashboard">Dashboard</RouterLink>
<h1>Orders</h1>
<form @submit.prevent="addOrderToLocal" id="new_order">
    <input v-model="order.asin" type="text" id="asin" placeholder="ASIN" name="asin">
    <input v-model="order.supplier" type="text" id="supplier" placeholder="Supplier" name="supplier">
    <input v-model="order.product_name" type="text" id="product_name" placeholder="Product Name" name="product_name">
    <input v-model="order.quantity" type="text" id="quantity" placeholder="Quantity" name="quantity">
    <input v-model="order.price" type="text" id="price" placeholder="Price" name="price">
    <input v-model="order.total_price" type="text" id="total_price" placeholder="Total Price" name="total_price">
    <button type="submit">Submit</button>
</form>


<p>Your total number of orders: {{ orders.length }}</p>
<table id="spreadsheet">
    <thead>
      <tr class="orders">
        <th class="row-h">#</th>
        <th class="order-cell">ASIN</th>
        <th class="order-cell">Supplier</th>
        <th class="order-cell">Product Name</th>
        <th class="order-cell">Quantity</th>
        <th class="order-cell">Price</th>
        <th class="order-cell">Total Price</th>
      </tr>
    </thead>
    <tbody>
      <!-- Rows will be generated here by JavaScript -->
    </tbody>
  </table>

  <div style="margin: 20px;">
    <h1>Order Inventory</h1>
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
    <button @click="saveOrders" style="padding: 5px 10px;">Save</button>
  </div>

</template> 


<script setup>
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Theme CSS

import axios from 'axios'
import {watch, ref, onMounted, onBeforeMount, reactive, defineComponent} from 'vue'

const gridRef = ref(null);

const state = reactive({
  id: null
});

const columnDefs = ref([
  { field: 'date', headerName: 'Date', sortable: true, filter: true, editable: true },
  { field: 'supplier', headerName: 'Supplier', sortable: true, filter: true, editable: true },  
  { field: 'product_name', headerName: 'Item Name', sortable: true, filter: true, editable: true },
  { field: 'sku', headerName: 'SKU', sortable: true, filter: true, editable: true },
  { field: 'asin', headerName: 'ASIN', sortable: true, filter: true, editable: true },
  { field: 'orderNumber', headerName: 'Order Number', sortable: true, filter: true, editable: true },
  { field: 'location', headerName: 'Location', sortable: true, filter: true, editable: true },
  { field: 'quantity', headerName: 'Quantity', sortable: true, filter: true, editable: true },
  { field: 'price', headerName: 'Price Per Unit($)', sortable: true, filter: true, editable: true },
  { field: 'total_price', headerName: 'Total Price', sortable: true, filter: true, editable: true },
  { field: 'status', headerName: 'Status', sortable: true, filter: true, editable: true },
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

  console.log(orders.value)
};

const order = reactive({
    asin: null,
    supplier: null,
    product_name: null,
    quantity: null,
    price: null,
    total_price: null,
})

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

watch(orders, ()=> {
    generateTable(orders.value.length)
});

const addOrderToLocal = () => {
    const asin = order.asin;
    const supplier = order.supplier;
    const product_name = order.product_name;
    const quantity = order.quantity;
    const price = order.price;
    const total_price = order.total_price;
    const newOrder = {asin, supplier, product_name, quantity, price, total_price};
    axios.post('http://localhost:1337/orders/new', newOrder, {withCredentials: true}).then(response => {
        console.log(response);
    }).catch(err => {
        console.log(err);
    });
    orders.value.push(newOrder);
    generateTable(orders.value.length)
};

const saveOrders = () => {
    console.log(orders.value)
    axios.post('http://localhost:1337/orders/save', orders.value, {withCredentials: true}).then(response => {
        console.log(response)
    }).catch(err => {
        console.log(err)
    })
}

const COLUMNS = {
    1: 'asin',
    2: 'supplier',
    3: 'product_name',
    4: 'quantity',
    5: 'price',
    6: 'total_price'
}

function generateTable(rows) {
    const tableBody = document.querySelector('#spreadsheet tbody');
    tableBody.innerHTML = "";
    for(let row = 1; row <= rows; row++) {
        const tr = document.createElement('tr');

        const rowHeader = document.createElement('th');
        rowHeader.textContent = row;
        rowHeader.setAttribute("class", "row-h")
        tr.appendChild(rowHeader);
        tr.setAttribute("class", "orders")

        for(let col=1;col <= 6; col++) {
            const td = document.createElement('td');
            td.setAttribute("class","order-cell")
            const category = COLUMNS[col];
            if(col >= 5) td.innerHTML = "$";
            td.innerHTML+=orders.value[row-1][category];
            tr.appendChild(td);
        }
        tableBody.append(tr);
    }
}


</script>