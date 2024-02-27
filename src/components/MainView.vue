<template>
  <div class="leftContainer">
    <div id="cityNameBox">
      <div class="cityName">
        <p>{{ cityName }}</p>
        <p>{{currentTime}}</p>
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
        <div class="weatherDegree">
          <p>{{currentTemp}}&deg;</p>  <!-- &deg :	Degree sign-->
        </div>
        <div class="weatherIcon">
          <img :src="images[0]" alt="MainLogo">
        </div>
        <div class="weatherData">
          <div v-for="temporary in temporaryData" :key="temporary.title" class="detailData">
          <p>{{ temporary.title }}</p>
          <p>{{ temporary.value }}</p>
        </div>
        </div>
      </div>
    </div>
    <div id="todayWeather">
      <div class="textBox">
        <p>시간대별 날씨 정보</p>
        <p>이번주 날씨 보기</p>
      </div>
      <div class="timelyWeatherBox">
        <div class="timelyWeather" v-for="(temp,index) in arrayTemps" :key="index">
          <div class="icon">
            <img :src="images[index]" alt="">
          </div>
          <div class="data">
            <p class="time">{{ unix_timestamp(temp.dt) }}</p>
            <p class="currentDegree">{{Math.round(temp.temp)}}&deg;</p> 
            <div>
              <img src="@/assets/images/drop.png" alt="">
              <p class="fall">{{temp.humidity}}%</p>
            </div>
          </div>
   
        </div>
      </div>

    </div>

    <nav>
      <i class="fas fa-home"></i>
      <i class="fas fa-search-location"></i>
      <i class="fas fa-chart-line"></i>
      <i class="fas fa-cog"></i>
    </nav>
  </div>
  <SubView/>
</template>

 <script setup>

import store from '@/store';
import SubView from './SubView.vue';
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

dayjs.locale("ko")  // global로 한국어 locale 사용한다.
// 현재 시간을 나타내기 위한 Dayjs 플러그인 사용 
const currentTime = ref(dayjs().format("YYYY. MM. DD .ddd"));
const arrayIcons= ref([]);
onMounted(async()=>{
   const store = useStore();
   await store.dispatch("openWeatherApi/FETCH_OPENWEATHER_API");
  //  const {currentTemp:temp, currentHumidity, currentWindSpeed, currentFeelsLike} = store.state.openWeatherApi.currentWeather
  //  currentTemp.value = temp;
})


//computed에 선언된 것은 함수가 아니며 
//state에 선언된 데이터와는 전혀 다른 값이다?
//computed자체는 이것이 선언된 컴포넌트에서 사용할 목적으로 만든 데이터이기 때문 

//마커 선택시 레이아웃에 보여지는 도시 이름 
const cityName = computed(()=>{
  return store.state.openWeatherApi.cityName;// 기본값 seoul
})

//현재 시간에 따른 온도 데이터 
const currentTemp = computed(()=>{
  const{currentTemp} = store.state.openWeatherApi.currentWeather;
  return currentTemp;
})

const arrayTemps = computed(()=>{
  return store.state.openWeatherApi.hourlyWeather;
})

const temporaryData = computed(()=>{
  const {currentHumidity,currentWindSpeed,currentFeelsLike} = store.state.openWeatherApi.currentWeather;

  return [
  {
    title:"습도",
    value:currentHumidity+"%",
  },
  {
    title:"풍속",
    value:currentWindSpeed+"m/s",
  },
  {
    title:"체감온도",
    value:currentFeelsLike+"도",
  }
  ]
})

const images = computed(()=>{
  return store.state.openWeatherApi.images;
})


  //초단위로 표현되는 UnixTimestamp를 밀리초단위로 변환해 '시간'정보를 얻는다.
  function unix_timestamp(dt){
    let date = new Date(dt * 1000);
    let hour = "0" + date.getHours();
      return hour.substring(hour.length-2)+"시"
  }
 

</script> 


<style lang="scss" scoped>

//main.scss를 import
@import "@/scss/main.scss";

