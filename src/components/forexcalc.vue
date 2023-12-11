<template>
  <div>
    <v-row>
      <v-col xs="12" sm="12" md="8">

        <v-card class="px-10 py-6" color="secondary" elevation="10" >
          <v-row class="d-flex justify-space-between my-5">
            <span>جفت ارز:</span>
            <div>
              <v-autocomplete
                  v-model=select
                  :loading=loading
                  :items=items
                  :search-input.sync=search
                  dense
                  outlined
                  clearable
                  hide-details
                  hide-selected></v-autocomplete>
            </div>
          </v-row>
          <v-row class="d-flex justify-space-between my-5">
            <span>ارز حساب:</span>
            <div>
              <v-autocomplete
                  v-model=valueCurrency
                  :items=filteredItemsCurrency
                  dense
                  outlined
                  clearable
                  hide-details
                  hide-selected
              ></v-autocomplete>
            </div>
          </v-row>
          <v-row class="d-flex justify-space-between">
            <span>اندازه حساب:</span>
            <div><v-text-field
                v-model=accountSize
                :rules=rules
                dense
                outlined>
            </v-text-field></div>
          </v-row>
          <v-row class="d-flex justify-space-between">
            <span>نسبت ریسک, %:</span>
            <div ><v-text-field v-model=RiskPerTrade :rules=rules dense outlined></v-text-field></div>
          </v-row>
          <v-row class="d-flex justify-space-between">
            <span>حد ضرر, Pips:</span>
            <div>
              <v-text-field
                  v-model=StopLoss
                  :rules=rules
                  dense
                  outlined>
              </v-text-field>
            </div>
          </v-row>
          <v-row class="d-flex justify-space-between">
            <span>اندازه معامله(Lots):</span>
            <div><v-text-field v-model= TradeSize :rules=rules dense outlined></v-text-field></div>
          </v-row>
          <v-row class="d-flex justify-end mb-4 mr-2">
            <v-btn @click="calculatePositionSize"
                   :loading="loading5"
                   :disabled="loading5"
                   class="px-8 py-4"
                   color="primary">محاسبه</v-btn>
          </v-row>
        </v-card>

      </v-col>
      <v-col xs="12" sm="12" md="4" >
        <v-card class="px-10 py-6" elevation="10" color="secondary">
          <v-row class="my-2 d-flex justify-space-between">
            <span>زیان, {{ valueCurrency }}:</span>
            <v-card-title class="pa-0">{{ RiskPercentage }}</v-card-title>
          </v-row>
          <v-row class="my-4 d-flex justify-space-between">
            <span> واحد ها(Units):</span>
            <v-card-title class="pa-0">{{ ShowUnits }}</v-card-title>
          </v-row>
          <v-row class="my-2 d-flex justify-space-between">
            <span>Sizing:</span>
            <v-card-title class="pa-0">{{ (Sizing)? `${Sizing}lots`: ""  }}</v-card-title>
          </v-row>
        </v-card>

      </v-col>
    </v-row>

  </div>

</template>

