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
          <p><strong>Period:</strong> {{ formatDate(data.ARRIVAL) }} → {{ formatDate(data.DEPARTURE) }}</p>
          <p><strong>Nights:</strong> {{ data.NIGHTS }}</p>
        </div>
      </div>
      
      <div class="card mb-4">
        <div class="card-header bg-secondary text-white">GUEST INFORMATION</div>
        <div class="card-body">
          <p><strong>Identification:</strong> {{ data.s_guest.NAME2 }}</p>
          <p><strong>Inviteds:</strong> {{ data.NUMBER }}</p>
          <p><strong>Reserved Units:</strong> {{ data.COUNT }}</p>
          <p><strong>Reservatio Title:</strong> {{ data.MATCH1 }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-success text-white">FIANCIAL INFORMATION</div>
        <div class="card-body">
          <p><strong>Total Reservation Value:</strong> {{ data.PINAD }} {{ data.PINAD1C }}</p>
          <p><strong>Open Credit:</strong> {{ data.CREDITOPEN }}</p>
          <p><strong>Payment Due Date:</strong> {{ formatDate(data.CREDITDUE) }}</p>
          <p><strong>Included Value:</strong> {{ data.INCPRICE }} {{data.INCPRICEC}}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-purple text-white">NOTES AND COMMENTS</div>
        <div class="card-body">
          <p><strong>Internal Notes:</strong> {{ data.MEMO }}</p>
          <p><strong>Additional Text:</strong> {{ data.TEXT }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-black text-white">STATUS AND CONTROL</div>
        <div class="card-body">
          <p><strong>Confirmed:</strong> {{ formatStatus(data.ST_CONF) }}</p>
          <p><strong>COnfirmation Date:</strong> {{ formatDate(data.ST_CONFD) }}</p>
          <p><strong>Cancelled:</strong> {{ formatYesNo(data.ST_CANCEL) }}</p>
          <p><strong>Cancellation Date:</strong> {{ formatDate(data.CANCELD) }}</p>
          <p><strong>Expired?:</strong> {{ formatYesNo(data.ST_EXPIRE) }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-warning text-white">MEAL PLAN</div>
        <div class="card-body">
          <p><strong>Meal Plan Type:</strong> {{ data.BOARDSTORE }}</p>
        </div>
      </div>






    </div>
  </div>
</template>
