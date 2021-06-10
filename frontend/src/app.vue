<template>
    <div id="app" class="main-layout flex f-col" :style="appStyle">
        <main-header :loggedinUser="loggedinUser" @logout="logout" />
        <div class="main-content flex f-col">
            <router-view />
        </div>
    </div>
</template>

<script>
import mainHeader from './cmps/main-header.cmp';
import { socketService } from './services/socket.service';
const Swal = require('sweetalert2');

export default {
    computed: {
        loggedinUser() {
            return this.$store.getters.loggedinUser;
        },
        appStyle() {
            const page = this.$route.name;
            const isHome = (page === 'home' || page === 'login' || page === 'signup');
            return { 'background': (isHome) ? '#eeeeee' : this.$store.getters.bgc };

        }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
        },
        userMsg(data) {
            if (!data.members.includes(this.$store.getters.loggedinUser._id)) return;
            Swal.fire({
                position: 'bottom-end',
                title: data.msg,
                showConfirmButton: false,
                timer: 2500
            });
        }
    },
    created() {
        socketService.setup();
        this.$store.dispatch('loadBoards');
        this.$store.dispatch('loadUsers');
        socketService.on('user-msg', (data) => this.userMsg(data));
        setTimeout(() => {
            window.FB.getLoginStatus(function (response) {
                console.dir(response);
            });
        }, 0)
    },
    destroyed() {
        socketService.terminate();
    },
    components: {
        mainHeader
    }
};

</script>