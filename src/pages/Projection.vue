<script setup lang="ts">
import Loading from '@/components/loading.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { CinemaModel } from '@/models/cinema.model';
import type { TimeTableModel } from '@/models/time.model';
import router from '@/router';
import { CinemaService } from '@/services/cinema.service';
import { InvoiceService } from '@/services/invoice.service';
import { TimeTableService } from '@/services/time.services';
import { onMounted, ref, computed } from 'vue';

const logout = useLogout()
const cinemas = ref<CinemaModel[]>()
const searchQuery = ref('')

const filteredCinemas = computed(() => {
    if (!cinemas.value) return []
    if (!searchQuery.value.trim()) return cinemas.value
    return cinemas.value.filter(c =>
        c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

function loadData(){
    CinemaService.getCinemasWithTimeTables()
        .then(rsp => cinemas.value = rsp.data)
        .catch(e => {
            if (e.message === 'Status code: 403') return
            logout(e)
        })
}

function remove(timeTable: TimeTableModel){
    if (!confirm(`Obrisi projekciju ${timeTable.movie.title} u ${timeTable.startTime}h ?`))
        return

    TimeTableService.deleteById(timeTable.timeTableId)
        .then(() => loadData())
        .catch(e => logout(e))
}

function addToCart(timeTableId: number){
    if (!confirm(`Dodaj u korpu?`))
        return

    InvoiceService.addTimeTableByIdToCart(timeTableId)
        .then(() => router.push('/cart'))
        .catch(e => {
            if (e.message === 'Status code: 403') {
                router.push('/login')
                return
            }
            logout(e)
        })
}

onMounted(() => loadData())
</script>

<template>
    <div v-if="cinemas">
        <div class="mb-3">
            <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Pretraži bioskop po nazivu ili adresi..."
            />
        </div>

        <div v-if="filteredCinemas.length === 0" class="text-muted text-center py-4">
            Nema rezultata za "{{ searchQuery }}"
        </div>

        <div class="card h-100 mb-3" v-for="cinema in filteredCinemas" :key="cinema.cinemaId">
            <div class="card-header fw-bold fs-5">
                {{ cinema.name }} ({{ cinema.address }})
            </div>
            <div class="card-body p-0 table-responsive">
                <table class="table table-hover table-sm mb-0">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th class="movie" scope="col">Movie</th>
                            <th class="director" scope="col">Director</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Start Time</th>
                            <th scope="col">Price</th>
                            <th scope="col">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="timeTable in cinema.timeTables" :key="timeTable.timeTableId">
                            <th scope="row">{{ timeTable.timeTableId }}</th>
                            <td class="movie">{{ timeTable.movie?.title }}</td>
                            <td class="director">{{ timeTable.movie?.director?.name }}</td>
                            <td>{{ timeTable.movie?.runTime }} min</td>
                            <td>{{ timeTable.startTime.slice(0,5) }} h</td>
                            <td class="text-nowrap">{{ timeTable.price }} RSD</td>
                            <td>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-sm btn-primary" @click="addToCart(timeTable.timeTableId)">
                                        <i class="fa-solid fa-cart-arrow-down"></i>
                                    </button>
                                    <RouterLink class="btn btn-sm btn-secondary" :to="`/details/${timeTable.movieId}`">
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    </RouterLink>
                                    <RouterLink class="btn btn-sm btn-success" :to="`/time-table/${timeTable.timeTableId}`">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </RouterLink>
                                    <button type="button" class="btn btn-sm btn-danger" @click="remove(timeTable)">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <Loading v-else />
</template>

<style scoped>
.movie { width: 360px; }
.director { width: 200px; }
</style>
