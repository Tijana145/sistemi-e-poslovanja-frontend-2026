<script lang="ts" setup>
import Loading from '@/components/loading.vue';
import { useLogout } from '@/hooks/logout.hook';
import { DataService } from '@/services/data.service';
import { ref, computed } from 'vue';

const logout = useLogout()
const cartItems = ref<any[]>([])  
const loading = ref(true)

DataService.useAxios('/invoice/cart')
    .then(rsp => cartItems.value = rsp.data)
    .catch(e => logout(e))
    .finally(() => loading.value = false)  // ← ugasi loading

const total = computed(() => {
    if (cartItems.value == undefined) return 0
    let current = 0
    for (let item of cartItems.value) {  
        current += item.count * item.timeTable.price
    }
    return current
})
function pay(){

}
function add(item:any){
    item.count = item.count + 1
}
function remove(item: any){
    if(item.count == 1) return
    item.count = item.count - 1
}

</script>

<template>
    <div class="card" v-if="!loading">
        <div class="card-header fw-bold">Items in Cart</div>
        <div class="card-body"> 
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Cinema</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">Price Per Item</th>
                        <th scope="col">Count</th>
                        <th scope="col">Total</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cartItems">
                        <th scope="row">{{ item.invoiceItemId }}</th>
                        <td>{{ item.timeTable.movie.title }}</td>
                        <td>{{ item.timeTable.cinema.name }}</td>
                        <td>{{ item.timeTable.startTime }}</td>
                        <td>{{ item.timeTable.price }} RSD </td>
                        <td>
                              <ul class="pagination">
                                <li class="page-item">
                                    <button type="button" class="page-link" @click="remove(item)">
                                      <i class="fa-solid fa-circle-minus"></i>  
                                    </button>
                                </li>
                                <li class="page-item">
                                    <div  class="page-link active">
                                        {{ item.count }}
                                    </div>
                                </li>
                                <li class="page-item">
                                    <button type="button" class="page-link" @click="add(item)">
                                    <i class="fa-solid fa-circle-plus"></i> 
                                    </button>
                                </li>
                            </ul>
                        </td>
                        <td>{{ item.count * item.timeTable.price}} RSD </td>
                        <td>
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-danger">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="card-footer"> 
            <div class="d-flex justify-content-between">
                <div class="fw-bold">Total: <span class="h4">{{ total }} RSD </span></div>
                <div>
                    <button  type="button" class="btn  btn-success" @click="pay()">
                      <i class="fa-solid fa-credit-card"></i> Pay Now
                  </button></div>
            </div>

        </div>
    </div>
    <Loading v-else/>
</template>