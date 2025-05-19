import { Loader } from '@googlemaps/js-api-loader';
import { ref } from 'vue';

// ✅ 이렇게 바꿔서 테스트
export function usePlanMap() {
  const markers = ref<google.maps.marker.AdvancedMarkerElement[]>([]);
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
  });

  // const places = [
  //   { name: '마커 1', lat: 37.501274, lng: 127.039585 },
  //   { name: '마커 2', lat: 37.502, lng: 127.039 },
  //   { name: '마커 3', lat: 37.504, lng: 127.043 },
  //   { name: '마커 4', lat: 37.506, lng: 127.041 },
  //   { name: '마커 5', lat: 37.508, lng: 127.045 },
  // ];

  let map: google.maps.Map | null = null;

  const initMap = async () => {
    const { Map: GoogleMap } = (await loader.importLibrary('maps')) as google.maps.MapsLibrary;
    // const { AdvancedMarkerElement, PinElement } = (await loader.importLibrary(
    //   'marker'
    // )) as google.maps.MarkerLibrary;

    map = new GoogleMap(document.getElementById('map') as HTMLElement, {
      center: { lat: 37.501274, lng: 127.039585 },
      zoom: 15,
      mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
    });

    // const infoWindow = new google.maps.InfoWindow();

    // places.forEach((place, i) => {
    //   const pin = new PinElement({
    //     glyph: `${i + 1}`,
    //     background: '#3189C6',
    //     borderColor: '#ffffff',
    //     glyphColor: '#ffffff',
    //   });

    //   const marker = new AdvancedMarkerElement({
    //     position: { lat: place.lat, lng: place.lng },
    //     map,
    //     title: place.name,
    //     content: pin.element,
    //     gmpClickable: true,
    //   });

    //   // InfoWindow 이벤트 연결
    //   marker.addListener('gmp-click', () => {
    //     infoWindow.close();
    //     infoWindow.setContent(`<strong>${place.name}</strong>`);
    //     infoWindow.open(map, marker as unknown as google.maps.MVCObject);
    //   });
    // });
    return map;
  };

  async function addMarker({
    position,
    label,
  }: {
    position: google.maps.LatLng | google.maps.LatLngLiteral;
    label?: string;
  }) {
    const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    const pin = new PinElement({
      glyph: label?.[0] ?? '',
    });

    const marker = new AdvancedMarkerElement({
      map,
      position,
      content: pin.element,
    });

    markers.value.push(marker);
  }

  function moveToLocation(position: google.maps.LatLng | google.maps.LatLngLiteral) {
    // map 객체 초기화 되었는지 확인 필요(에러 처리)
    map?.setCenter(position);
    map?.setZoom(15);
  }

  return {
    initMap,
    // moveToPlace,
    addMarker,
    moveToLocation,
  };
}
