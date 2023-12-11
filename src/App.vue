<template>
  <v-app>
    <topHeader></topHeader>
    <v-main class="main">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
/* eslint-disable */
import TopHeader from "@/components/Topheader.vue";

import Crypto from "@/components/Crypto.vue";
import WelcomePage from "@/components/WelcomePage.vue";
export default {
  name: 'App',
  components: {WelcomePage, TopHeader},
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400&display=swap');
*{
  font-family: 'Vazirmatn', sans-serif;
}
.theme--dark.v-application{
  background-color: #202323 !important;
}
.main{
  direction: rtl;
}

</style>
