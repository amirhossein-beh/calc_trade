<template>
  <div class="d-flex justify-center align-center" style="width: 100%; height: 100%;">
    <div class="lines">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <div color="secondary" id="card" class="glass-Effect2 px-16 py-10">
    <v-card-text class="text-center pt-0 pb-2 text-h6" style="font-family: 'Vazirmatn', sans-serif !important">آکادمی دکتر سامان کریمی شاد</v-card-text>
      <v-card-subtitle class="text-caption text-center pb-10 text-h6" style="font-family: 'Vazirmatn', sans-serif !important;direction: ltr">! با مدیریت سرمایه همیشه سود کنید </v-card-subtitle>
    <div class="d-flex justify-center btns">
      <v-btn class="ma-2" rounded color="primary"><router-link style="color: #eeeeee; font-family: 'Vazirmatn', sans-serif !important" class="text-decoration-none" to="/cryptoPage">رمز ارز دیجیتال</router-link></v-btn>
      <v-btn class="ma-2" rounded color="primary"><router-link style="color: #eeeeee; font-family: 'Vazirmatn', sans-serif !important" class="text-decoration-none" to="/forex">بازار سهام بین المللی_فارکس</router-link></v-btn>
    </div>
  </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {

  name: "WelcomePage"
}
</script>

<style lang="sass">
*
  margin: 0
  padding: 0
  box-sizing: border-box !important
  font-family: 'Vazirmatn', sans-serif !important

html, body
  height: 100%

body
  display: table
  width: 100%
  height: 100%
  background-color: #171717
  color: #000
  line-height: 1.6
  position: relative
  font-family: sans-serif
  overflow: hidden

.lines
  position: absolute
  top: 0
  left: 0
  right: 0
  height: 100%
  margin: auto
  width: 90vw

.line
  position: absolute
  width: 1px
  height: 100%
  top: 0
  left: 50%
  background: rgba(255, 255, 255, 0.1)
  overflow: hidden

  &::after
    content: ''
    display: block
    position: absolute
    height: 15vh
    width: 100%
    top: -50%
    left: 0
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #ffffff 75%, #ffffff 100%)
    animation: drop 5s 0s infinite
    animation-fill-mode: forwards
    animation-timing-function: ease-out

  &:nth-child(1)
    margin-left: -25%
    &::after
      animation-delay: 2s

  &:nth-child(3)
    margin-left: 25%
    &::after
      animation-delay: 2.5s


@keyframes drop
  0%
    top: -50%
  100%
    top: 110%
</style>
<style>
.glass-Effect2{
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

}


@media (max-width: 428px) {
#card{

  padding: 20px 10px !important;
  max-width: 300px;
}

#card .btns{
  display: flex;
  flex-wrap: wrap !important;
}


}
/* اندازه کارت در حالت بزرگتر از xs */
@media (min-width: 601px) {

}

  


</style>