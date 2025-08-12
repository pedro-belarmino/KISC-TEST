<script setup lang="ts">
import Loading from '~/components/Loading.vue';
import type { s_reser } from '~/types/s_reser';
import { parseISO, format } from 'date-fns';
import type { ASSDCodes } from '~/types/assd_codes';

const route = useRoute();
const id = route.params.id as string;

const { data: codes } = await useFetch<ASSDCodes>(`/api/codes`)
const { data, status, error  } = await useFetch<s_reser>(`/api/bookings/${id}`)

</script>

<template>

    <h1>Booking #{{ id }}</h1>

    <template v-if="error">
        <div class="alert alert-danger">An error occurred while fetching the data for this booking</div>
    </template>

    <template v-if="status == 'pending'">
        <Loading>Fetching booking</Loading>
    </template>
    
    <template v-if="data && codes">
        <p>Booking made for: {{ data.s_guest.NAME2 }}</p>
        <p>{{ format(parseISO(data.ARRIVAL),'dd/MM/yyyy') }} to {{ format(parseISO(data.DEPARTURE),'dd/MM/yyyy') }}</p>
        <p>Booking type: {{ codes.regcode[data.REGCODE]}}</p>
    </template>

</template>

<style scoped></style>
