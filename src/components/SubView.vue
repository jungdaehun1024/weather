<template>
  <!--가장 바깥쪽 레이아웃-->
  <div class="rightContainer">
    <div id="cityNameBox">
      <div class="cityName">
        <p>{{ cityName }}</p>
        <p>{{ currentTime }}</p>
        
      </div> 
    </div>
    <div id="contentsBox">
      <div class="buttonBox">
        <div class="buttonBackground">
          <button class="forecast">Forecast</button>
          <button class="airquality">Air Quality</button>
        </div>
      </div>
      <div class="weatherBox">
        <div class="airCondition">
           <p>{{ feeling }}</p>
        </div>
        <div class="detail">
          <div class="title">
            <p>☁️상세 날씨 데이터</p>
          </div>
          <div class="data" v-for="(detailData,index) in subWeatherData" :key="index">
            <div class="dataName">
              <p></p>
              <p>{{ detailData.name }}</p>
            </div>
            <div class="dataValue">
              <p>{{detailData.value}}
                <span></span> 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  <Map/>
    <nav>
      <i class="fas fa-home"></i>
      <i class="fas fa-search-location"></i>
      <i class="fas fa-chart-line"></i>
      <i class="fas fa-cog"></i>
    </nav>
  </div>

</template>

<script setup>
  import Map from './Map.vue';
  import { computed, onMounted, ref, watchEffect } from 'vue';
  import dayjs, { unix } from "dayjs";
  import "dayjs/locale/ko";
  import { useStore } from 'vuex';
  dayjs.locale("ko")  // global로 한국어 locale 사용한다.

//현재 시간을 나타내기 위한 Dayjs 플러그인 사용 
let currentTime = ref(dayjs().format("YYYY. MM. DD .ddd"));

let cityName = ref("");// 도시 이름
let feeling = ref("");// 체감온도 
let subWeatherData = ref([]);

//타임스탬프로 변환
const unix_timestamp =(dt)=>{
 let date = new Date(dt * 1000);
 let hour = "0"+date.getHours()
 return hour.substring(hour.length-2)+"시";
}

const store = useStore();

const fetchOpenWeatherApi = async()=>{
  //API호출을 위한 필수 데이터 
  try{
    await store.dispatch("openWeatherApi/FETCH_OPENWEATHER_API");
    const { currentFeelsLike, currentSunrise, currentSunset, currentVisibility} = store.state.openWeatherApi.currentWeather;
    let isInitalCityName = store.state.openWeatherApi.cityName; // 초기 도시 이름 데이터 

    //초기 체감온도 데이터 
    let isFeelLikeTemp = computed(()=>{
      return currentFeelsLike;
    })
    
    //일출시간 데이터
    let isTimeOfSunrise = computed(()=>{
      return currentSunrise;
    })

    //일몰시간 데이터
    let isTimeOfSunSet = computed(()=>{
      return currentSunset;
    })

    //가시거리 데이터 
    let isLineOfSight = computed(()=>{
      return currentVisibility;
    })



    const tempPoints = [0,10,15,20,25,30];//breakPoint값들이 들어있는 배열 
    const lavels = ["매우 추움","추움","씰쌀함","선선함","보통","더움","매우 더움"] // 체감온도를 표시해주는 텍스트가 담긴 배열 
    let index = 0;// 인덱스 
    for(const point of tempPoints ){
      if(isFeelLikeTemp.value <= point) break;
      index ++
    }
    feeling.value = lavels[index];

    //가공한 데이터로 새로운 배열 생성 
    let isProcessedData = [
      {name:"일출시간",value:unix_timestamp(isTimeOfSunrise.value)},
      {name:"일몰시간",value:unix_timestamp(isTimeOfSunSet.value)},
      
      //정규표현식을 사용한 3자리마다 쉼표찍기
      {name:"가시거리",value:isLineOfSight.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "M",}
    ];

    //Composition Api에서 Ajax 요청과 데이터 변경을 하려면 .value로 접근해야한다.
    cityName.value = isInitalCityName;
    subWeatherData.value = isProcessedData;


  }catch(error){
    console.log(error);
  }
};

watchEffect(async ()=>{
  await fetchOpenWeatherApi();
});

onMounted(()=>{
  fetchOpenWeatherApi();
})






</script>

<style lang="scss" scoped>
@import "@/scss/main.scss";

.rightContainer {
    // width: 40%;
    // height: 100%;
    width: 324px;
    min-width: 324px;
    height: 700px;
    border-radius: 50px;
    background: linear-gradient(#cb0000, #0e1239);
    box-shadow: 5px 5px 10px gray;

    #cityNameBox {
        width: 100%;
        height: 10%;

        .cityName {
            @include c-center;
            width: 100%;
            height: 100%;

            p {
                color: white;
                font-family: 'Poppins', sans-serif;
                line-height: 2.5;
                text-align: center;

                &:first-child {
                    width: 241px;
                    height: 33px;
                    font-size: 1.35rem;
                }
                &:last-child {
                    width: 160px;
                    height: 19px;
                    font-size: 0.9rem;
                    font-weight: 100;
                }
            }
        }
    }

    #contentsBox {
        width: 100%;
        height: calc(45% - 16px);
        margin-top: 16px;

        .buttonBox {
            @include center;
            width: 100%;
            height: 20%;

            .buttonBackground {
                width: 224px;
                height: 35px;
                background-color: #370505;
                border-radius: 10px;
                display: flex;

                button {
                    width: 112px;
                    height: 35px;
                    border: 0;
                    border-radius: 7.5px;
                    outline: 0;
                    cursor: pointer;
                    &.forecast {
                        background-color: transparent;
                        color: #a52727;
                    }
                    &.airquality {
                        background: #ff0000;
                        color: white;
                    }
                }
            }
        }
        .weatherBox {
            width: 100%;
            height: 80%;

            .airCondition {
                @include center;
                width: 100%;
                height: 35%;

                p {
                    text-align: center;
                    font-size: 2.25rem;
                    font-weight: 500;
                    font-family: 'GmarketSansBold';
                    color: #fff;
                }
            }
            .detail {
                width: 100%;
                height: 65%;

                .title {
                    @include center;
                    width: 100%;
                    height: 25%;
                    color: white;

                    p {
                        font-family: 'LeferiPoint-WhiteObliqueA';
                    }
                }
                .data {
                    display: flex;
                    width: 100%;
                    height: 27.5%;
                    // background-color: rgb(187, 127, 255);

                    .dataName {
                        display: flex;
                        align-items: center;
                        width: 50%;
                        height: 100%;
                        font-family: 'LeferiPoint-WhiteObliqueA';

                        p {
                            &:first-child {
                                display: block;
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background-color: #ffde23;
                                margin-left: 50px;
                            }
                            &:last-child {
                                margin-left: 10px;
                                color: white;
                                font-weight: 300;
                                font-size: 0.9rem;
                            }
                        }
                    }
                    .dataValue {
                        display: flex;
                        align-items: center;
                        justify-content: right;
                        width: 50%;
                        height: 100%;
                        font-family: 'LeferiPoint-WhiteObliqueA';

                        p {
                            color: white;
                            font-weight: 300;
                            margin-right: 50px;

                            span {
                                font-weight: 600;
                            }
                        }
                    }
                }
            }
        }
    }

    nav {
        @include center-sb;
        width: calc(100% - 100px);
        height: 10%;
        padding: 0 50px;

        i {
            color: rgb(255, 255, 255);
            font-size: 1.15rem;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                color: #799ed0;
            }
        }
    }
}
</style>