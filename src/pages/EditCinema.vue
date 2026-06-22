<script lang="ts" setup>
import Loading from '@/components/loading.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { CinemaModel } from '@/models/cinema.model';
import { CinemaService } from '@/services/cinema.service';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const logout = useLogout()
const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const cinema = ref <CinemaModel>()
CinemaService.getCinemaById(id)
  .then(rsp => {
    cinema.value = Array.isArray(rsp.data) ? rsp.data[0] : rsp.data
  })

function update(){
    if(!confirm('Save changer?'))
        return

    CinemaService.updateCinema(id, cinema.value)
        .then(rsp=> router.push('/cinema'))
        .catch(e => logout(e))
}
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
            <button type="button" class="btn btn-success" @click="update">
                <i class="fa-solid fa-floppy-disk"></i> Save
            </button>
        </div>
    </div>
    <Loading v-else />
</template>