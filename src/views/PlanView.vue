<script setup lang="ts">
import { onMounted } from 'vue';
import { usePlaceSearch, usePlanMap } from '@/composables/plan';
import { Command, CommandInput } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PlaceResult } from '@/composables/plan/usePlaceSearch';

// 1. 지도 초기화
const { initMap, moveToLocation, addMarker } = usePlanMap();
onMounted(() => initMap());

// 2. 장소 검색 훅
const { query, places, isLoading, searchPlaces } = usePlaceSearch();

// 3. 검색 결과 클릭 시 지도 이동 + 마커 추가
function handlePlaceClick(place: PlaceResult) {
  moveToLocation(place.location);
  addMarker({
    position: place.location,
    label: place.name,
  });
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-start gap-4 bg-gray-100 p-6">
    <div class="flex w-full flex-col items-center gap-5">
      <div class="flex w-full items-center gap-2">
        <Command>
          <CommandInput v-model="query" placeholder="장소 검색..." @keyup.enter="searchPlaces" />
        </Command>
        <Button :disabled="isLoading" @click="searchPlaces">
          {{ isLoading ? '검색 중...' : '검색' }}
        </Button>
      </div>

      <ScrollArea class="w-full max-w-2xl">
        <div
          v-for="place in places"
          :key="place.name + place.address"
          class="mb-2 flex cursor-pointer items-center gap-4 rounded-lg border bg-white p-3 shadow hover:bg-gray-100"
          @click="handlePlaceClick(place)"
        >
          <img
            v-if="place.photoUrl"
            loading="lazy"
            :src="place.photoUrl"
            alt="장소 이미지"
            class="h-24 w-24 rounded object-cover"
          />

          <div>
            <div class="text-lg font-semibold">{{ place.name }}</div>
            <div class="text-sm text-gray-600">{{ place.address }}</div>
          </div>
        </div>
      </ScrollArea>
    </div>

    <div id="map" class="mt-6 h-[400px] w-full rounded-lg shadow" />
  </div>
</template>
