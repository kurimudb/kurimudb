<script setup lang="ts">
import { onMounted } from 'vue';
import { cookbook, cookbookActions } from './modules/cookbook';
import Menu from './components/menu.vue'
import Linking from './components/linking.vue';

onMounted(async () => {
  void cookbookActions.bootstrap();
})
</script>

<template>
  <suspense>
    <Transition name="aurora-fade">
      <Linking v-if="cookbook.linked === false" />
      <div v-else class="cookbook">
        <Menu />
      </div>
      </Transition>
  </suspense>
</template>

<style>
.cookbook {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}


/* 淡入淡出 */
.aurora-fade-enter-active {
  animation-name: aurora-fade-in;
  animation-duration: 480ms;
  animation-fill-mode: forwards;
}

@keyframes aurora-fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.aurora-fade-leave-active {
  animation-name: aurora-fade-out;
  animation-duration: 480ms;
  animation-fill-mode: forwards;
}

@keyframes aurora-fade-out {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
