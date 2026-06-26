<!-- Print.vue -->
<script lang="ts" setup>
import { useLogout } from '@/hooks/logout.hook'
import type { InvoiceModel } from '@/models/invoice.model'
import type { InvoiceItemModel } from '@/models/item.model'
import { InvoiceService } from '@/services/invoice.service'
import QRCode from 'qrcode'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const logout = useLogout()
const route = useRoute()

const invoice = ref<InvoiceModel | null>(null)
const loading = ref(true)
const qrCodeUrl = ref('')

const id = Number(route.params.id)

InvoiceService.getDetails(id)
    .then(async rsp => {
        invoice.value = rsp.data
        if (rsp.data?.pursId) {
            const payload = `https://suf.purs.gov.rs/v/?id=${encodeURIComponent(rsp.data.pursId)}`
            qrCodeUrl.value = await QRCode.toDataURL(payload, {
                width: 200,
                margin: 1,
                errorCorrectionLevel: 'M',
            })
        }
    })
    .catch(e => logout(e))
    .finally(() => loading.value = false)

const invoiceNumber = computed(() => {
    if (!invoice.value) return ''
    const year = new Date(invoice.value.createdAt).getFullYear()
    const paddedId = String(invoice.value.invoiceId).padStart(6, '0')
    return `#${year}/${paddedId}`
})

const items = computed<InvoiceItemModel[]>(() => invoice.value?.invoiceItems ?? [])

const totalAmount = computed(() =>
    items.value.reduce((sum, item) => sum + item.pricePerItem * item.count, 0)
)
const vatAmount = computed(() => totalAmount.value * 20 / 120)
const netAmount = computed(() => totalAmount.value - vatAmount.value)

function formatMoney(value: number): string {
    return new Intl.NumberFormat('sr-RS', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value) + ' RSD'
}

