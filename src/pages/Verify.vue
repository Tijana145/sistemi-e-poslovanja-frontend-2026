<script lang="ts" setup>
import { ref } from 'vue';

const code = ref <number>()
const email = sessionStorage.getItem('verify_email')

</script>

<template>
    <div class="card crud-container">
        <div class="card-header fw-bold"> Email Verification</div>
        <div class="card-body">
            <h3> The verification code has been sent to {{ email ?? 'your email' }} address</h3>
        <div class="mb-3">
            <label for="code" class="form-label">Verification code: </label>
            <input type="number" class="form-control" id="pass" v-model="code">
        </div>
        </div>
        <div class="card-footer">
            <div class="btn-group">
                <button type="button" class="btn btn-success">
                  <i class="fa-solid fa-arrow-right-to-bracket"></i>  Login
                </button>
                <RouterLink to="/signup" class="btn btn-secondary">
                  <i class="fa-solid fa-id-card"></i>  Create an account
                </RouterLink>
            </div>
        </div>
    </div>
</template>