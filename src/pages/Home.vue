<script setup lang="ts">
import Loading from '@/components/loading.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { MovieModel } from '@/models/movie.model';
import { MovieService } from '@/services/movie.service';
import { onMounted, ref } from 'vue';

const logout = useLogout()
const movies = ref<MovieModel[]>()

onMounted(() => {
    MovieService.getMovies()
        .then(rsp => movies.value = rsp.data)
        .catch(e => {
            if (e.message === 'Status code: 403') return
            logout(e)
        })
})
</script>

<template>
    <div v-if="movies" class="row g-3">
        <div
            class="col-6 col-md-4 col-lg-3 col-xl-2"
            v-for="movie in movies"
            :key="movie.movieId"
        >
            <div class="card h-100 movie-card">
                <img
                    :src="movie.poster"
                    :alt="movie.title"
                    class="card-img-top movie-poster"
                >
                <div class="card-body p-2">
                    <h6 class="card-title mb-1 fw-bold">{{ movie.title }}</h6>
                    <p class="card-text text-body-secondary small mb-0">
                        {{ movie.director?.name }}
                    </p>
                </div>
                <div class="card-footer p-2">
                    <RouterLink
                        :to="`/details/${movie.movieId}`"
                        class="btn btn-sm btn-primary w-100"
                    >
                        <i class="fa-solid fa-arrow-up-right-from-square me-1"></i>
                        Details
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
    <Loading v-else />
</template>

<style scoped>
.movie-poster {
    width: 100%;
    aspect-ratio: 2 / 3;
    object-fit: cover;
}

.movie-card {
    transition: transform 0.2s;
}

.movie-card:hover {
    transform: translateY(-4px);
}
</style>