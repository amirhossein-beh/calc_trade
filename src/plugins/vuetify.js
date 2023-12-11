import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      options: {
        customProperties: true,
      },
    dark:true,
    themes: {
      dark: {
        primary: '#0E8388',
        background : '#2C3333',
        secondary: '#242c2c',
        accent: '#CBE4DE',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        text: '#eee'
      },
      // light: {
      //   primary: '#96eefc',
      //   background : '#FEDEFF',
      //   secondary: '#195881',
      //   accent: '#0f1c00',
      //   error: '#FF5252',
      //   info: '#2196F3',
      //   success: '#008107',
      //   warning: '#FFC107',
      //   text: '#000'
      // },
    },
  },

});
