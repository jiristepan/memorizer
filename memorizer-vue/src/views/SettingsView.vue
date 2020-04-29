<template>
      <v-container 
        id="container" 
        fill-height
        fluid>
        <v-layout>
          <v-flex>
            <v-card class="elevation-12">
            <v-card-text>
              <h2>Available lessons 
                <v-btn icon color="gray" @click="$router.push('/test')">
                  <v-icon>close</v-icon>
                </v-btn>
              </h2>
        
              <LessonsList />
            </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
</template>


<script>
import LessonsList from '../components/LessonsList';

export default {
  name: 'SettingsView',

  components: {
    LessonsList
  },

  data: () => ({
    //
  }),
};
</script>


