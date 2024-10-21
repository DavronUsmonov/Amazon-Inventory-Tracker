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
      <tr>
        <th></th>
        <th>ASIN</th>
        <th>Supplier</th>
        <th>Product Name</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total Price</th>
      </tr>
    </thead>
    <tbody>
      <!-- Rows will be generated here by JavaScript -->
    </tbody>
  </table>

</template> 


<script setup>
import axios from 'axios'
import {watch, ref, onMounted, onBeforeMount, reactive} from 'vue'

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
        tr.appendChild(rowHeader);

        for(let col=1;col <= 6; col++) {
            const td = document.createElement('td');
            const category = COLUMNS[col];
            td.innerHTML=orders.value[row-1][category];
            tr.appendChild(td);
        }
        tableBody.append(tr);
    }
}


</script>