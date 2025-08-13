<script setup lang="ts">
import { parseISO, format } from 'date-fns';
import type { s_reser } from '~/types/s_reser';
import type { ASSDCodes } from '~/types/assd_codes';

const route = useRoute();
const id = route.params.id as string;

const { data: codes } = await useFetch<ASSDCodes>(`/api/codes`)
const { data, status, error } = await useFetch<s_reser>(`/api/bookings/${id}`)


const st_conf: Record<string, string> = {
        "": "No confirmation needed",
        "N": "Waiting for confirmation",
        "Y": "Confirmed",
        "Z": "Confirm without letter"
};

function formatStatus(status: string) {
return st_conf[status] || ''
}

function formatYesNo(status: string) {
  if(status == 'Y') {
    return 'Yes'
  } else if (status == 'N') {
    return 'No'
  } else return '-'
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return format(parseISO(date), 'dd/MM/yyyy')
}

</script>

<template>
  <div class="container my-4">
    <h1 class="mb-4">Booking Overview #{{ id }}</h1>

    <div v-if="error" class="alert alert-danger">
      Error loading booking.
    </div>

    <div v-if="data && codes" class="space-y-4">

      <div class="card mb-4">
        <div class="card-header bg-primary text-white">Reservation period</div>
        <div class="card-body">
          <p><b>Period:</b> {{ formatDate(data.ARRIVAL) }} → {{ formatDate(data.DEPARTURE) }}</p>
          <p><b>Nights:</b> {{ data.NIGHTS }}</p>
        </div>
      </div>
      
      <div class="card mb-4">
        <div class="card-header bg-secondary text-white">GUEST INFORMATION</div>
        <div class="card-body">
          <p><b>Identification:</b> {{ data.s_guest.NAME2 }}</p>
          <p><b>Inviteds:</b> {{ data.NUMBER }}</p>
          <p><b>Reserved Units:</b> {{ data.COUNT }}</p>
          <p><b>Reservatio Title:</b> {{ data.MATCH1 }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-success text-white">FIANCIAL INFORMATION</div>
        <div class="card-body">
          <p><b>Total Reservation Value:</b> {{ data.PINAD }} {{ data.PINAD1C }}</p>
          <p><b>Open Credit:</b> {{ data.CREDITOPEN }}</p>
          <p><b>Payment Due Date:</b> {{ formatDate(data.CREDITDUE) }}</p>
          <p><b>Included Value:</b> {{ data.INCPRICE }} {{data.INCPRICEC}}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-purple text-white">NOTES AND COMMENTS</div>
        <div class="card-body">
          <p><b>Internal Notes:</b> {{ data.MEMO }}</p>
          <p><b>Additional Text:</b> {{ data.TEXT }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-black text-white">STATUS AND CONTROL</div>
        <div class="card-body">
          <p><b>Confirmed:</b> {{ formatStatus(data.ST_CONF) }}</p>
          <p><b>COnfirmation Date:</b> {{ formatDate(data.ST_CONFD) }}</p>
          <p><b>Cancelled:</b> {{ formatYesNo(data.ST_CANCEL) }}</p>
          <p><b>Cancellation Date:</b> {{ formatDate(data.CANCELD) }}</p>
          <p><b>Expired?:</b> {{ formatYesNo(data.ST_EXPIRE) }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-warning text-white">MEAL PLAN</div>
        <div class="card-body">
          <p><b>Meal Plan Type:</b> {{ data.BOARDSTORE }}</p>
        </div>
      </div>






    </div>
  </div>
</template>
