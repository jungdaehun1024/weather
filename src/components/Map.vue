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
    //window.kakao 와 window.maps객체가 이미 정의되어있는지 확읺아고 
    // 정의되어있다면 initMap()호출해 지도를 초기화한다.
    initMap();
  } else {
    //새로운 script요소를 생성하고 변수에 할당
    const script = document.createElement('script');
    script.src =
      'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=c1b2810f6a37eeaa0eee14d825adf8db';
    
    //스크립트가 로드되었을 때 실행할 함수를 지정한다
    //여기서는 kakao map API스크립트가 로드된 후 실행할 함수로 initMap지정
    script.onload = () => kakao.maps.load(initMap);

    //index.html의 head요소에 추가한다.
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

  //각각의 지역정보를할당받는 변수 
  const positions = MapPositions.map((pos)=>({
    //kakao.maps.LatLng(latitude, longitude): 좌표 정보를 가지고 있는 객체를 생성한다.
    //전개연산자로 위도와 경도(lat과 lng)을 각각의 요소로 분리해 
    //인자로 전달해 좌표정보를 가진 객체를 반환
    latlng: new kakao.maps.LatLng(...pos.latlng),

    //도시이름
    cityName: pos.cityName,
  }));


//마커 생성
// forEach함수로 json배열을 순회하며 
// kakao.maps.Maker에 pos의 좌표값(latlng)을 positon프로퍼티에 담는다.
//forEach : 배열의 각 요소를 순회하며 주어진 함수를 한 번씩 실행한다.
//kakao.maps.Maker(): 주어진 객체로 마커를 생성한다.
positions.forEach((pos)=>{
  const marker = new kakao.maps.Marker({
    position: pos.latlng, // 마커의 위치
  });


  //마커가 지도 위에 표시 되도록 설정한다.
  marker.setMap(map);

  //addListener():다음 지도 API 객체에 이벤트를 등록한다
  //클릭된 마커의 좌표를 vuex store에 전달하는 작업을 할 것 
  //마커를 클릭을 부여하는 코드 
  kakao.maps.event.addListener(marker,"click",()=>{

     //클릭한 위도 경도 정보를 불러온다.
     store.commit('openWeatherApi/SET_CITYNAME', pos.cityName);

     //getPostion: 마커좌표(LatLng) 를 반환한다. 
     store.commit("openWeatherApi/SET_LATLON",marker.getPosition());

   
   //마커가 클릭된 직후 Vuex stroe로 즉각적으로 좌표값이 변경되면서 뮤테이션이 돌고 난 후 
    //api를 dispatch로 다시한번 호출해줌으로 나머지 날씨데이터의 변경을 유도
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