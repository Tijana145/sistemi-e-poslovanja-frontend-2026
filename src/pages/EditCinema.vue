<script lang="ts" setup>
import Loading from '@/components/loading.vue';
import { CinemaService } from '@/services/cinema.service';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const id = Number(route.params.id)

const cinema = ref <any>()
CinemaService.getCinemaById(id)
    .then(rsp => cinema.value = rsp.data)
</script>

<template>
    <div class="card crud-container" v-if="cinema">
        <div class="card-header fw-bold">
            Edit cinema
        </div>
        <div class="card-body">
        <div class="mb-3">
            <label for="name" class="form-label">Name: </label>
            <input type="name" class="form-control" id="name" v-model="cinema.name">
        </div>
        <div class="mb-3">
            <label for="address" class="form-label">Address: </label>
            <input type="name" class="form-control" id="address" v-model="cinema.address">
        </div>
        </div>
        <div class="card-footer">
            <button type="button" class="btn btn-success">
                <i class="fa-solid fa-floppy-disk"></i> Save
            </button>
        </div>
    </div>
    <Loading v-else />
</template>