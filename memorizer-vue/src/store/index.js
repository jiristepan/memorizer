import Vue from 'vue'
import Vuex from 'vuex'

const axios = require('axios').default;
const client = axios.create({
  baseURL: 'https://us-central1-traj-hard.cloudfunctions.net',
  timeout: 5000,
});

Vue.use(Vuex)
const MINTRY = 5

export default new Vuex.Store({
    state: {
        allLessons: [{
         
        }],
        downloadedLessons:[
          {name:"test",qustions:"5",state:"new"}
        ],
        words: [
          {a:"carnivore", q:"masožravý"},
          {a:"le désastre", q:"pohroma"},
          {a:"le désastre", q:"zkáza"},
          {a:"dévorer", q:"sežrat"},
          {a:"dévorer", q:"hltat"},
          {a:"dur", q:"tvrdý"},
          {a:"écraser", q:"rozdrtit"},
          {a:"énorme", q:"ohromný"},
          {a:"énorme", q:"obrovský"},
          {a:"la épreuve", q:"zkouška"},
          {a:"face", q:"čelem k"},
          {a:"féroce", q:"krutý"},
          {a:"féroce", q:"líný"},
          {a:"la fois", q:"krát"},
          {a:"n'importe quoi", q:"cokoliv"},
          {a:"incroyable", q:"neuvěřitelný"},
          {a:"le insecte", q:"hmyz"},
          {a:"magique", q:"magický"},
          {a:"monstrueux", q:"zrůdný"},
          {a:"monstrueuse", q:"monstrum"},
          {a:"mourir", q:"zemřít"}
          ],
        actualWordIndex: 0,
        loadingLessons: false
    },
    getters: {
      loadingLessons: (state) => {
        return state.loadingLessons
      },
        allLessons: (state) => {
          return state.allLessons
        },
        downloadedLessons: (state) => {
          return state.downloadedLessons
        },
        actualWord: (state) => {
            return state.words[state.actualWordIndex]
        },
        words: (state) => {
          return state.words;
        }

    },
    actions:{
      selectNextActualWord(context) {
        context.commit("selectNextActualWord")
      },
      updateStatsNextTry(context, status){
        context.commit("updateStatsNextTry", status)
      },

      //downloads from firebase
      updateAllLessons(context){
        context.commit("loadingLessons",true)
        console.log("Downloading...")
        client.get("listLectures")
        .then(data =>{
          context.commit("loadingLessons",false)
          context.commit("setAllLessons",data.data)
        })
        .catch(e => {
          console.log(e.message)
          context.commit("loadingLessons",false)
        })
      }
    },

    mutations: {
         setAllLessons(state,val){
          state.allLessons = val
         },
         loadingLessons(state,val){
           state.loadingLessons = val
         },
        selectNextActualWord(state) {
            state.actualWordIndex = Math.floor(Math.random() * state.words.length)
        },
        // {count}
        updateStatsNextTry(state, status) {
            if (!state.words[state.actualWordIndex].stats) {
              Vue.set(state.words[state.actualWordIndex],"stats",{
                    count: 0,
                    success: 0,
                    color: "gray",
                    pct: 0
                })
            }
            state.words[state.actualWordIndex].stats.count++
                if (status == "OK") {
                    state.words[state.actualWordIndex].stats.success++
                }

            let n = state.words[state.actualWordIndex].stats.count
            let succ = state.words[state.actualWordIndex].stats.success

            let nPct = Math.min(n / MINTRY, 1)
            let sPct = n ? succ / n : 0
            let pct = Math.round(nPct * sPct * 100)
            let col = "gray"
            if (pct < 30) col = "red"
            else if (pct < 50) col = "yellow"
            else if (pct < 85) col = "blue"
            else if (pct <= 100) col = "green"

            state.words[state.actualWordIndex].stats.color = col
            state.words[state.actualWordIndex].stats.pct = pct

        }
    },
    modules: {}
})