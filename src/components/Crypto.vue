<template>
  <v-container class="container" >
    <div class="cards">
      <div>
        <v-col>
          <v-card style="height: 100%;" class="my-3 px-5" color="secondary" elevation="10">
            <v-row class="align-center">
              <v-col cols="4"><span>نماد</span></v-col>
              <v-col cols="8">
                <v-autocomplete
                    clearable
                    hide-details
                    :v-model="ValueSymbol"
                    :items="items"
                    :loading="isLoading"
                    :search-input.sync="search">
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="align-center">
              <v-col cols="4"> <span style="font-size: 14px">سرمایه کل</span></v-col>
              <v-col cols="8" class="pb-0">
                <v-text-field color="primary"
                              single-line
                              append-icon="mdi-currency-usd"
                              class="pa-0 ma-0"
                              :rules = "rules"
                              v-model="totalCapital"
                ></v-text-field></v-col>
            </v-row>
            <v-row class="align-center">
              <v-col cols="4"><span style="font-size: 14px">درصد ریسک</span></v-col>
              <v-col cols="8">
                <v-text-field color="primary"
                              single-line
                              append-icon="mdi-percent-box-outline"
                              class="pa-0 ma-0"
                              :rules = "rules"
                              v-model="risk"
                ></v-text-field></v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="my-3 px-5 bg-icon" color="secondary" elevation="10">
          <v-row class="align-center">
            <v-col cols="3">
              <span style="font-size: 14px">نوع معامله</span>
            </v-col>
            <v-col cols="9">
              <v-bottom-navigation
                  id="nav"
                  style="box-shadow: none"
                  background-color="#2e2e2e00"
                  class="align-center"
                  value="value">
                <v-btn  active-class="primary"
                        style="font-size: 14px ; font-weight: bold ; border-radius: 10px"
                        class="mx-2"
                        width="45%"
                        height="30px"
                        @click="handleLongButtonClick"
                >Long</v-btn>
                <v-btn active-class="error"
                       style="font-size: 14px ; font-weight: bold; border-radius: 10px"
                       small
                       width="45%"
                       height="30px"
                       @click="handleShortButtonClick"
                >Short</v-btn>
              </v-bottom-navigation>
            </v-col>
          </v-row>
          <v-row class="align-center">
            <v-col class="pr-0" cols="3"><span style="font-size: 14px">اهرم</span></v-col>
            <v-col class="pl-0" cols="9">
              <v-slider
                  v-model="leverage"
                  class="align-center"
                  color="primary"
                  :max="max"
                  :min="min"
                  hide-details
              >
                <template v-slot:append>
                  <v-text-field
                      v-model="leverage"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 43px"
                  ></v-text-field>
                </template>
              </v-slider></v-col>
          </v-row>
          <v-row class="align-baseline">
            <v-col cols="3"><span style="font-size: 14px">قیمت ورود</span></v-col>
            <v-col cols="9"><v-text-field
                style="border: 1px solid rgba(103,103,103,0.55)"
                v-model="entry"
                hide-details
                height="30"
                prepend-inner-icon="mdi-currency-usd"
                :rules="rules"
                type="number"
            ></v-text-field></v-col>
          </v-row>
          <v-row class="align-baseline">
            <v-col cols="3"><span style="font-size: 14px">حد ضرر</span></v-col>
            <v-col cols="9"><v-text-field
                style="border: 1px solid rgba(103,103,103,0.55)"
                v-model="stop"
                hide-details height="30"
                prepend-inner-icon="mdi-currency-usd"
                :rules="rules"
                type="number"
            ></v-text-field></v-col>
          </v-row>
          <v-row class="align-baseline">
            <v-col cols="3"><span style="font-size: 14px">حد سود</span></v-col>
            <v-col cols="9"><v-text-field
                style="border: 1px solid rgba(103,103,103,0.55)"
                v-model="exit"
                hide-details height="30"
                prepend-inner-icon="mdi-currency-usd"
                :rules="rules"
                type="number"
            ></v-text-field></v-col>
          </v-row>
        </v-card>
        </v-col>
      </div>
      <div>
        <v-col>
          <v-card style="position: relative;height: 100%;" color="secondary" elevation="10">
          <div  :class="{'glass-Effect-Long' : ShortValue }"></div>
          <div :class="{'glass-Effect-Short' : LongValue}"></div>
          <div id="card-result">
            <v-row>
              <v-col ><span style="font-size: 14px">زیان </span></v-col>
              <v-col class="d-flex justify-end"><span>{{ riskedCapital }}</span></v-col>
            </v-row>
            <v-row>
              <v-col><span style="font-size: 14px">مارجین</span></v-col>
              <v-col class="d-flex justify-end" :class="isMargin"><span>{{ margin }}</span></v-col>
            </v-row>
            <v-row>
              <v-col><span style="font-size: 14px">حجم معامله</span></v-col>
              <v-col class="d-flex justify-end"><span :class="positionSize > 0 ? 'position' : '' ">{{ positionSize }}</span></v-col>
            </v-row>
            <!--            <v-row>-->
            <!--              <v-col><span style="font-size: 14px">نقطه لیکوییدی</span></v-col>-->
            <!--              <v-col class="d-flex justify-end"><span >{{ '-' }}</span></v-col>-->
            <!--            </v-row>-->
            <v-row>
              <v-col><span style="font-size: 14px">ریسک ، ریوارد</span></v-col>
              <v-col class="d-flex justify-end"><span :class="RiskRewardValue">{{ riskReward }}</span></v-col>
            </v-row>
            <v-row>
              <v-col><span style="font-size: 14px">سود و زیان Pnl</span></v-col>
              <v-col class="d-flex justify-end"><span :class="PnlValue">{{ pnl }}</span></v-col>
            </v-row>
            <v-row>
              <v-col><span style="font-size: 14px">بازدهی (ROE)</span></v-col>
              <v-col class="d-flex justify-end"><span :class="RoeValue">{{ Roe }}</span></v-col>
            </v-row>
          </div>
        </v-card>
        </v-col>
      </div>
    </div>

  </v-container>
