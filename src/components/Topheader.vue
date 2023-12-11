<template>
  <v-app-bar class="header" app dark >
    <!--      در تگ img در قسمت src آدرس لگوی خود را قرار دهید .-->
    <v-avatar size="35"><img src="logo.png"></v-avatar>
    <v-card-text>آکادمی سامان کریمی شاد</v-card-text>
    <v-spacer></v-spacer>
    <v-app-bar-nav-icon color="primary" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-navigation-drawer
        class="glass-Effect"
        v-model="drawer"
        absolute
        app
        right
        temporary>
      <v-list dense nav>
        <v-list-item
            v-for="item in items"
            :key="item.title"
            active-class="primary"
            link
            :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>

        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <span class="text-caption">
            Created by { <v-icon size="14">mdi-instagram</v-icon> amirhossein_beh }
          </span>
        </div>
      </template>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script>
  export default {
    /* eslint-disable */
    name: 'TopHeader',
    data() {
      return {
        darkMode: true,
        drawer: false,
        group: null,
        items:[
          { title: 'خانه', icon: 'mdi-home',path:'/calc' },
          { title: 'رمز ارز های دیجیتال', icon: 'mdi-bitcoin',path:'/cryptoPage' },
          { title: 'بازار سهام بین المللی - فارکس', icon: 'mdi-currency-eur',path:'/forex' }],
      };
    },
    watch: {
      group () {
        this.drawer = false
      },
    },

  }
</script>
<style>
.v-theme--light .text--primary {
  color: #FFFFFF;
}
</style>

<style>
.glass-Effect {
  background: rgba(255, 255, 255, 0.08) !important;
  border-radius: 4px !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
}
</style>
