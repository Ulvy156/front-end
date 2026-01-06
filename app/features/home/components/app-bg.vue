<template>
  <section class="lg:h-[60dvh] md:h-[40dvh] h-[30dvh] bg-black ">
      <div class="bg-image flex flex-col items-center justify-center pointer-events-none">
        <div class="bg-content">
          <h2 class="w-[70%] m-auto">{{ $t('home.bg.title') }}</h2>
          <p>{{ $t('home.bg.content') }}</p>
        </div>
    
      </div>
  </section>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.bg-image {
  background-image: url('/bg.png');
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

.bg-content {
  position: relative;
  top: -80px;
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