</template>

<script>
import axios from "axios";
export default {
  /* eslint-disable */
  name: 'Crypto',
  data () {
    return {
      /**** **** **** **** **** **** ***** **** **** **** ***** ***** */
      //اطلاعات فرم اول شامل نماد ، سرمایه کل ، درصد ریسک
      totalCapital:"1000",
      risk:'1',
      search: null,
      isLoading: false,
      DataApi: [],
      ValueSymbol: null,
      items: [],
      /** **** ***** ***** ***** **** **** ****/
      //اطلاعات فرم دوم شامل نوع معامله، اهرم ، قیمت ورود ، حد ضرر ، حد سود
      type: "Long",
      leverage:'10',
      entry: null,
      stop: null,
      exit: null,
      value: 1,
      min: 1,
      max: 100,
      rules: [v => !!v || 'This field is required',
        v => /^\d+(\.\d+)?$/.test(v)||'This field only accept numbers'],
      /***** ****** ******* ****** ****** ******* */
      LongValue : null,
      ShortValue : null,
      RiskRewardValue: null,
      PnlValue: null,
      RoeValue: null,
      volumeTrading:null,
      isMargin: null,
      /***** ****** *********** ******* ******** ** **/

    }
  },
  watch:{
    entry(){this.changeClass()},
    stop(){this.changeClass()},
    exit(){this.changeClass()},
    leverage(){this.changeClass()},
    type(){this.changeClass()},
    totalCapital(){this.changeClass()},
    search() {
      // Items have already been loaded
      if (this.items.length > 0) return
      this.isLoading = true
      // Lazily load input items
      axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
          .then(res => {
            res.data.forEach(element =>{
              this.DataApi.push(element)
              this.items.push(element.symbol.toUpperCase())
            })
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
    },
    positionSize(){
      if (this.positionSize < 0) {
        if (this.type === 'Long') {
          this.ShortValue = true;
          this.LongValue = false;
        } else if (this.type === 'Short') {
          this.ShortValue = false;
          this.LongValue = true;
        }
      } else {
        this.ShortValue = false;
        this.LongValue = false;
      }
    }

  },
  computed:{
    riskedCapital (){
      let result = this.totalCapital * (this.risk / 100) ;
      return "$" + result.toFixed(2);
    },
    positionSize() {
      if (this.entry && this.stop) {
        if (this.type === "Long") {
          let result = (this.riskedCapital.split('$')[1] / (this.entry - this.stop))
          return result.toFixed(6);
        }
        else if (this.type === "Short"){
          let result = (this.riskedCapital.split('$')[1] / (this.stop - this.entry))
          return result.toFixed(6);

        }
      }
      else return "-"
    },
    margin (){
      if ((this.positionSize > 0) &&( this.entry > 0 )) {
        let result = (this.positionSize * this.entry) / this.leverage
        return "$" + result.toFixed(2);
      }
      else return "-"
    },
    pnl() {
      if (this.entry && this.exit) {
        if (this.type === "Long") {
          let result = this.positionSize * (this.exit - this.entry)
          return "$" + result.toFixed(2);
        }
        else if (this.type === "Short"){
          let result = this.positionSize * (this.entry - this.exit)
          return "$" + result.toFixed(2);
        }
      }
      else return "-"
    },
    riskReward (){
      if (this.entry){
        if (this.stop) {
          if (this.exit) {
            let result = this.pnl.split('$')[1] / this.riskedCapital.split('$')[1]
            return result.toFixed(2);
          }
          else return "-"
        }
        else return "-"
      }
      else return "-"
    },
    Roe (){
      if ((this.pnl.split('$')[1] > 0) && ( this.margin.split('$')[1] > 0 )) {
        let result = (this.pnl.split('$')[1] / this.margin.split('$')[1]) * 100
        return result.toFixed(2) + "%";
      }
      else return "-"
    },

    // LiquidationValue() {
    //   if (this.entry) {
    //     let percentage = (100 / this.leverage).toFixed(2) / 100;
    //     let result;
    //     if (this.type === 'Long') {
    //       result = this.entry * percentage + 1;
    //     } else if (this.type === 'Short') {
    //       result = this.entry - this.entry * percentage + 1;
    //     }
    //     return this.entry - result;
    //   } else {
    //     return '-';
    //   }
    // }
  },
  methods: {
    changeClass () {
      if (this.riskReward > 0){
        this.RiskRewardValue = 'reward'
      }
      else if (this.riskReward < 0){
        this.riskrewardvalue = 'risk'
      }
      else this.RiskRewardValue = 'empty'

      if (this.pnl.split('$')[1] > 0){
        this.PnlValue = 'reward'
      }
      else if (this.pnl.split('$')[1] < 0){
        this.PnlValue = 'risk'
      }
      else this.PnlValue = 'empty'

      if (this.Roe.split('%')[0] > 0){
        this.RoeValue = 'reward'
      }
      else if (this.Roe.split('%')[0] < 0){
        this.RoeValue = 'risk'
      }
      else this.RoeValue = 'empty'

      if (parseInt(this.margin.split('$')[1]) > parseInt(this.totalCapital)) {
        this.isMargin = 'risk'
      }else {
        this.isMargin = 'empty' }

    },
    handleLongButtonClick() {
      this.type = "Long";
    },
    handleShortButtonClick() {
      this.type = "Short";
    }
  }

}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400&display=swap');

.container{
  font-family: 'Vazirmatn', sans-serif;
}
.cards{
   display: grid;
  grid-template-columns: 1fr 1fr;
}
@media screen and (max-width: 960px) {
  .cards{
    grid-template-columns: 1fr;
  }

}
.theme--light.v-card {
  color: #FFFFFF !important;
}
.theme--light.v-icon{
  color: rgba(238, 238, 238, 0.88) !important;
}
.theme--light.v-input, .theme--light.v-input input, .theme--light.v-input textarea{
  color: #eeeeee !important;
}
.theme--light.v-text-field>.v-input__control>.v-input__slot:before {
  border-color: rgb(255 255 255 / 42%) !important;
}
#nav .v-btn--active{
  color: white;
}
#card-result{
  padding: 1rem;
}

.glass-Effect-Long {
  /* From https://css.glass */
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.glass-Effect-Long:before{
  content: 'حد ضرر بالاتر از نقطه ورود است';
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #ff4b4b;
}
.glass-Effect-Short {
  /* From https://css.glass */
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.glass-Effect-Short:before{
  content: 'حد ضرر پایین تر از نقطه ورود است';
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #ff4b4b;
}


.bg-icon .v-icon.v-icon {
  background-color: rgb(83, 91, 91 , 0.2);
  font-size: 20px !important;
  padding: 5px 3px 5px 3px;
}
.v-text-field{
  padding-top: 0 !important;
}
.position{
  background-color: #eee;
  border-radius: 5px;
  color: #2C3333;
  padding: 2px 10px;
}
.reward{
  color: #16cdd2;
}
.risk{
  color: #fd5151;
}
.empty{
  color: #eeeeee;
}

</style>