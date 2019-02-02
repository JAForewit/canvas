Vue.component('widget-toolbar', {
    data: function() {
        return {
            showToolbar: false,
        };
    },
    template: '<div><h1 v-bind:class="{ \'open\': showToolbar }" class="Toolbar">Toolbar</h1></div>'
});

new Vue({
    el: '#manager',
    data: {
        title: 'title',
        showToolbar: false
    }
});