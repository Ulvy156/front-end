<template>
  <section class="w-full h-fit grid grid-cols-1 gap-y-5 sticky z-10 top-0 ">
    <div class="col-span-1 rounded-(--radius) border border-(--border-gray) p-5 bg-(--card)">
      <h5>{{ $t("property.contact") }}</h5>
      <!-- profile -->
      <div class="mt-5">
        <div class="flex items-center gap-x-5">
          <BaseAvatar
            :name="property?.user.name"
            :src="property?.user.imgUrl"
          />
          <div>
            <h6 class="text-lg">{{ property?.user.name }}</h6>
            <span class="text-(--gray)">{{ property?.user.role }}</span>
          </div>
        </div>
        <!-- socail media -->
        <div class="grid grid-cols-1 gap-y-5 mt-4">
          <!-- phone number -->
          <div class="flex items-center gap-x-3 bg-(--bg-gray) p-3 rounded-(--radius)">
            <BaseIconClient name="phone-call" />
            <p class="">{{ property?.user.phones?.[0]?.phoneNumber }}</p>
          </div>
          <!-- call now -->
          <div
            class="flex justify-center items-center gap-x-3 bg-(--nav-active-item) text-white p-3 rounded-md"
          >
            <BaseIconClient name="phone-call" />
            <p class="">{{ $t("property.call") }}</p>
          </div>
          <!-- telegram -->
          <div
            class="flex justify-center items-center gap-x-3 border border-[#e2e0e0] bg-(--bg-gray) p-3 rounded-md"
          >
            <BaseIconClient name="message-square-text" />
            <p class="">{{ $t("property.telegram") }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- share social media -->
    <div class="grid grid-cols-3 gap-5 rounded-lg p-5 border border-(--border-gray) bg-(--card)">
      <h5 class="col-span-full flex items-center gap-x-3">
        <BaseIconClient name="share-2" />
        {{ $t("property.share") }}
      </h5>
      <!-- facebook -->
      <span class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M6.5 10v4h3v7h4v-7h3l1-4h-4V8c0-.545.455-1 1-1h3V3h-3c-2.723 0-5 2.277-5 5v2z"
          />
        </svg>
      </span>
      <!-- telegram -->
      <span class="icon">
        <BaseIconClient name="message-square-text" />
      </span>
      <!-- copy link -->
      <span class="icon">
        <BaseIconClient name="copy" />
      </span>
    </div>
  </section>
</template>

<script lang="ts" setup>
import BaseAvatar from "~/components/ui/BaseAvatar.vue";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import type { PropertyDetail } from "../interface/properties-details";

defineProps<{
  property: PropertyDetail;
}>();
</script>


<style scoped>
.icon {
  background: var(--bg-gray);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  cursor: pointer;
}

.icon:hover {
  background: var(--nav-active-item);
  color: white;
  transition: 0.5s all;
}
</style>