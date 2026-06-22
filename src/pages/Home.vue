<script setup lang="ts">
import Loading from '@/components/loading.vue';
import type { MovieModel } from '@/models/movie.model';
import { MovieService } from '@/services/movie.service';
import { ref } from 'vue';


const movies = ref<MovieModel[]>([]) 


MovieService.getMovies()
  .then(rsp => movies.value = rsp.data)

</script>

<template>
<div class="d-flex flex-wrap gap-1 justify-content-center" v-if="movies.length > 0">
        <div class="card movie-card text-center" v-for="movie in movies">
            <img :src="movie.poster" class="card-img-top" alt="movie.title">
            <div class="card-body">
                <h5 class="card-title">{{ movie.title }}</h5>
                 <h6 class="card-subtitle mb-2 text-muted">{{movie.director.name}}</h6>    
            </div>
            <div class="card-footer">
                <RouterLink :to="`/details/${movie.movieId}`" class="btn btn-primary"> <i class="fa-solid fa-arrow-up-right-from-square"></i> Details</RouterLink>
            </div>
        </div>
    </div>  
<loading />
</template>

<style scoped>
.card {
    width: 16rem;
}
</style>