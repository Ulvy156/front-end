<template>
  <section class="w-full h-fit grid grid-cols-1 gap-y-5 sticky z-10 top-0">
    <div
      class="col-span-1 rounded-(--radius) border border-(--border-gray) p-5 bg-(--card)"
    >
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
          <div
            v-for="phone in phoneNumber"
            class="flex items-center justify-between gap-x-3 bg-(--bg-gray) p-3 rounded-(--radius)"
          >
            <div class="flex items-center gap-x-3">
              <BaseIconClient name="phone-call" />
              <p class="">{{ phone.phoneNumber }}</p>
            </div>
            <BaseIconClient
              @click="copy(phone.phoneNumber)"
              class="cursor-pointer"
              name="copy"
            />
          </div>
          <!-- call now -->
          <div
            class="flex justify-center items-center gap-x-3 bg-(--nav-active-item) text-white p-3 rounded-md"
          >
            <BaseIconClient name="phone-call" />
            <p class="">{{ $t("property.call") }}</p>
          </div>
          <!-- telegram -->
          <a target="_blank" :href="getTelegramLink(telegram[0]?.phoneNumber!)!"
            class="flex justify-center items-center gap-x-3 border border-[#e2e0e0] bg-(--bg-gray) p-3 rounded-md"
          >
            <BaseIconClient name="message-square-text" />
            <p class="">{{ $t("property.telegram") }}</p>
          </a>
        </div>
      </div>
    </div>
    <!-- share social media -->
    <div
      class="grid grid-cols-3 gap-5 rounded-lg p-5 border border-(--border-gray) bg-(--card)"
    >
      <h5 class="col-span-full flex items-center gap-x-3">
        <BaseIconClient name="share-2" />
        {{ $t("property.share") }}
      </h5>
      <!-- facebook -->
      <span @click="openShare('FB', shareUrl, property.title)" class="icon">
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
      <span @click="openShare('TG', shareUrl, property.title)" class="icon">
        <BaseIconClient name="message-square-text" />
      </span>
      <!-- copy link -->
      <span class="icon" @click="copy(useFullUrl().getFullUrl())">
        <BaseIconClient name="copy" />
      </span>
    </div>
    <!-- report -->
    <span
      class="flex items-center gap-x-2 justify-center bg-white p-3 rounded-(--radius) cursor-pointer hover:bg-(--nav-active) hover:text-(--nav-active-item) transition-all"
    >
      <BaseIconClient name="flag" />
      {{ $t("property.report") }}
    </span>
    {{ shareUrl }}
  </section>
</template>

<script lang="ts" setup>
import BaseAvatar from "~/components/ui/BaseAvatar.vue";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import type { PropertyDetail } from "../interface/properties-details";
import { useFullUrl } from "#imports";
import { useCopy } from "#imports";
import { getTelegramLink } from "#imports";
import { openShare } from "#imports";
const route = useRoute()

const shareUrl = computed(() =>
  import.meta.client
    ? window.location.origin + route.fullPath
    : ''
)
const props = defineProps<{
  property: PropertyDetail;
}>();

const { copy } = useCopy();
// extract phone number only ( not telegram )
const phoneNumber = computed(
  () =>
    props.property?.user?.phones?.filter((item) => item.type === "PHONE") ?? [],
);
const telegram = computed(
  () =>
    props.property?.user?.phones?.filter((item) => item.type === "TELEGRAM") ?? [],
);
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
  background: var(--nav-active);
  color: var(--nav-active-item);
  transition: 0.5s all;
}
</style>
