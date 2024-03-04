import axios from "axios";

export default{

   //Vuex스토어 모듈의 네임스페싱 여부를 나타낸다/
   namespaced: true, // 해당 모듈은 자체 네임스페이스를 공유하게된다.

   //vue.js의 Data와 유사한 기능을 가진다.
   state:{
    position:{
      //디폴트 값으로 서울 좌표를 넣어줌
      lat:37.5683,
      lon:126.9778,
    },
    //도시이름
    cityName:"Seoul",
    //현재날씨
    currentWeather:{
      //main.vue에서 사용
      currentTemp:0,
      currentHumidity:0,
      currentWindSpeed:0,
      currentFeelsLike:0,

      //sub.vue에서 사용 
      currentSunrise:0,
      currentSunset:0,
      currentVisibility: 0,
    },
    //시간대별 날씨 데이터
    hourlyWeather:[],
    //이미지 데이터
    images:[],
   },
   getters:{},
   mutations:{
     //좌표에 대한 mutation
     SET_LATLON(state,payload){
      //payload로 받는 Ma는 lat으로 La는 lon으로 할당
       state.position.lat = payload.Ma;
       state.position.lon = payload.La;
     },

      //도시이름
      SET_CITYNAME(state, payload) {
        state.cityName = payload;
      },

      //현재 날씨 데이터 
      SET_CURRENT_WEATHER(state, payload) {
          state.currentWeather.currentTemp = Math.round(payload.temp); // 현재온도
          state.currentWeather.currentHumidity = payload.humidity; // 습도
          state.currentWeather.currentWindSpeed = payload.wind_speed; // 풍속
          state.currentWeather.currentFeelsLike = Math.round(payload.feels_like); // 체감온도
          state.currentWeather.currentSunrise = payload.sunrise; // 일출시간
          state.currentWeather.currentSunset = payload.sunset; // 일몰시간
          state.currentWeather.currentVisibility = payload.visibility; // 가시거리
      },

      //시간별 날씨 데이터
      SET_TIMELY_WEATHER(state, payload) {
          state.hourlyWeather = payload;
      },
      SET_IMAGEPATH(state, payload) {
          state.images = payload;
      },
   },

   actions:{
    async FETCH_OPENWEATHER_API(context){
      let initalLat=context.state.position.lat;
      let initalLon =context.state.position.lon
      const API_KEY="c12b4d7e30c2e759a3caea44f155650c";
      //}&units=metric: 섭씨로 표현해주기위함 
      const WAETHER_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${initalLat}&lon=${initalLon}&appid=${API_KEY}&units=metric`;
    
      try{
        const res = await axios.get(WAETHER_URL);
        const images = new Array();
        for(let i = 0; i<48 ; i++){
          const weatherIcon = res.data.hourly[i].weather[0].icon;
          //JS내에서 파일을 동적으로 로드할 때 require를 사용한다.
          images[i] = require(`@/assets/images/${weatherIcon}.png`);
        }

        
        //actions에서 mutaions사용할 때는 commit사용한다.
        context.commit("SET_IMAGEPATH",images);
        context.commit('SET_CURRENT_WEATHER', res.data.current); // 조회하는 현재시간에 대한 날씨데이터
        context.commit('SET_TIMELY_WEATHER', res.data.hourly);
      }catch(error){
        console.log(error);
      }
      

}
   }

  }