<script>
export default {
  /* eslint-disable */
  name: "forex-calc",
  data: () => ({
    /*متغییر های ورودی*/
    items: [
      'AUDCAD', 'AUDCHF', 'AUDJPY', 'AUDNZD', 'AUDSGD',
      'AUDUSD', 'CADCHF', 'CADJPY', 'CHFJPY', 'CHFSGD',
      'EURAUD', 'EURCAD', 'EURCHF', 'EURCZK', 'EURGBP',
      'EURHUF', 'EURJPY', 'EURMXN', 'EURNOK', 'EURNZD',
      'EURPLN', 'EURSEK', 'EURSGD', 'EURTRY', 'EURUSD',
      'EURZAR', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'GBPJPY',
      'GBPMXN', 'GBPNOK', 'GBPNZD', 'GBPSEK', 'GBPSGD',
      'GBPTRY', 'GBPUSD', 'NOKJPY', 'NOKSEK', 'NZDCAD',
      'NZDCHF', 'NZDJPY', 'NZDUSD', 'SEKJPY', 'SGDJPY',
      'USDCAD', 'USDCHF', 'USDCNH', 'USDCZK', 'USDHUF',
      'USDJPY', 'USDMXN', 'USDNOK', 'USDPLN', 'USDRUB',
      'USDSEK', 'USDSGD', 'USDTHB', 'USDTRY', 'USDZAR',
      'XAGAUD', 'XAGEUR', 'XAGUSD', 'XAUAUD', 'XAUCHF',
      'XAUEUR', 'XAUGBP', 'XAUJPY', 'XAUUSD', 'XPDUSD',
      'XPTUSD', 'ZARJPY'],
    itemsCurrency: ['USD', 'EUR', 'JPY', 'AUD', 'CAD', 'CHF', 'GBP', 'NZD', 'ZAR'],
    valueCurrency: 'USD',
    search: null,
    select: null,
    loading: false,
    rules: [v => !!v || 'این فیلد الزامی است',
      v => /^\d+(,\d{3})*(\.\d+)?$/.test(v) || 'این فیلد فقط اعداد را می پذیرد'],
    accountSize: null,
    RiskPerTrade: null,
    StopLoss: null,
    loading5: false,
    loader: null,
    TradeSize: 1,
    pipValue:null,

    /*----------------*/
    /*متغییر های خروجی*/
    RiskPercentage: null,
    units: null,
    ShowUnits : null,
    Sizing: null,
    exr: null,
    /*----------------*/
  }),
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]
      setTimeout(() => (this[l] = false), 3000)
      this.loader = null
    },

  },
  methods: {
    async calculatePositionSize() {
      this.loader = 'loading5';

      this.RiskPercentage = (this.accountSize * this.RiskPerTrade )/ 100;

      this.exr = await this.getExchangeRate(this.valueCurrency, this.select.substr(3, 6));
      if (this.select.substr(3,6) === "AUD"){
        if (this.valueCurrency === "EUR" || this.valueCurrency === "GBP" || this.valueCurrency === "AUD") {
          this.pipValue = (this.RiskPercentage * this.exr) / this.StopLoss;
        }
        else if (this.valueCurrency === "CAD" || this.valueCurrency === "CHF" || this.valueCurrency === "USD" || this.valueCurrency === "JPY" || this.valueCurrency === "CHF" || this.valueCurrency === "NZD" || this.valueCurrency === "ZAR"){
          this.pipValue = (this.RiskPercentage / this.exr) / this.StopLoss;
        }
      }

      else if (this.select.substr(3,6) === "CAD"){

        if (this.valueCurrency === "EUR" || this.valueCurrency === "GBP" || this.valueCurrency === "NZD" || this.valueCurrency === "USD" || this.valueCurrency === "AUD") {

          this.pipValue = (this.RiskPercentage * this.exr) / this.StopLoss;
        }
        else if (this.valueCurrency === "CHF" || this.valueCurrency === "JPY"){
          this.pipValue = (this.RiskPercentage / this.exr) / this.StopLoss;
        }
      }

      else{this.pipValue = (this.RiskPercentage * this.exr) / this.StopLoss;}

      this.units = this.pipValue * ((this.TradeSize * 100000) / await this.getPipValueRatio(this.select));
      this.units = (Math.round(this.units).toFixed(0))

      let formating = this.units
      this.ShowUnits = formating.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

      this.Sizing = this.units / (this.TradeSize * 100000);
      this.Sizing = this.Sizing.toFixed(2)
    },

    async getExchangeRate(base, target) {
      const axios = require('axios');

      try {
        //ارز هایی که بخش دوم آن USD است
        if (this.select.substr(3, 6) === 'USD') {
          if (this.valueCurrency === 'JPY' || this.valueCurrency === 'CHF' || this.valueCurrency === 'CAD') {
            const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
            return response.data.exchange_rates[base];
          } else {
            const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
            return response.data.exchange_rates[target];
          }
        }
        //ارز هایی که بخش اول آن USD است
        if (this.select.substr(0, 3) === "USD") {
          if ((this.select.substr(3, 6) === 'CAD') && (this.valueCurrency === 'CHF' || this.valueCurrency === 'JPY')) {
            const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
            return response.data.exchange_rates[base];
          } else {
            const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
            return response.data.exchange_rates[target];
          }
        }

        //ارز های که USD ندارند
        switch (this.select) {
          case "EURCAD":
            if (this.valueCurrency === 'CHF' || this.valueCurrency === 'JPY') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base];
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "EURGBP":
            if (this.valueCurrency === 'CHF' || this.valueCurrency === 'JPY' || this.valueCurrency === 'AUD' || this.valueCurrency === 'CAD' || this.valueCurrency === 'NZD' || this.valueCurrency === 'USD') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base];
            }
            else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "EURNOK":
            if (this.valueCurrency === 'JPY') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base]
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }
           
          case "EURNZD":
            if (this.valueCurrency === 'JPY' || this.valueCurrency === 'USD' || this.valueCurrency === 'CAD' || this.valueCurrency === 'CHF') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base]
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "GBPAUD":
            if (this.valueCurrency === 'JPY' || this.valueCurrency === 'USD' || this.valueCurrency === 'CAD' || this.valueCurrency === 'CHF' || this.valueCurrency === 'NZD') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base]
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "GBPCAD":
            if (this.valueCurrency === 'JPY' || this.valueCurrency === 'CHF') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base]
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "NZDCAD":
            if (this.valueCurrency === 'JPY' || this.valueCurrency === 'CHF') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base]
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "CHFSGD":
            if (this.valueCurrency === 'JPY') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base]
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "AUDSGD":
            if (this.valueCurrency === 'JPY') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base]
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "EURAUD":
            if (this.valueCurrency === 'CAD' || this.valueCurrency === 'CHF' || this.valueCurrency === 'JPY' || this.valueCurrency === 'NZD' || this.valueCurrency === 'USD') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base]
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "XAUAUD":
            if (this.valueCurrency === 'CAD' || this.valueCurrency === 'CHF' || this.valueCurrency === 'JPY' || this.valueCurrency === 'NZD' || this.valueCurrency === 'USD') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base]
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "AUDCAD":
            if (this.valueCurrency === 'CHF' || this.valueCurrency === 'JPY') {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base]
            } else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }

          case "AUDCHF":
            if (this.valueCurrency !== 'JPY'){
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
              return response.data.exchange_rates[target];
            }else {
              const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
              return response.data.exchange_rates[base];
            }

        }
        if (this.select === 'NOKJPY' || this.select === 'NZDJPY' || this.select === 'SEKJPY' || this.select === 'SGDJPY' || this.select === 'EURJPY' || this.select === 'CHFJPY'){
          const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
          return response.data.exchange_rates[target];

        }
        if (this.select === 'EURHUF' || this.select === 'EURCZK'){
          const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
          return response.data.exchange_rates[target];
        }

        if (this.select === 'EURNOK' || this.select === 'EURSEK' || this.select === 'GBPSEK' || this.select === 'GBPNOK' || this.select === 'EURPLN' || this.select === 'NOKSEK'){
          if (this.valueCurrency !== 'JPY'){
            const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${base}&target=${target}`);
            return response.data.exchange_rates[target];
          }else {
            const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=3a9f43fe39d14862a2a9a5dd471b7143&base=${target}&target=${base}`);
            return response.data.exchange_rates[base];
          }
        }

      } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch exchange rate.');
      }
    },

    async getPipValueRatio(currencyPair) {
      const baseCurrency = currencyPair.substr(0, 3);
      const quoteCurrency = currencyPair.substr(3, 6);

      if (quoteCurrency === 'JPY' || baseCurrency === 'JPY' || baseCurrency === 'XAU' || baseCurrency === 'XAG') {
        let unit = this.TradeSize * 100000
        return  0.01 * unit
      }

      if (baseCurrency !== "JPY") {
        let unit = this.TradeSize * 100000
        return  0.0001 * unit
      }


      return 1;
    },
    // formatInput() {
    //   // حذف کاراکترهای غیر از اعداد و نقطه از مقدار ورودی
    //   let inputValue = this.accountSize.replace(/[^\d.]/g, "");
    //   // تغییر مقدار به شکل سه رقم سه رقم جدا شده
    //   if (inputValue) {
    //     const parts = inputValue.toString().split(".");
    //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //     inputValue = parts.join(".");
    //   }
    //   // قرار دادن مقدار جدید در متغییر x
    //   this.accountSize = inputValue ;
    // },
  },
  computed:{
    filteredItemsCurrency() {
      if (this.select === 'EURNOK' || this.select === 'EURSEK' || this.select === 'NOKSEK'|| this.select === 'GBPSEK'|| this.select === 'GBPNOK'|| this.select === 'EURPLN' ) {
        return ['EUR', 'USD', 'GBP', 'JPY'];
      }

      if (this.select === 'GBPNZD' || this.select === 'EURNZD' || this.select === 'GBPAUD' ) {
        return ['EUR', 'USD', 'GBP', 'JPY' ,'AUD' , 'CHF' , 'CAD' , 'NZD'];
      }

      if (this.select === 'EURHUF' || this.select === 'EURCZK'){
        return ['EUR', 'USD',];
      }
      if (this.select === 'AUDSGD' || this.select === 'CHFSGD' || this.select === 'EURSGD' || this.select === 'GBPSGD' || this.select === 'SGDJPY' || this.select === 'USDSGD'){
        return ['EUR', 'USD', 'AUD' , 'CHF' , 'GBP' , 'JPY'];
      }

      return this.itemsCurrency;
    },

  },
}

</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>