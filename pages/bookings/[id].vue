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
  if (status == 'Y') {
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
        <div class="card-header bg-primary text-white">
          Reservation
        </div>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col">
              <p><b>Reservatio Title:</b> {{ data.MATCH1 }}</p>
            </div>
            <div class="col">
              <p><b>Period:</b> {{ formatDate(data.ARRIVAL) }} → {{ formatDate(data.DEPARTURE) }}</p>
            </div>
            <div class="col">
              <p><b>Nights:</b> {{ data.NIGHTS }}</p>
            </div>
          </div>
          <div class="accordion" id="reservationAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button collapsed bg-light fw-semibold" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                  See Reservation Price
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne"
                data-bs-parent="#reservationAccordion">
                <div class="accordion-body" v-for="item in data.s_reser_pr">
                  <p><b>Identification:</b> {{ item.IDENT }}</p>
                  <p><b>ARTD1:</b> {{ item.ARTD1 }}</p>
                  <p><b>Infor:</b> {{ item.INFO }}</p>
                  <p><b>billit:</b> {{ item.BILLIT }}</p>
                  <p><b>billTIMES:</b> {{ item.BILLTIMES }}</p>
                  <p><b>billdate:</b> {{ formatDate(item.BILLDATE) }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="card mb-4 shadow-sm">
        <div class="card-header bg-secondary text-white fw-bold">
          Guest Information
        </div>

        <div class="card-body">
          <div class="row mb-3">
            <div class="col">
              <p><b>Identification:</b> {{ data.s_guest.NAME2 }}</p>
            </div>
            <div class="col">
              <p><b>Phone:</b> {{ data.s_guest.PHONE }}</p>
            </div>
            <div class="col">
              <p><b>Email:</b> {{ data.s_guest.EMAIL }}</p>
            </div>
          </div>

          <div class="accordion" id="guestAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed bg-light fw-semibold" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  See More Information
                </button>
              </h2>
              <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingOne"
                data-bs-parent="#guestAccordion">
                <div class="accordion-body">
                  <p><b>Country:</b> {{ data.s_guest.COUNTRY }}</p>
                  <p><b>Scout Registration:</b> {{ data.s_guest.GUESTCODE }}</p>
                  <p><b>Inviteds:</b> {{ data.NUMBER }}</p>
                  <p><b>Reserved Units:</b> {{ data.COUNT }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="card mb-4">
        <div class="card-header bg-success text-white">FIANCIAL INFORMATION</div>
        <div class="card-body">
          <p><b>Total Reservation Value:</b> {{ data.PINAD }} {{ data.PINAD1C }}</p>
          <p v-if="data.CREDITOPEN != '0.00'"><b>Open Credit:</b> {{ data.CREDITOPEN }}</p>
          <p><b>Payment Due Date:</b> {{ formatDate(data.CREDITDUE) }}</p>
          <p v-if="data.INCPRICE != '0.00'"><b>Included Value:</b> {{ data.INCPRICE }} {{ data.INCPRICEC }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-purple text-white">NOTES AND COMMENTS</div>
        <div class="card-body">
          <p><b>Internal Notes:</b> {{ data.MEMO }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-black text-white">STATUS AND CONTROL</div>
        <div class="card-body">
          <p><b>Confirmed:</b> {{ formatStatus(data.ST_CONF) }}</p>
          <p><b>Confirmation Date:</b> {{ formatDate(data.ST_CONFD) }}</p>
          <p><b>Cancelled?:</b> {{ formatYesNo(data.ST_CANCEL) }}</p>
          <p><b>Cancellation Date:</b> {{ formatDate(data.CANCELD) }}</p>
          <p><b>Expired?: </b> {{ formatYesNo(data.ST_EXPIRE) }}</p>
        </div>
      </div>

      <!-- <div class="card mb-4">
        <div class="card-header bg-warning text-white">MEAL PLAN</div>
        <div class="card-body">
          <p><b>Meal Plan Type:</b> {{ data.BOARDSTORE }}</p>
        </div>
      </div> -->


    </div>
  </div>
</template>
