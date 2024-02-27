<template>
  <div id="mapContainer">
    <div id="map">
     
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import MapPositions from '@/assets/map-positions.json';
import { useStore } from 'vuex';
const store = useStore();

onMounted(()=>{
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    const script = document.createElement('script');
    script.src =
      'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=c1b2810f6a37eeaa0eee14d825adf8db';
    
      /* global kakao */
    script.onload = () => kakao.maps.load(initMap);

    document.head.appendChild(script);
  }
})


//지도를 초기화하는 함수 
function initMap(){


  //mapContainer: 지도가 표시될 HTML element
  const mapContainer = document.getElementById('map'); // 지도를 표시할 div
 
  //지도 옵션
  const mapOption = {
          center: new kakao.maps.LatLng(37.564343, 126.947613), // 지도의 중심좌표
          level: 13, // 지도의 확대 레벨
        };

  //지도 생성
  const map = new kakao.maps.Map(mapContainer, mapOption);

  const positions = MapPositions.map((pos)=>({
    latlng: new kakao.maps.LatLng(...pos.latlng),
    cityName: pos.cityName,
  }));

//마커를 생성한다.
//마커가 클릭된 직후 Vuex stroe로 즉각적으로 좌표값이 변경되면서 뮤테이션이 돌고 난 후 
//api를 dispatch로 다시한번 호출해줌으로 나머지 날씨데이터의 변경을 유도
positions.forEach((pos)=>{
  const marker = new kakao.maps.Marker({
    position: pos.latlng, // 마커의 위치
  });

  //마커가 지도 위에 표시 되도록 설정한다.
  marker.setMap(map);

  //클릭된 마커의 좌표를 vuex store에 전달하는 작업을 할 것 
  //마커를 클릭을 부여하는 코드 
  
  kakao.maps.event.addListener(marker,"click",()=>{
     //클릭한 위도 경도 정보를 불러온다.
     //watch로 따로 빼지않고 직접 vuexStore에 전달
     store.commit('openWeatherApi/SET_CITYNAME', pos.cityName);
     store.commit("openWeatherApi/SET_LATLON",marker.getPosition());
     store.dispatch('openWeatherApi/FETCH_OPENWEATHER_API');
  });

  
});

}
   


</script>

<style lang="scss" scoped>
@import '@/scss/main.scss';

#mapContainer {
  @include center;
  width: 100%;
  height: 35%;
  #map{
    width:80%;
    height: 90%;
    border-radius: 10px;
  }
}
</style>