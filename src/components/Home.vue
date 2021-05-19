<template>
  <div>
  <h2>home</h2> 
  <el-button type="info" @click="logout">退出</el-button>
  </div>
  <router-view />
</template>

<script>
export default {
  name:'home',
    data(){
        return{
          
        }
    },
  methods:{
    logout(){
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
}
</script>

<style>

</style>