<script setup lang="ts">
import Loading from '@/components/loading.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { MovieModel } from '@/models/movie.model';
import { MovieService } from '@/services/movie.service';
import { onMounted, ref, computed } from 'vue';

const logout = useLogout()
const movies = ref<MovieModel[]>()
const searchQuery = ref('')

const filteredMovies = computed(() => {
    if (!movies.value) return []
    if (!searchQuery.value.trim()) return movies.value
    return movies.value.filter(m =>
        m.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        m.director?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

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
    <!-- HERO -->
    <section class="hero mb-4">
        <div class="hero-overlay">
            <div class="hero-badge">🎬 Dobrodošli</div>
            <h1 class="hero-title">Bioskop CineNova</h1>
            <p class="hero-subtitle">Otkrijte svet filma kroz pregled najnovijih ostvarenja, rasporeda projekcija i dostupnih sala.</p>
            <div class="hero-search">
                <div class="search-wrapper">
                    <i class="fa-solid fa-magnifying-glass search-icon"></i>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Pretraži filmove ili reditelja..."
                        class="search-input"
                    />
                    <span v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</span>
                </div>
            </div>
        </div>
    </section>

    <!-- MOVIE GRID -->
    <div v-if="movies">
        <p v-if="searchQuery && filteredMovies.length === 0" class="text-center text-body-secondary py-5">
            Nema rezultata za "<strong>{{ searchQuery }}</strong>"
        </p>
        <div class="row g-3">
            <div
                class="col-6 col-md-4 col-lg-3 col-xl-2"
                v-for="movie in filteredMovies"
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
    </div>
    <Loading v-else />
</template>

<style scoped>
/* ── HERO ── */
.hero {
    width: 100%;
    min-height: 380px;
    background-image:
        linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%),
        url('/hero.jpg');
    background-size: cover;
    background-position: center 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    overflow: hidden;
}

.hero-overlay {
    text-align: center;
    color: white;
    padding: 48px 32px;
    max-width: 640px;
    width: 100%;
}

.hero-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(6px);
    padding: 4px 16px;
    border-radius: 20px;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
}

.hero-title {
    font-size: 2.6rem;
    font-weight: 800;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
    line-height: 1.15;
}

.hero-subtitle {
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 28px;
    line-height: 1.5;
}

/* ── SEARCH ── */
.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 16px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    pointer-events: none;
}

.search-input {
    width: 100%;
    padding: 13px 44px 13px 42px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 1rem;
    background: rgba(0, 0, 0, 0.45);
    color: white;
    outline: none;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    backdrop-filter: blur(8px);
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.5);

}

.search-clear {
    position: absolute;
    right: 14px;
    color: #aaa;
    cursor: pointer;
    font-size: 0.85rem;
    user-select: none;
}

.search-clear:hover {
    color: #555;
}

/* ── CARDS ── */
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