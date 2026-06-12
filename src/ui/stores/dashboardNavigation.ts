import { defineStore } from 'pinia'
import { ref } from 'vue'

export type DashboardTopic = 'resources' | 'characters' | 'places'

export type DashboardView =
  | { kind: 'home' }
  | { kind: 'topic'; topic: DashboardTopic }
  | { kind: 'character'; characterId: string }
  | { kind: 'place'; placeId: string }

export const useDashboardNavigation = defineStore('dashboardNavigation', () => {
  const view = ref<DashboardView>({ kind: 'home' })

  function goHome(): void {
    view.value = { kind: 'home' }
  }

  function openTopic(topic: DashboardTopic): void {
    view.value = { kind: 'topic', topic }
  }

  function openCharacter(characterId: string): void {
    view.value = { kind: 'character', characterId }
  }

  function openPlace(placeId: string): void {
    view.value = { kind: 'place', placeId }
  }

  return {
    view,
    goHome,
    openTopic,
    openCharacter,
    openPlace,
  }
})
