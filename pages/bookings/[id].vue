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

function bookingStatus(b: s_reser) {
  if (b.ST_CANCEL === 'Y') return 'Cancelled'
  if (b.ST_CONF === 'Y') return 'Confirmed'
  if (b.ST_EXPIRE === 'Y') return 'Expired'
  return 'Pending'
}
</script>

<template>
  <div class="container my-4">
    <h1 class="mb-4">Booking Overview #{{ id }}</h1>

    <div v-if="error" class="alert alert-danger">
      Error loading booking.
    </div>

    <div v-if="status === 'pending'" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
      <p>Loading booking...</p>
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
        <div class="card-header bg-secondary text-white">Guest Information</div>
        <div class="card-body">
          <p><strong>Identification:</strong> {{ data.GUEST_R }}</p>
          <p><strong>Inviteds:</strong> {{ data.NUMBER }}</p>
          <p><strong>Unidades Reservadas:</strong> {{ data.COUNT }}</p>
          <p><strong>titulo da reserva:</strong> {{ data.MATCH1 }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-success text-white">INFORMAÇÔES FINANCEIRAS</div>
        <div class="card-body">
          <p><strong>valor total da reserva:</strong> {{ data.PINAD }} {{ data.PINAD1C }}</p>
          <p><strong>Crédito aberto:</strong> {{ data.CREDITOPEN }}</p>
          <p><strong>data limite de pagamento:</strong> {{ formatDate(data.CREDITDUE) }}</p>
          <p><strong>valor incluso:</strong> {{ data.INCPRICE }} {{data.INCPRICEC}}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-secondary text-white">OBSERVAÇÕES E ANOTAÇÕES</div>
        <div class="card-body">
          <p><strong>observações internas:</strong> {{ data.MEMO }}</p>
          <p><strong>texto adicionais:</strong> {{ data.TEXT }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-success text-white">STATUS E CONTROLE</div>
        <div class="card-body">
          <p><strong>CONFIRMADO:</strong> {{ formatStatus(data.ST_CONF) }}</p>
          <p><strong>data de confirmação:</strong> {{ formatDate(data.ST_CONFD) }}</p>
          <p><strong>cancelado:</strong> {{ formatYesNo(data.ST_CANCEL) }}</p>
          <p><strong>cancelado data:</strong> {{ formatDate(data.CANCELD) }}</p>
          <p><strong>ST_EXPIRE:</strong> {{ formatYesNo(data.ST_EXPIRE) }}</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-success text-white">ALIMENTAÇÃO</div>
        <div class="card-body">
          <p><strong>tipo de alimentação??:</strong> {{ data.BOARDSTORE }}</p>
          <p><strong>data de confirmação:</strong> {{ formatDate(data.ST_CONFD) }}</p>
          <p><strong>cancelado:</strong> {{ formatYesNo(data.ST_CANCEL) }}</p>
          <p><strong>cancelado data:</strong> {{ formatDate(data.CANCELD) }}</p>
          <p><strong>ST_EXPIRE:</strong> {{ formatYesNo(data.ST_EXPIRE) }}</p>
        </div>
      </div>






    </div>
  </div>
</template>
