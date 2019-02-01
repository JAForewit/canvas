
Vue.component('widget-toolbar', {
    data: function() {
        return {
            showToolbar: false,
        };
    },
    template: '<div><h1 v-bind:class="{ \'open\': showToolbar }" class="Toolbar">Toolbar</h1></div>'
});

new Vue({
    el: '#app',
    data: {
        title: 'title',
    }
});