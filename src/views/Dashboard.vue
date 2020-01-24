<template>
    <div>
        <h1>hola</h1>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            //
        }
    },
    computed: {
        ...mapState(['token'])
    },
    beforeCreate() {
        let token = localStorage.getItem('token')
        let config = {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        }
        if(!token){
            this.$router.push('/')
        }else{
            this.axios.get('/dashboard', config)
            .then(res => {
                    console.log(res.data)
            })
            .catch(err => {
                    console.log(err.response)
             })
        }
    },
}
</script>