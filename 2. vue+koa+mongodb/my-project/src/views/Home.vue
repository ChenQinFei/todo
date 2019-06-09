<template>
  <div class="home">
      <a @click="handleSignout" href="javascript:void(0)" class="logout">Log Out</a>
      <div id="background" class="background show"></div>
      <div class="background-overlay show"></div>
      <div class="loading-overlay show" id="loading">
          <div class="loading-content">
              <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
              <p>Loading Todos</p>
          </div>
      </div>
      <Todo></Todo>
  </div>
</template>

<script>
    // @ is an alias to /src
    import Todo from "@/components/Todo.vue"

    export default {
        name: "home",
        components: {
            Todo
        },
        methods: {
            'handleSignout': function() {
                this.$axios.get('/signout').then(() => {
                    this.$router.push({ path: '/login' })
                })
            }
        },
    };
</script>
<style>
    .logout {
        color: #fff;
        position: absolute;
        z-index: 5;
        right: 20px;
        top: 20px;
        display: inline-block;
        padding: 5px 15px;
        background-color: #ffffff1c;
        border-radius: 10px;
    }
    .background, .background-overlay, .loading-overlay {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0;
        transition: opacity .3s ease-out;
    }
    .background {
        margin:0;
        padding: 0;
        z-index: 1;
        background: url('../assets/background.jpg') no-repeat center center fixed;
        background-size: cover;
    }
    .background-overlay {
        z-index: 2;
        background-image: url(../assets/overlay-vignette2.png);
        background-size: 100% 100%;
    }
    .background.show, .background-overlay.show {
        opacity: 1;
    }
    .loading-overlay {
        z-index: 3;
        background: #fff;
        text-align: center;
        display: flex;
        color: #FF9800;
    }
    .loading-overlay.show {
        opacity: 1;
    }
    .loading-overlay .loading-content {
        margin: auto;
    }
    .loading-overlay p {
        background: linear-gradient(to right, #FFC107, #FF5722);
        -webkit-background-clip: text;
        color: transparent;
    }
    /* loading animation */
    .lds-ellipsis {
        display: inline-block;
        position: relative;
        width: 64px;
        height: 64px;
    }
    .lds-ellipsis div {
        position: absolute;
        top: 27px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        /*background: #fed;*/
        background: #ffc107;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .lds-ellipsis div:nth-child(1) {
        left: 6px;
        animation: lds-ellipsis1 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(2) {
        left: 6px;
        animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(3) {
        left: 26px;
        animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(4) {
        left: 45px;
        animation: lds-ellipsis3 0.6s infinite;
    }
    @keyframes lds-ellipsis1 {
        0% {
            transform: scale(0);
            background: #ffeb3b;
        }
        100% {
            transform: scale(1);
            background: #ffc107;
        }
    }
    @keyframes lds-ellipsis3 {
        0% {
            transform: scale(1);
            background: #ff9800;
        }
        100% {
            transform: scale(0);
            background: #ffc107;
        }
    }
    @keyframes lds-ellipsis2 {
        0% {
            transform: translate(0, 0);
            background: #ffc107;
        }
        100% {
            transform: translate(19px, 0);
            background: #ff9800;
        }
    }

</style>
