import Vue from "vue";
import Vuex from "vuex";

import VuexPersistence from "vuex-persist";
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

const axios = require("axios").default;
const client = axios.create({
  baseURL: "https://us-central1-traj-hard.cloudfunctions.net",
  timeout: 20000,
});

Vue.use(Vuex);
const MINTRY = 5;

export default new Vuex.Store({
  state: {
    allLessons: [],
    
    activeLessonCode: undefined,
    downloadedLessons: {},


    actualQuestionIndex: 0,
    loadingLessons: false,
  },
  getters: {
    loadingLessons: (state) => {
      return state.loadingLessons;
    },
    allLessons: (state) => {
      return state.allLessons;
    },
    downloadedLessons: (state) => {
      return state.downloadedLessons;
    },
    actualQuestion: (state) => {
      if(state.activeLessonCode){
        return state.downloadedLessons[state.activeLessonCode].questions[
          state.actualQuestionIndex
        ];
      } else return undefined;
    },
    actualLesson: (state) => {
      return state.downloadedLessons[state.activeLessonCode];
    },
    activeLessonCode: (state) =>{
      return state.activeLessonCode;
    }
  },
  actions: {
    
    setActiveLessonCode(context, code) {
      context.commit("setActiveLessonCode", code);
    },
    dowloadLesson(context, code) {
      console.log("Downloading lesson: "+code)
      client
        .get("getLesson?code=" + code)
        .then((data) => {
          //TODO: kontrola na data.data.status
          if (data.data.status === "OK") {
            context.commit("setLessonData", {code:code, questions:data.data.data});
            
          }
        })
        .catch((e) => {
          console.log(e.message);
        });
    },
    selectNextActualQuestion(context) {
      let index =  Math.floor(Math.random() * context.state.downloadedLessons[context.state.activeLessonCode].questions.length);
      context.commit("selectNextActualQuestion",index);
    },
    updateStatsNextTry(context, status) {
      context.commit("updateStatsNextTry", status);
    },

    //downloads from firebase
    updateAllLessons(context) {
      context.commit("loadingLessons", true);
      console.log("Downloading...");
      client
        .get("listLectures")
        .then((data) => {
          context.commit("loadingLessons", false);
          context.commit("setAllLessons", data.data);
        })
        .catch((e) => {
          console.log(e.message);
          context.commit("loadingLessons", false);
        });
    },
  },

  mutations: {
    setActiveLessonCode(state, code) {
      state.activeLessonCode = code;
    },
    setLessonData(state, payload) {
      console.log("Seting new lesson data for" + payload.code+":"+JSON.stringify(payload.questions))
      var lessonMetaData = undefined;
      for (var i = 0; i < state.allLessons.length; i++) {
        if (state.allLessons[i].code === payload.code)
          lessonMetaData = state.allLessons[i];
      }
      console.log('Found metedata:'+JSON.stringify(lessonMetaData))
      if (lessonMetaData) {
        console.log("Storing....")
        Vue.set(state.downloadedLessons, payload.code, lessonMetaData);
        Vue.set(state.downloadedLessons[payload.code], "questions", payload.questions);
      }
    },

    setAllLessons(state, val) {
      state.allLessons = val;
    },
    loadingLessons(state, val) {
      state.loadingLessons = val;
    },
    selectNextActualQuestion(state, index) {
      state.actualQuestionIndex = index;
    },
    // {count}
    updateStatsNextTry(state, status) {
      if (!state.downloadedLessons[state.activeLessonCode].questions[state.actualQuestionIndex].stats) {
        Vue.set(state.downloadedLessons[state.activeLessonCode].questions[state.actualQuestionIndex], "stats", {
          count: 0,
          success: 0,
          color: "gray",
          pct: 0,
        });
      }
      state.downloadedLessons[state.activeLessonCode].questions[state.actualQuestionIndex].stats.count++;
      if (status == "OK") {
        state.downloadedLessons[state.activeLessonCode].questions[state.actualQuestionIndex].stats.success++;
      }

      let n = state.downloadedLessons[state.activeLessonCode].questions[state.actualQuestionIndex].stats.count;
      let succ = state.downloadedLessons[state.activeLessonCode].questions[state.actualQuestionIndex].stats.success;

      let nPct = Math.min(n / MINTRY, 1);
      let sPct = n ? succ / n : 0;
      let pct = Math.round(nPct * sPct * 100);
      let col = "gray";
      if (pct < 30) col = "red";
      else if (pct < 50) col = "yellow";
      else if (pct < 85) col = "blue";
      else if (pct <= 100) col = "green";

      state.downloadedLessons[state.activeLessonCode].questions[state.actualQuestionIndex].stats.color = col;
      state.downloadedLessons[state.activeLessonCode].questions[state.actualQuestionIndex].stats.pct = pct;
    },
  },
  plugins: [vuexLocal.plugin],
  modules: {},
});