//가장 외곽 박스 
.leftContainer{
  width: 324px;
  height:700px;
  border-radius:50px ;  // 테두리를 둥글게 
  background: linear-gradient(#16455f,#0e1239); // 배경 그라데이션 
  box-shadow: 10px 10px 10px gray ; // 그림자 효과  
  min-width: 324px;

  #cityNameBox{
     width: 100%;
     height: 10%;

     .cityName{
        @include c-center; //main.scss의 c-center 스타일을 적용 (가운데정렬)
        width: 100%; //너비
        height: 100%;// 높이 
        p{
          color: white;
          font-family: "Poppins", sans-serif; // Poppins사용, 그렇지 않으면 sans-serif글꼴 사용 
          line-height: 2.5; // 줄 높이를 정한다. (54px)
          text-align: center;

          //&로 부모인p에 정의된 속성들을 상속받고 
          // :first-child는 자식 요소 중 가장 첫 번째를 선택하는 가상 클래스이다.
          &:first-child{
            width: 241px;
            height: 33px;
            font-size: 1.35rem; //21.6px
          }

          // 마지막 요소를 선택 
          &:last-child{
            width:160px;
            height: 19px ;
            font-size: 0.9rem;
            font-weight: 100
;

          }
        }
     }
  }

  #contentsBox{
     width: 100%;
     height: 62.5%;

     .buttonBox{
      @include center;
      width: 100%;
      height: 20%;

      .buttonBackground{
        width: 224px;
        height:  35px;
        background-color:#052137;
        border-radius: 10px;

        display: flex;

        button{
          width: 112px;
          height: 35px;
          border: 0;
          border-radius: 7.5px;
          outline: 0;

          cursor: pointer; // 마우스 커서 눌렀을떼 손가락 표시

          //button태그의 forecast라는 클래스명을 가진 버튼에 대한 스타일을 지정
          &.forecast{
            background-color: #0889ff;
            color: white;
          }
          &.airquality{
            background: transparent;
            color: #467599;
          
          }
        }
      }
     }


     .weatherBox{
      width: 100%;
      height: 80%;

      .weatherDegree{
        @include center;
        width: 100%;
        height: 15%;
        p{
        font-size:3.5rem;
        font-weight: 500;
        font-family: "Be Vietnam Pro",sans-serif;
        color: white;
        }

      }


      .weatherIcon{
        @include center;
        width: 100%;
        height: 60%;
        img{
        
          height: 160px;
        }
      }

      .weatherData{
        display: flex;
        width: 100%;
        height: 25%;

        .detailData{
          @include c-center;
          width: 33.33%;
          height: 100%;

          //가상클래스를 지정해서 nth-child의 괄호안에 일치하는 자식요소에 스타일 적용한다.
          &:nth-child(1){
            margin-left: 10px;
          }
          &:nth-child(2){
            margin-left:0 -10px;
          }
          &:nth-child(3){
            margin-right: 10px;
          }

          p{
            line-height: 1.5;
            color: white;

            &:first-child{
              font-size: 1rem;
              font-weight: 300;
              font-family: "Noto Sans KR",sans-serif;
              color: #799ed0;
            }

            &:last-child{
              font-size: 1rem;
              font-weight: 200;
              font-family: "Poppins",sans-serif;
              color: #799ed0;
            }
          }
        }
      }
    }
  }

  
  #todayWeather{
    width: 100%;
    height: 17.5%;

    .textBox{
      @include center-sb;
      width: calc(100% - 70px); //padding속성 때문에 -70해준거
      height: 35%;
      padding:  0 35px;
      font-family:"Noto Sans KR", sans-serif;
      p{
        
        font-weight: 400;
        font-size: 0.8rem;
        color: white;
        text-align: center;

        &:last-child{
          font-weight: 400;
          font-size: 0.8rem;
          cursor: pointer;
          color: #0889ff;
        }
      }
    }
    .timelyWeatherBox{
      display: flex;
      align-items: center;
      width: calc(100% - 70px);
      height: 65%;
      padding: 0 30px;
      overflow: scroll;
      .timelyWeather{
        display: flex;
        width:126px;
        min-width: 126px;
        height: 70px;
        background-color: #5989ff;
        border-radius: 20px;
        margin-left: 15px;
        &:first-child{
          margin-left: 0;
        }
        .icon{
          @include center;
          width: 45%;
          height: 100%;
          img{
            width: 100%;
          }
        }
        .data{
          @include c-center-se;
          width:55%;
          height: 100%;
     
          p{
            color:whitesmoke;
            font-family: "Poppins",sans-serif;
            text-align: center;
            &.time{
              font-size: 0.8rem;
              font-weight: 200;
              margin-top:0px;
              margin-bottom: 0px;
            
           
            }

            &.currentDegree{
              font-size: 1.2rem;
              margin-top:1px;
              margin-bottom: 1px;
              height: 33.33%
            }
          }
          div{
            @include center;
            width: 100%;
            height: 33.33%;
            img{
              height: 55%;
            }
            .fall{
              font-size: 0.9rem;
              margin-top:1.5px;
              margin-bottom: 0px;
            }
          }
        }
      }
    }
  }

  nav{
    @include center-sb;
    width: calc(100% - 100px);
    height: 10%;
    padding: 0 50px;

    i{
      color: rgb(255, 255, 255);
      font-size: 1.15rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover{
        color: #799ed0;
      }
    }
  }
}
</style>