<script setup lang="ts">

type PageLink = { name: string, to: string, loggedIn?: boolean, admin?: boolean }

const pages: PageLink[] = [
    { name: "Home", to: "/" },
    { name: "Booking 1", to: "/bookings/39600" },
    { name: "Booking 2", to: "/bookings/37690" },
    { name: "Booking 3", to: "/bookings/33410" },
]

</script>

<template>
    <nav class="navbar navbar-expand-lg bg-primary navbar-dark">
        <div class="container-fluid">
            <NuxtLink class="navbar-brand" to="/"><img src="~/assets/theme/logo-white.svg" style="height: 32px"></NuxtLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon" />
            </button>
            <div id="navbarSupportedContent" class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <template v-for="(page, index) of pages" :key="index">
                        <li class="nav-item">
                            <NuxtLink :class="{ active: $route.path === page.to }" class="nav-link" :to="page.to">{{
                                page.name }}</NuxtLink>
                        </li>
                    </template>
                </ul>

            </div>
        </div>
    </nav>
</template>
