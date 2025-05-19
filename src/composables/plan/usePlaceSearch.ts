import { ref } from 'vue';

export type PlaceResult = {
  name: string;
  address: string;
  photoUrl?: string;
  location: google.maps.LatLng;
};

export function usePlaceSearch() {
  const query = ref('');
  const places = ref<PlaceResult[]>([]);
  const isLoading = ref(false);

  async function searchPlaces() {
    isLoading.value = true;
    try {
      const { Place } = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;

      const request = {
        textQuery: query.value,
        fields: ['displayName', 'location', 'formattedAddress', 'photos'],
        region: 'kr',
        maxResultCount: 20,
        language: 'ko',
      };

      const response = await Place.searchByText(request);
      places.value = (response?.places || []).map(p => ({
        name: p.displayName ?? '',
        address: p.formattedAddress ?? '',
        photoUrl: p.photos?.[0]?.getURI?.() ?? '',
        location: p.location ?? new google.maps.LatLng(0, 0),
      }));
    } finally {
      isLoading.value = false;
    }
  }

  return {
    query,
    places,
    isLoading,
    searchPlaces,
  };
}
