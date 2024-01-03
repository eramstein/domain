<script setup lang="ts">
import { loadState } from "./state/db";
import GameMain from "./ui/GameMain.vue";

loadState();
</script>

<template>
  <div>
    <GameMain />
  </div>
</template>

<style scoped></style>
