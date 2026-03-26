<template>
  <TransitionGroup
    name="slide-up"
    tag="div"
  >
    <slot></slot>
  </TransitionGroup>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
