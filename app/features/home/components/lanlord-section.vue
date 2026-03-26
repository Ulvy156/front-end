<script setup lang="ts">
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'

const features = [
  { icon: 'Users', text: 'Reach 10,000+ tenants' },
  { icon: 'ShieldCheck', text: 'Verified tenant profiles' },
  { icon: 'Clock', text: 'Quick listing process' },
  { icon: 'Star', text: 'Premium visibility options' },
]

const stats = [
  { icon: 'FileText', value: '2,500+', label: 'Active Listings' },
  { icon: 'Users', value: '50K+', label: 'Monthly Visitors' },
  { icon: 'Clock', value: '48h', label: 'Avg. Response Time' },
  { icon: 'Star', value: '4.9/5', label: 'Landlord Rating' },
]
</script>

<template>
  <section class="relative overflow-hidden bg-linear-to-br from-emerald-600 to-teal-500 text-white">

    <!-- background dots -->
    <div
      class="absolute inset-0 opacity-10 
      bg-[radial-gradient(circle,white_1px,transparent_1px)] 
      bg-size-[22px_22px]"
    ></div>

    <div class="relative container mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">

      <!-- LEFT -->
      <div>
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm mb-6">
          <BaseIconClient name="FileText" class="w-4 h-4" />
          <span>For Landlords & Agencies</span>
        </div>

        <h1 class="text-4xl lg:text-6xl font-bold leading-tight mb-6">
          Have a Room to Rent?
        </h1>

        <p class="text-lg text-white/90 mb-10 max-w-xl">
          Join thousands of landlords who trust RoomKH to connect them with quality tenants.
          List your property in minutes and start receiving inquiries today.
        </p>

        <!-- FEATURES -->
        <div class="grid sm:grid-cols-2 gap-6 mb-10">
          <div
            v-for="item in features"
            :key="item.text"
            class="flex items-center gap-3"
          >
            <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20">
              <BaseIconClient :name="item.icon" class="w-5 h-5" />
            </div>
            <span>{{ item.text }}</span>
          </div>
        </div>

        <!-- BUTTONS -->
        <div class="flex gap-4">
          <button class="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition">
            List Your Room Free →
          </button>
          <button class="border border-white/40 px-6 py-3 rounded-xl hover:bg-white/10 transition">
            How It Works
          </button>
        </div>
      </div>

      <!-- RIGHT STATS -->
      <div class="grid sm:grid-cols-2 gap-6">
        <div
          v-for="item in stats"
          :key="item.label"
          class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:scale-105 transition"
        >
          <div class="w-12 h-12 flex items-center justify-center bg-white/20 rounded-xl mb-6">
            <BaseIconClient :name="item.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-3xl font-bold mb-2">{{ item.value }}</h3>
          <p class="text-white/80">{{ item.label }}</p>
        </div>
      </div>

    </div>
  </section>
</template>
