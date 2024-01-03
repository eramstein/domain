<script setup lang="ts">
import { reactive } from "vue";
import { state } from "@/state/use-state";

import MapTile from "./MapTile.vue";
import type { Tile } from "@/logic/model";

const tiles = reactive(state.gs.map);

function onCellClick(tile: Tile) {
  console.log("clicked on", tile);
}
</script>

<template>
  <div class="hex-map">
    <svg id="tiles-container" width="1400" height="1200">
      <defs>
        <filter id="highlight">
          <feComponentTransfer>
            <feFuncR type="linear" slope="2" />
            <feFuncG type="linear" slope="2" />
            <feFuncB type="linear" slope="2" />
          </feComponentTransfer>
        </filter>
        <filter id="shade">
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.3" />
            <feFuncG type="linear" slope="0.3" />
            <feFuncB type="linear" slope="0.3" />
          </feComponentTransfer>
        </filter>
        <filter id="alert">
          <feComponentTransfer>
            <feFuncR type="linear" slope="1" />
            <feFuncG type="linear" slope="3" />
            <feFuncB type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
        <pattern
          id="HILLS"
          patternUnits="userSpaceOnUse"
          width="120"
          height="120"
        >
          <image xlink:href="/src/assets/backgrounds/Hills.png" />
        </pattern>
        <pattern
          id="MOUNTAIN"
          patternUnits="userSpaceOnUse"
          width="120"
          height="120"
        >
          <image xlink:href="/src/assets/backgrounds/Mountain.png" />
        </pattern>
        <pattern
          id="PLAINS"
          patternUnits="userSpaceOnUse"
          width="120"
          height="120"
        >
          <image xlink:href="/src/assets/backgrounds/Plains.png" />
        </pattern>
        <pattern
          id="WATER"
          patternUnits="userSpaceOnUse"
          width="120"
          height="120"
        >
          <image xlink:href="/src/assets/backgrounds/Water.png" />
        </pattern>
      </defs>
      <template v-for="(row, x) in tiles">
        <map-tile
          v-for="(tile, y) in row"
          :key="x + '-' + y"
          @click="onCellClick(tile)"
          v-bind="{
            x,
            y,
            tile,
          }"
        ></map-tile>
      </template>
    </svg>
  </div>
</template>

<style scoped>
.hex-map {
  width: 100%;
  height: 100vh;
}
</style>