function formatDateTime(value?: string): string {
    if (!value) return '-'
    return new Intl.DateTimeFormat('sr-RS', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

function formatTime(value?: string): string {
    if (!value) return '-'
    return value.substring(0, 5)
}

function getItemTotal(item: InvoiceItemModel): number {
    return item.pricePerItem * item.count
}
function print() {
    window.print()
}
</script>

<template>
    <div class="print-page">
        <div v-if="loading" class="status-screen">
            <div class="spinner-border text-secondary" role="status"></div>
            <p>Loading...</p>
        </div>

        <div v-else-if="!invoice" class="status-screen">
            <p>Invoice not found.</p>
        </div>

        <div v-else class="receipt">
            <!-- Header -->
            <div class="receipt-header">
                <div class="receipt-logo">🎬</div>
                <div class="receipt-company">ФИСКАЛНИ РАЧУН</div>
                <div class="receipt-sub">Практикум Системи Е-пословања</div>
                <div class="receipt-sub">Технички факултет · Универзитет Сингидунум</div>
                <div class="receipt-sub">Данијелова 32, 11000 Београд, Србија</div>
            </div>

            <div class="divider"></div>

            <!-- Invoice meta -->
            <div class="receipt-row">
                <span>Рачун</span>
                <strong>{{ invoiceNumber }}</strong>
            </div>
            <div class="receipt-row">
                <span>Касир</span>
                <strong>Веб продавница</strong>
            </div>
            <div class="receipt-row">
                <span>Датум</span>
                <strong>{{ formatDateTime(invoice.pursTime) }}</strong>
            </div>
            <div class="receipt-row pfr">
                <span>ПФР број</span>
                <strong class="break-all">{{ invoice.pursCounter }}</strong>
            </div>

            <div class="divider"></div>

            <!-- Items -->
            <div
                v-for="item in items"
                :key="item.invoiceItemId"
                class="receipt-item"
            >
                <div class="item-title">{{ item.timeTable.movie.title }}</div>
                <div class="item-meta">
                    {{ item.timeTable.cinema.name }} · {{ formatTime(item.timeTable.startTime) }}
                </div>
                <div class="receipt-row">
                    <span>{{ item.count }} × {{ formatMoney(item.pricePerItem) }}</span>
                    <strong>{{ formatMoney(getItemTotal(item)) }}</strong>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Totals -->
            <div class="receipt-row">
                <span>Пореска основица</span>
                <strong>{{ formatMoney(netAmount) }}</strong>
            </div>
            <div class="receipt-row">
                <span>ПДВ 20%</span>
                <strong>{{ formatMoney(vatAmount) }}</strong>
            </div>
            <div class="receipt-total">
                <span>УКУПНО</span>
                <strong>{{ formatMoney(totalAmount) }}</strong>
            </div>
            <div class="receipt-row mt">
                <span>Плаћено картицом</span>
                <strong>{{ formatMoney(totalAmount) }}</strong>
            </div>

            <div class="divider"></div>

            <!-- Fiscal info -->
            <div class="label">ПФР ИД:</div>
            <div class="break-all small">{{ invoice.pursId }}</div>
            <div class="label mt">ПФР Време:</div>
            <div class="small">{{ formatDateTime(invoice.pursTime) }}</div>

            <!-- QR -->
            <div class="qr-block" v-if="qrCodeUrl">
                <img :src="qrCodeUrl" alt="Fiscal QR" class="qr-img" />
                <div class="small">Скенирајте QR код за проверу рачуна</div>
            </div>

            <div class="divider"></div>

            <div class="receipt-footer">КРАЈ ФИСКАЛНОГ РАЧУНА</div>

            <!-- Print button (hidden when printing) -->
            <button class="print-btn no-print" @click="print()">
                🖨 Штампај рачун
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.print-page {
    min-height: 100vh;
    background: #1a1a2e;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem 1rem;
}

.status-screen {
    color: #ccc;
    margin-top: 4rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

/* Receipt paper */
.receipt {
    font-family: 'Share Tech Mono', ui-monospace, monospace;
    font-size: 0.78rem;
    line-height: 1.4;
    color: #111;
    background: #faf9f5;
    width: 100%;
    max-width: 340px;
    padding: 1.5rem 1.25rem;
    border-radius: 2px 2px 8px 8px;
    box-shadow:
        0 2px 0 #ddd,
        0 4px 0 #ccc,
        0 6px 0 #bbb,
        0 20px 40px rgba(0,0,0,0.5);

    /* Torn paper top edge */
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='340' height='12'%3E%3Cpath d='M0 12 Q8 0 16 8 Q24 16 32 6 Q40 0 48 10 Q56 16 64 6 Q72 0 80 8 Q88 16 96 4 Q104 0 112 10 Q120 16 128 6 Q136 0 144 8 Q152 16 160 4 Q168 0 176 10 Q184 16 192 6 Q200 0 208 8 Q216 16 224 4 Q232 0 240 10 Q248 16 256 6 Q264 0 272 8 Q280 16 288 4 Q296 0 304 10 Q312 16 320 6 Q328 0 336 8 L340 12 Z' fill='%23faf9f5'/%3E%3C/svg%3E"),
        linear-gradient(white, white);
    -webkit-mask-size: 340px 12px, 100% 100%;
    -webkit-mask-position: top, top;
    -webkit-mask-repeat: no-repeat, no-repeat;
    padding-top: 1.75rem;
}

/* Header */
.receipt-header {
    text-align: center;
    margin-bottom: 0.5rem;
}

.receipt-logo {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
}

.receipt-company {
    font-size: 0.95rem;
    font-weight: 900;
    letter-spacing: 0.05em;
}

.receipt-sub {
    font-size: 0.65rem;
    color: #555;
}

/* Divider */
.divider {
    border: none;
    border-top: 1px dashed #999;
    margin: 0.6rem 0;
}

/* Rows */
.receipt-row {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.2rem;
}

.receipt-row.pfr {
    align-items: flex-start;
}

.receipt-row strong {
    text-align: right;
}

.receipt-total {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 900;
    margin: 0.3rem 0;
    border-top: 1px solid #333;
    border-bottom: 1px solid #333;
    padding: 0.25rem 0;
}

/* Items */
.receipt-item {
    margin-bottom: 0.6rem;
}

.item-title {
    font-weight: 700;
    word-break: break-word;
}

.item-meta {
    font-size: 0.65rem;
    color: #555;
    margin-bottom: 0.15rem;
}

/* Misc */
.label {
    font-size: 0.65rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.small {
    font-size: 0.65rem;
    word-break: break-all;
    overflow-wrap: anywhere;
}

.break-all {
    word-break: break-all;
    overflow-wrap: anywhere;
}

.mt {
    margin-top: 0.4rem;
}

/* QR */
.qr-block {
    text-align: center;
    margin: 0.75rem 0 0.25rem;
}

.qr-img {
    width: 130px;
    height: 130px;
    background: white;
    padding: 4px;
    border: 1px solid #ddd;
    display: block;
    margin: 0 auto 0.3rem;
}

/* Footer */
.receipt-footer {
    text-align: center;
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    color: #555;
}

/* Print button */
.print-btn {
    display: block;
    width: 100%;
    margin-top: 1rem;
    padding: 0.5rem;
    background: #1a1a2e;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    letter-spacing: 0.03em;
}

.print-btn:hover {
    background: #2d2d4e;
}

/* Print media */
@media print {
    .print-page {
        background: none;
        padding: 0;
        display: block;
    }

    .receipt {
        box-shadow: none;
        max-width: 100%;
        -webkit-mask-image: none;
        padding-top: 1.5rem;
    }

    .no-print {
        display: none !important;
    }
}
</style>