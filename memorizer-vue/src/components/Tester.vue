<template>
  <v-container>
    <v-row v-if="actualWord" no-gutters>
      <v-col>
        <span class="display-1">
          {{ actualWord.q }}
        </span>
      </v-col>
      <v-col></v-col>
      <v-col>
        <v-btn
          @click="help()"
          :loading="loadingHelp"
          :disabled="loadingHelp"
          color="gray"
        >
          Help
        </v-btn>

        <v-btn icon color="gray" @click="$router.push('/settings')">
          <v-icon>settings</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="actualWord">
      <v-col width="100%">
        <v-text-field
          width="100%"
          solo
          v-model="enteredWord"
          ref="inputField"
          @keydown.enter="check()"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col mb-4>
        <v-btn
          xs6
          color="warning"
          @click="selectNextWord()"
          :loading="loadingNext"
          :disabled="loadingNext"
          >Next</v-btn
        >
      </v-col>
      <v-col mb-2> </v-col>
      <v-col mb-6>
        <v-btn
          v-if="checkState == 'NA'"
          mb-12
          large
          color="primary"
          @click="check()"
        >
          Check
        </v-btn>
        <v-btn
          v-if="checkState == 'OK'"
          mb-12
          large
          color="success"
          @click="check()"
          >Check
          <v-icon dark right>mdi-checkbox-marked-circle</v-icon>
        </v-btn>
        <v-btn
          v-if="checkState == 'FAIL'"
          mb-12
          large
          color="error"
          @click="check()"
          >Check
          <v-icon dark right>mdi-minus-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Tester",
  computed: {
    ...mapGetters(["actualWord", "words"]),
  },
  data: () => ({
    enteredWord: undefined,
    checkState: "NA",
    loadingNext: false,
    loadingCheck: false,
    loadingHelp: false,
  }),
  methods: {
    help() {
      this.loadingHelp = true;
      this.enteredWord = this.actualWord.a;
      setTimeout(() => {
        this.enteredWord = "";
        this.loadingHelp = false;
      }, 3000);
    },
    check() {
      if (this.enteredWord.toLowerCase() == this.actualWord.a.toLowerCase()) {
        this.checkState = "OK";
        this.$store.dispatch("updateStatsNextTry", this.checkState);
        this.selectNextWord();
      } else {
        this.checkState = "FAIL";
        this.$store.dispatch("updateStatsNextTry", this.checkState);
        setTimeout(() => {
          this.checkState = "NA";
        }, 2000);
      }
    },
    selectNextWord() {
      this.loadingNext = true;
      setTimeout(() => {
        this.$store.dispatch("selectNextActualWord");
        this.checkState = "NA";
        this.enteredWord = "";
        this.$nextTick(() => this.$refs.inputField.focus());
        this.loadingNext = false;
      }, 700);
    },
  },
  mounted() {
    this.selectNextWord();
  },
};
</script>
