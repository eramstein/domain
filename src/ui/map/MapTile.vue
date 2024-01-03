<script setup lang="ts">
import { computed } from "vue";
import { TILE_WIDTH, TILE_HEIGHT, getTilePixelPos } from "./map";
import type { Tile } from "@/logic/model";

const props = defineProps<{
  x: number;
  y: number;
  tile: Tile;
}>();

const hexPolygonPoints =
  TILE_WIDTH * 0.5 +
  ",0 " +
  TILE_WIDTH +
  "," +
  TILE_HEIGHT * 0.25 +
  " " +
  TILE_WIDTH +
  "," +
  TILE_HEIGHT * 0.75 +
  " " +
  TILE_WIDTH * 0.5 +
  "," +
  TILE_HEIGHT +
  " " +
  "0," +
  TILE_HEIGHT * 0.75 +
  " " +
  "0," +
  TILE_HEIGHT * 0.25;

const tileTranslate = computed(() => {
  console.log(props);

  const { tx, ty } = getTilePixelPos(props.x, props.y);
  return "translate(" + tx + "," + ty + ")";
});
const tileFill = computed(() => {
  return "url(#" + props.tile.terrain + ")";
});
</script>

<template>
  <g :transform="tileTranslate">
    <polygon class="hex" :points="hexPolygonPoints" :fill="tileFill"></polygon>
  </g>
</template>

<style scoped>
.map-tile {
  position: relative;
}
</style>
