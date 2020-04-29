<template>
  <v-card>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Question</th>
            <th class="text-left">Count</th>
            <th class="text-left">Success</th>
            <th class="text-left">%</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in words" :key="item.q">
            
            <td>{{ item.q }}</td>
            <td>{{ item.stats?item.stats.count:0 }}</td>
            <td>{{ item.stats?item.stats.success:0 }}</td>
            <td>
                <v-progress-circular
                    v-if="item.stats"
                    :color="item.stats.color"
                    :value="item.stats.pct"
                >
                {{ item.stats?item.stats.pct:0 }}
                </v-progress-circular>
                
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Stats",
  computed: {
    ...mapGetters(["words"]),
  },
};
</script>
