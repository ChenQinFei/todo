<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /*color: #fff;*/
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
ul, h1, h2, h3 {
    margin: 0;
    padding: 0;
}
li {
    list-style: none;
    margin: 0;
    padding: 0;
}

a, a:link, a:active, a:visited {
    /*color: #fff;*/
    text-decoration: none;
}
button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    -webkit-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
}
:focus {
    outline: 0;
}
</style>
