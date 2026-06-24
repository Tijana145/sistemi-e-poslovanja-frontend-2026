<script lang="ts" setup>
import { DataService } from '@/services/data.service';
import { ref } from 'vue';


const user = ref<any[]>()
DataService.useAxios('/user/profile')
    .then(rsp => user.value = rsp.data)
</script>

<template>
    <h4>User Detail Page</h4>
    <pre> {{ user }}</pre>
</template>


