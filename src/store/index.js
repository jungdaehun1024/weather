//Vuex store 초기작업 
import { createStore } from "vuex";
import openWeatherApi from "./openWeatherApi"


export default createStore({
  //외부 API와 통신할 Axios
   modules: {
    openWeatherApi,
   },
})