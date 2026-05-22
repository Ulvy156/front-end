<script setup lang="ts">
import { Role } from '~/types/role'

defineProps<{ role: Role }>()

const badgeClass: Record<string, string> = {
  [Role.USER]:     'bg-blue-50 text-blue-600',
  [Role.LANDLORD]: 'bg-emerald-50 text-emerald-700',
  [Role.ADMIN]:    'bg-purple-50 text-purple-700',
}
</script>

<template>
  <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="badgeClass[role]">
    {{ role }}
  </span>
</template>
