<template>
    <v-container>
        <v-row no-gutters>
            <v-col >
                <span class="display-1" v-if="actualQuestion">
                    {{actualQuestion.q}}
                </span>
            </v-col>
            <v-col></v-col>
            <v-col >
                <v-btn 
                    @click="help()"
                    :loading="loadingHelp"
                    :disabled="loadingHelp"
                    color="gray"> 
                    Help
                </v-btn>
            
                <v-btn 
                    icon 
                    color="gray"
                    @click="$router.push('/settings')"
                >
              <v-icon>settings</v-icon>
            </v-btn>
            </v-col>
        </v-row>
        <v-row no-gutters v-if="actualQuestion">
            <v-col width="100%">
                <v-text-field width="100%"
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
                <v-btn xs6 color="warning" 
                    @click="selectNextQuestion()"
                    :loading="loadingNext"
                    :disabled="loadingNext"
                >Next</v-btn>
            </v-col>
            <v-col mb-2>
                
            </v-col>
            <v-col mb-6>
                <v-btn v-if="checkState=='NA'" mb-12 large color="primary" @click="check()" >
                    Check
                </v-btn>
                <v-btn v-if="checkState=='OK'" mb-12 large color="success" @click="check()" >Check
                    <v-icon dark right>mdi-checkbox-marked-circle</v-icon>
                </v-btn>
                <v-btn v-if="checkState=='FAIL'" mb-12 large color="error" @click="check()" >Check
                    <v-icon dark right>mdi-minus-circle</v-icon>
                </v-btn>
            </v-col>
        </v-row>        
    </v-container>
</template>

<script>
 
  import { mapGetters } from 'vuex'
  export default {
    name: 'Tester',
    computed: {
        ...mapGetters([
            "actualQuestion",
            "actualLesson"
        ])
    },
    data: () => ({
        enteredWord: undefined,
        checkState: "NA",
        loadingNext: false,
        loadingCheck: false,
        loadingHelp: false
    }),
    methods:{
        help(){
            this.loadingHelp=true
            this.enteredWord=this.actualQuestion.a
            setTimeout(()=>{
                this.enteredWord=""
                this.loadingHelp=false
            },3000)
            
        },
        check(){
            if(this.enteredWord.toLowerCase() == this.actualQuestion.a.toLowerCase()){
                this.checkState = "OK"
                this.$store.dispatch("updateStatsNextTry",this.checkState)
                this.selectNextQuestion()
            } else {
                this.checkState = "FAIL"
                this.$store.dispatch("updateStatsNextTry",this.checkState)
                setTimeout(()=>{
                    this.checkState="NA"
                },2000)
            }
        },
        selectNextQuestion(){
            this.loadingNext=true
            setTimeout(()=>{
                this.$store.dispatch("selectNextActualQuestion")
                this.checkState = "NA"
                this.enteredWord=""
                this.$nextTick(() => this.$refs.inputField.focus())
                this.loadingNext=false;
            },700)
        }
    },
    mounted(){
        if(!this.actualLesson){
            this.$router.push("/settings")
        } else {
            this.selectNextQuestion()
        }
    }
  }
</script>
