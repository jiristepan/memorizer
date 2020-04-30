<template>
      <v-container 
        id="container" 
        fill-height
        fluid>
        <v-layout>
          <v-flex>
            <v-card class="elevation-12">
            <v-card-text>
              <Tester />
            </v-card-text>
            </v-card>
        
            <Stats style="margin-top: 20px" />
            
          </v-flex>
        </v-layout>
      </v-container>
</template>


<script>
import Tester from '../components/Tester';
import Stats from '../components/Stats';

export default {
  name: 'TestView',

  components: {
    Tester, Stats
  },

  data: () => ({
    //
  }),
};
</script>


