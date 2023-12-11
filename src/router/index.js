import Vue from 'vue'
import VueRouter from 'vue-router'
import cryptoPage from '@/views/CryptoPage.vue'
import Forex from "@/views/Forex.vue";
import welcomePage from "@/components/WelcomePage.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/calc'
  },
  {
    path: '/calc',
    name: 'MainPage',
    component: welcomePage
  },
  {
    path: '/cryptoPage',
    name: 'cryptoPage',
    component: cryptoPage
  },{
    path: '/forex',
    name: 'forex',
    component: Forex
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
