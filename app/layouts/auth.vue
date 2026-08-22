<template>
  <main >
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
// The entire auth flow (login, sign-up, verify, OAuth callbacks,
// reset-password, role-select) is transient/account-specific — none of it
// belongs in search results, so noindex applies once here.
useSeoMeta({ robots: 'noindex, nofollow' })
</script>