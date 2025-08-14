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


    <template v-if="status == 'pending'">
      <Loading>Fetching booking</Loading>
    </template>

    <div v-if="error" class="alert alert-danger">
      Error loading booking.
    </div>

    <div v-if="data && codes" class="space-y-4">

      <div class="card mb-4">
        <div class="card-header bg-primary text-white fw-bold">
          RESERVATION
        </div>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col d-flex">
              <svg class="h-8 w-8" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" />
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M7 15v-4a2 2 0 0 1 4 0v4" />
                <line x1="7" y1="13" x2="11" y2="13" />
                <path d="M17 9v6h-1.5a1.5 1.5 0 1 1 1.5 -1.5" />
              </svg>
              <p><b>Reservatio Title:</b> {{ data.MATCH1 }}</p>
            </div>
            <div class="col d-flex">
              <svg class="h-8 w-8" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" />
                <rect x="4" y="5" width="16" height="16" rx="2" />
                <line x1="16" y1="3" x2="16" y2="7" />
                <line x1="8" y1="3" x2="8" y2="7" />
                <line x1="4" y1="11" x2="20" y2="11" />
                <line x1="11" y1="15" x2="12" y2="15" />
                <line x1="12" y1="15" x2="12" y2="18" />
              </svg>
              <p><b>Period:</b> {{ formatDate(data.ARRIVAL) }} → {{ formatDate(data.DEPARTURE) }}</p>
            </div>
            <div class="col d-flex">
              <svg class="h-8 w-8" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M16.2 4a9.03 9.03 0 1 0 3.9 12a6.5 6.5 0 1 1 -3.9 -12" />
              </svg>
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
                <div class="accordion-body row" v-for="item in data.s_reser_pr">
                  <div class="col">
                    <p><b>Identification:</b> {{ item.IDENT }}</p>
                    <p><b>Article Description:</b> {{ item.ARTD1 }}</p>
                    <p><b>Infor:</b> {{ item.INFO }}</p>
                  </div>
                  <div class="col">
                    <p><b>Bill:</b> {{ item.BILLIT }}</p>
                    <p><b>Bill Times:</b> {{ item.BILLTIMES }}</p>
                    <p><b>Bill Date:</b> {{ formatDate(item.BILLDATE) }}</p>
                  </div>
                  <hr>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="card mb-4 shadow-sm">
        <div class="card-header bg-secondary text-white fw-bold">
          GUEST INFORMATION
        </div>

        <div class="card-body">
          <div class="row mb-3">
            <div class="col d-flex">
              <svg class="h-8 w-8" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p><b>Identification:</b> {{ data.s_guest.NAME2 }}</p>
            </div>
            <div class="col d-flex">
              <svg class="h-8 w-8" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" />
                <path
                  d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              </svg>
              <p><b>Phone:</b> {{ data.s_guest.PHONE }}</p>
            </div>
            <div class="col d-flex">
              <svg class="h-8 w-8" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" />
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="3 7 12 13 21 7" />
              </svg>
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
        <div class="card-header bg-success text-white fw-bold">FINANCIAL INFORMATION</div>
        <div class="card-body">
          <div class="d-flex">
            <svg class="h-8 w-8" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p><b>Total Reservation Value:</b> {{ data.PINAD }} {{ data.PINAD1C }}</p>
          </div>
          <p v-if="data.CREDITOPEN != '0.00'"><b>Open Credit:</b> {{ data.CREDITOPEN }}</p>
          <div class="d-flex">
            <svg class="h-8 w-8" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
              fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" />
              <rect x="4" y="5" width="16" height="16" rx="2" />
              <line x1="16" y1="3" x2="16" y2="7" />
              <line x1="8" y1="3" x2="8" y2="7" />
              <line x1="4" y1="11" x2="20" y2="11" />
              <rect x="8" y="15" width="2" height="2" />
            </svg>
            <p><b>Payment Due Date:</b> {{ formatDate(data.CREDITDUE) }}</p>
          </div>
          <p v-if="data.INCPRICE != '0.00'"><b>Included Value:</b> {{ data.INCPRICE }} {{ data.INCPRICEC }}</p>
        </div>
      </div>

      <div class="row">


        <div class="card m-2 col">
          <div class="card-header bg-purple text-white fw-bold">NOTES AND COMMENTS</div>
          <div class="card-body d-flex">
            <svg class="h-8 w-8" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
              fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="13" y1="20" x2="20" y2="13" />
              <path d="M13 20v-6a1 1 0 0 1 1 -1h6v-7a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7" />
            </svg>
            <p><b>Internal Notes:</b> {{ data.MEMO }}</p>
          </div>
        </div>

        <div class="card m-2 col">
          <div class="card-header bg-black text-white fw-bold">STATUS AND CONTROL</div>
          <div class="card-body">
            <p><b>Confirmed:</b> {{ formatStatus(data.ST_CONF) }}</p>
            <p><b>Confirmation Date:</b> {{ formatDate(data.ST_CONFD) }}</p>
            <p><b>Cancelled?:</b> {{ formatYesNo(data.ST_CANCEL) }}</p>
            <p><b>Cancellation Date:</b> {{ formatDate(data.CANCELD) }}</p>
            <p><b>Expired?: </b> {{ formatYesNo(data.ST_EXPIRE) }}</p>
          </div>
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
