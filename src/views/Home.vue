<template>
  <v-app>
      <v-card  class="login">

        <v-card-title class="title font-weight-regular justify-space-between">
          <span>{{ currentTitle }}</span>
        </v-card-title>

        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-alert border="bottom" color="primary" dark v-if="alert === true" >
                {{ alertMsg }}
              </v-alert>
              <v-text-field outlined label="Email" v-model="signIn.email"></v-text-field>
              <v-text-field outlined label="Password" type="password" v-model="signIn.password"></v-text-field>
              <v-btn color="primary" block @click="login()">Login</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-alert border="bottom" color="primary" dark v-if="alert === true" >
                {{ alertMsg }}
              </v-alert>
              <div class="form-group">
                <v-text-field outlined label="Name" v-model="signUp.name"></v-text-field>
                <v-text-field outlined label="Last Name" v-model="signUp.lastName"></v-text-field>
              </div>
              <v-text-field outlined label="Email" v-model="signUp.email"></v-text-field>
              <div class="form-group">
                <v-text-field outlined label="Password" type="password" v-model="signUp.password"></v-text-field>
                <v-text-field outlined label="Confirm Password" type="password" v-model="signUp.confirm"></v-text-field>
              </div>
              <v-btn color="primary" block @click="Register()">Sign-Up</v-btn>
            </v-card-text>
          </v-window-item>

        </v-window>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" @click="step = 1"> Sign-In</v-btn>
          <v-spacer></v-spacer>
          <v-btn  color="primary" @click="step = 2"> Sign-Up</v-btn>
        </v-card-actions>
      </v-card>
  </v-app>
</template>

<style scoped>
  .border{
    border: 1px solid red;
  }
  .login{
    height: 100vh;
    display: grid;
    padding: 20px;
    background: url('../assets/fondo2.svg') no-repeat top;
    background-size: cover;
  }
  .form-group{
    display: grid;
    grid-template-columns: repeat(2,1fr);
    gap: 10px;
  }
</style>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'App',

  data: () => ({
    step: 1,
    alert: false,
    alertMsg: '',
    signUp: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
    },
    signIn: {
      email: '',
      password: ''
    }
  }),
  computed: {
    currentTitle () {
      switch (this.step){
        case 1: return 'Sign-In'
        case 2: return 'Sign-Up'
      }
    },
    ...mapState(['token'])
  },
  watch: {
    alert: function() {
      setTimeout(()=>{
        this.alert = false;
      },2000)
    }
  },
  beforeCreate() {
    let token = localStorage.getItem('token');
    if(token){
      this.$router.push('/dashboard')
    }
  },
  methods: {
    ...mapMutations(['asigToken']),
    validateFields(number){
      if(number === 1){
        let email = this.signIn.email.replace(/ /g, "");
        let password = this.signIn.password.replace(/ /g, "");
        if(!email || !password){
          return false
        }else{
          return true
        }
      }else{
        let name = this.signUp.name.replace(/ /g, "");
        let lastName = this.signUp.lastName.replace(/ /g, "");
        let email = this.signUp.email.replace(/ /g, "");
        let password = this.signUp.password.replace(/ /g, "");
        let confirm = this.signUp.confirm.replace(/ /g, "");
        if(!name || !lastName || !email || !password || !confirm){
          return false
        }else{
          return true
        }
      }
    },
    login(){
      let validate = this.validateFields(1);
      if(validate === false){
        this.alert = true;
        this. alertMsg = 'All fields are required';
        this.emptyFields(1);
      }else{
        let re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        if(!re.exec(this.signIn.email)){
          this.alert = true;
          this. alertMsg = 'Please enter a valid email';
          this.emptyFields(1);
        }else{
          this.axios.post('/signin', this.signIn)
            .then(res => {
              localStorage.token = res.data.token;
              //this.asigToken(res.data.token);
              this.emptyFields(1)
              this.$router.push('/dashboard')
            })
            .catch(err => {
              this.alert = true;
              this.alertMsg = err.response.data.msg;
              this.emptyFields(1)
            })
        }
      }
    },
    Register(){
      let validate = this.validateFields(2);
      if(validate === false){
        this.alert = true;
        this. alertMsg = 'All fields are required';
        this.emptyFields(2);
      }else{
        if(this.signUp.password != this.signUp.confirm){
          this.alert = true;
          this. alertMsg = 'Passwords do not match';
          this.emptyFields(2);
        }else{
          let re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
          if(!re.exec(this.signUp.email)){
            this.alert = true;
            this. alertMsg = 'Please enter a valid email';
            this.emptyFields(2);
          }else{
            this.axios.post('/signup', this.signUp)
              .then(res => {
                this.alert = true;
                this.alertMsg = res.data.msg;
                this.emptyFields(2)
              })
              .catch(err => {
                console.log(err.response)
              })
          }
        }
      }
    },
    emptyFields(number){
      if(number === 1){
        this.signIn.email = '';
        this.signIn.password = '';
      }else{
        this.signUp.email = '';
        this.signUp.name = '';
        this.signUp.lastName = '';
        this.signUp.password = '';
        this.signUp.confirm = '';
      }
    }
  },
};
</script>
