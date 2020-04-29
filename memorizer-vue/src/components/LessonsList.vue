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
            <td>{{ item.questions }}</td>
            <td>{{ item.state }}</td>
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
          <tr v-for="item in allLessons" :key="item.q">
            <td>{{ item.name }}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "LessonList",
  computed: {
    ...mapGetters(["allLessons","downloadedLessons"]),
  },
  mounted(){
    this.$store.dispatch("updateAllLessons",null, {root:true})
  }
};
</script>
