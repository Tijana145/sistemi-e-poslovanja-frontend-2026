<script lang="ts" setup>

import type { InvoiceModel } from '@/models/invoice.model';
import type { UserModel } from '@/models/user.model';
import { DataService } from '@/services/data.service';
import { ref } from 'vue';


const user = ref<UserModel>()
DataService.useAxios('/user/profile')
    .then(rsp => user.value = rsp.data)

function getTotal(invoice: InvoiceModel){
    let total = 0
    for (let item of invoice.invoiceItems){
        total += item.pricePerItem * item.count
    }
    return total

}
</script>

<template>
  <div class="row" v-if="user">
    
    <!-- USER DETAILS -->
    <div class="col-12 col-md-6">
      <div class="card">
        <div class="card-header fw-bold">User Details</div>

        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">First name:</label>
            <input class="form-control" v-model="user.firstName" />
          </div>

          <div class="mb-3">
            <label class="form-label">Last name:</label>
            <input class="form-control" v-model="user.lastName" />
          </div>

          <div class="mb-3">
            <label class="form-label">Gender:</label>
            <select class="form-select" v-model="user.gender">
              <option value="m">Male</option>
              <option value="f">Female</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Email:</label>
            <input class="form-control" v-model="user.email" disabled />
          </div>
        </div>

        <div class="card-footer">
          <button type="button" class="btn btn-success">
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- INVOICES -->
    <div class="col-12 col-md-6">
      <div class="card">
        <div class="card-header fw-bold">Invoices</div>
        <div class="card-body"> 
        <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Total</th>
      <th scope="col">Paid At</th>
      <th scope="col">Options</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="invoice in user.invoices">
      <th scope="row">{{ invoice.invoiceId }}</th>
      <td>{{ getTotal(invoice) }} RSD </td>
      <td>{{ new Date(invoice.pursTime).toLocaleString() }}</td>
      <td>
        <div class="btn-group">
            <button type="button" class="btn btn-sm btn-info">
                <i class="fa-solid fa-qrcode"></i>
            </button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
    </div>
        <div class="card-body">
          <!-- invoices content -->
        </div>
      </div>
    </div>

  </div>
</template>

