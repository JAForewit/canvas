Vue.component('grid-layout', {
    props: {
        cols: {
            type: Number,
            required: true
        }
    },
    template: `
    <div>
        <slot></slot>
    </div>`,
    mounted: function() {
        for (var i=0; i<this.$el.children.length; i++) {
            element = this.$el.children[i];
            options = {
                grid: 100,
                smoothDrag: true,
            };
            new Draggable(element, options);
        }
    },
});

Vue.component('widget', {
    template: `
    <div class='widget'>
        <div class='widget-handle'>
            <slot></slot>
        </div>
    </div>`,
});


new Vue({
    el: '#app',
    data: {},
    components: {
        'toolbar' : {
            template: `
            <div v-bind:class="{ 'open': showToolbar }" class="toolbar">
                <button v-on:click="showToolbar = !showToolbar" style="float: right; margin-right: -100px;">toggle toolbar</button>    
                <slot></slot>
            </div>`,
            props: {},
            data: function() {
                return {
                    showToolbar: true
                }
            }
        },
    }
});

