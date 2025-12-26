<template>
  <section>
      <div class="bg-image flex flex-col items-center justify-center">
        <div class="bg-content">
          <h2 class="w-[70%] m-auto">{{ $t('home.bg_title') }}</h2>
          <p>{{ $t('home.bg_content') }}</p>
        </div>
        <div class="bg-overlay"></div>
      </div>
  </section>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Rooms for Rent in Cambodia | RoomRent',
  description: 'Find rooms and apartments for rent in Cambodia. Filter by price, location, and nearby places.',
  ogTitle: 'Rooms for Rent in Cambodia',
  ogDescription: 'Browse affordable rooms and apartments for rent in Cambodia.',
  ogType: 'website',
  ogUrl: 'https://yourdomain.com',
})
</script>

<style scoped>
.bg-image {
  background-image: url('/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 70vh;
  width: 100%;

}
.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.15),
    rgba(230,240,255,0.55)
  );
  backdrop-filter: blur(2px) saturate(120%);
  -webkit-backdrop-filter: blur(14px) saturate(115%);
}
.bg-content {
  position: relative;
  top: -50px;
  z-index: 2;
  color: #111;
  text-align: center;
  padding-top: 10rem;
  line-height: 2cm;
  letter-spacing: 10px;
  opacity: 0.85;
}
.bg-content p {
  letter-spacing: 5px;
}
</style>