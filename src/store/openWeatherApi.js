import axios from "axios";

export default {
  //namespaced: 하나의 store에서 모듈화하여 사용될 수 있음을 명시적으로 나타내는 개념을 true로 선언 
  namespaced:true,

  //state: 실제로 취급해야하는 데이터 
  state:{
    cityName:"Seoul",
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
    hourlyWeather:[],
    images:[],
  },

  getters:{},

  mutations:{},


  actions:{
 
    async FETCH_OPENWEATHER_API(context){
    const API_KEY="c12b4d7e30c2e759a3caea44f155650c";
    let initalLat=37.566826;
    let initalLon =126.9778;
    try{
          const res = await axios.get(
           `https://api.openweathermap.org/datclea/3.0/onecall?lat=${initalLat}&lon=${initalLon}&appid=${API_KEY}&units=metric`
             );
           const images = new Array();
            for(let i=0; i<48;i++){
              const WeatherIcon = res.data.hourly[i].weather[0].icon;
              images[i]=`src/assets/images/${eatherIcon}.png`;
              }
         }catch(error){
            console.log(error);
        }

     },
  }
}