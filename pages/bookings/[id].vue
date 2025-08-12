<script setup lang="ts">
import { parseISO, format } from 'date-fns';
import type { s_reser } from '~/types/s_reser';
import type { ASSDCodes } from '~/types/assd_codes';

const route = useRoute();
const id = route.params.id as string;

const { data: codes } = await useFetch<ASSDCodes>(`/api/codes`)
const { data, status, error } = await useFetch<s_reser>(`/api/bookings/${id}`)

// Funções utilitárias
function translate(codeType: keyof ASSDCodes, code: string) {
  return codes.value?.[codeType]?.[code.trim()] || code
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

    <!-- Erro -->
    <div v-if="error" class="alert alert-danger">
      Error loading booking.
    </div>

    <!-- Loading -->
    <div v-if="status === 'pending'" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
      <p>Loading booking...</p>
    </div>

    <!-- Conteúdo -->
    <div v-if="data && codes" class="space-y-4">

      <!-- Resumo -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">General Info</div>
        <div class="card-body">
          <p><strong>Guest:</strong> {{ data.s_guest.NAME2 }}</p>
          <p><strong>Period:</strong> {{ formatDate(data.ARRIVAL) }} → {{ formatDate(data.DEPARTURE) }}</p>
          <p><strong>Type:</strong> {{ translate('guestcode', data.REGCODE) }}</p>
          <p><strong>Status:</strong> {{ bookingStatus(data) }}</p>
          <p><strong>Total:</strong> {{ data.PINAD }} {{ data.PINADC }}</p>
          <p><strong>Memo:</strong> {{ data.MEMO || '-' }}</p>
        </div>
      </div>

      <!-- Quartos -->
      <div v-if="data.s_paths?.length" class="card mb-4">
        <div class="card-header bg-secondary text-white">Rooms</div>
        <ul class="list-group list-group-flush">
          <li v-for="room in data.s_paths" :key="room.IDENT" class="list-group-item">
            {{ room.NAME }} — {{ formatDate(room.ARRIVAL) }} → {{ formatDate(room.DEPARTURE) }}
          </li>
        </ul>
      </div>

      <!-- Refeições -->
      <div v-if="data.s_meals?.length" class="card mb-4">
        <div class="card-header bg-info text-white">Meals</div>
        <ul class="list-group list-group-flush">
          <li v-for="meal in data.s_meals" :key="meal.IDENT" class="list-group-item">
            {{ formatDate(meal.DATE) }} — {{ translate('boardtype', meal.BOARD) }} ({{ meal.COUNT }})
          </li>
        </ul>
      </div>

      <!-- Atividades -->
      <div v-if="data.s_activities?.length" class="card mb-4">
        <div class="card-header bg-success text-white">Activities</div>
        <ul class="list-group list-group-flush">
          <li v-for="act in data.s_activities" :key="act.IDENT" class="list-group-item">
            {{ act.NAME }} — {{ formatDate(act.DATE) }} {{ act.TIME }} ({{ act.COUNT }})
          </li>
        </ul>
      </div>

      <!-- Itens alugados -->
      <div v-if="data.s_hireditems?.length" class="card mb-4">
        <div class="card-header bg-warning text-dark">Hired Items</div>
        <ul class="list-group list-group-flush">
          <li v-for="item in data.s_hireditems" :key="item.IDENT" class="list-group-item">
            {{ item.NAME }} ({{ item.COUNT }}) — {{ item.PRICE }} {{ item.CURRENCY }}
          </li>
        </ul>
      </div>

      <!-- Custos extras -->
      <div v-if="data.s_extras?.length" class="card mb-4">
        <div class="card-header bg-danger text-white">Extra Costs</div>
        <ul class="list-group list-group-flush">
          <li v-for="extra in data.s_extras" :key="extra.IDENT" class="list-group-item">
            {{ extra.DESCRIPTION }} — {{ extra.AMOUNT }} {{ extra.CURRENCY }}
          </li>
        </ul>
      </div>

      <!-- Conta -->
      <div v-if="data.s_bill?.length" class="card mb-4">
        <div class="card-header bg-dark text-white">Bill Overview</div>
        <table class="table table-sm table-striped mb-0">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bill in data.s_bill" :key="bill.IDENT">
              <td>{{ bill.DESCRIPTION }}</td>
              <td>{{ bill.AMOUNT }}</td>
              <td>{{ bill.CURRENCY }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>
