<template>
  <v-card>
    <h3>Downloaded lessons</h3>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Lesson</th>
            <th class="text-left">Questions</th>
            <th class="text-left">State</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in downloadedLessons" :key="item.q">
            
            <td>{{ item.name }}</td>
            <td v-if="item.questions">{{ item.questions.length }}</td>
            <td>
              <span v-if="item.code==activeLessonCode">ACTIVE</span>
              <span v-else><v-btn color="primary" @click="selectLesson(item.code)">SELECT</v-btn></span>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <h3>All lessons available</h3>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Lesson</th>
            <th class="text-left">State</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in allLessons" :key="item.code">
            <td>{{ item.name }}</td>
            <td>
              <v-btn 
                color="primary"
                :loading="loading[item.code]"
                :dissabled="loading[item.code]"
                @click="download(item.code)">
                Download
              </v-btn>
            </td>
            <td></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>
<style>
  h2 {
    margin-bottom: 20px;
  }
  h3 {
    margin: 10px 20px;
  }
  table{
    margin-bottom: 10px;
  }
</style>
<script>
import Vue from 'vue'
import { mapGetters } from "vuex";
export default {
  name: "LessonList",
  data: () => ({
    loading:{}
  }),
  computed: {
    ...mapGetters(["allLessons","downloadedLessons","activeLessonCode"]),
  },
  methods:{
    download(code){
      Vue.set(this.loading,code,true)
      this.$store.dispatch("dowloadLesson",code)
      setTimeout(()=>{
        Vue.set(this.loading,code,false)
      },1000)
    },
    selectLesson(code){
      this.$store.dispatch("setActiveLessonCode", code)
      this.$router.push("/test")
    }
  },
  mounted(){
    this.$store.dispatch("updateAllLessons",null, {root:true})
  }
};
</script>
