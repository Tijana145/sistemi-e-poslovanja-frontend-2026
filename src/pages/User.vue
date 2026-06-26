<script lang="ts" setup>
import Loading from '@/components/loading.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { InvoiceModel } from '@/models/invoice.model';
import type { UserModel } from '@/models/user.model';
import { DataService } from '@/services/data.service';
import { ref } from 'vue';

const logout = useLogout()
const user = ref<UserModel>()
const loading = ref(true)

DataService.useAxios('/user/profile')
    .then(rsp => user.value = rsp.data)
    .catch(e => logout(e))
    .finally(() => loading.value = false)

function getTotal(invoice: InvoiceModel){
    let total = 0
    for (let item of invoice.invoiceItems){
        total += item.pricePerItem * item.count
    }
    return total
}
</script>

<template>
    <Loading v-if="loading" />

    <div class="row" v-else-if="user">
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
                    <button type="button" class="btn btn-success">Save</button>
                </div>
            </div>
        </div>

        <!-- INVOICES -->
        <div class="col-12 col-md-6">
            <div class="card">
                <div class="card-header fw-bold">Invoices</div>
                <div class="card-body p-0">
                    <table class="table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Total</th>
                                <th scope="col">Paid At</th>
                                <th scope="col">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="user.invoices?.length === 0">
                                <td colspan="4" class="text-center text-body-secondary py-3">
                                    No invoices yet
                                </td>
                            </tr>
                            <tr v-for="invoice in user.invoices" :key="invoice.invoiceId">
                                <th scope="row">{{ invoice.invoiceId }}</th>
                                <td>{{ getTotal(invoice) }} RSD</td>
                                <td>{{ new Date(invoice.pursTime).toLocaleString() }}</td>
                                <td>
                                    <RouterLink :to="`/invoice/${invoice.invoiceId}`" class="btn btn-sm btn-info">
                                        <i class="fa-solid fa-file-invoice"></i>
                                    </RouterLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>