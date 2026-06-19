<script lang="ts" setup>
import { ref } from 'vue';

    const email = ref <string>('')
    const password = ref <string>('')
</script>

<template>
    <div class="card crud-container">
        <div class="card-header fw-bold"> Login </div>
        <div class="card-body">
                    <div class="mb-3">
            <label for="email" class="form-label">Email: </label>
            <input type="email" class="form-control" id="email" v-model="email">
        </div>
        <div class="mb-3">
            <label for="pass" class="form-label">Password: </label>
            <input type="password" class="form-control" id="pass" v-model="password">
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