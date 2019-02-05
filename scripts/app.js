Vue.component('grid-layout', {
    props: {
        cols: {
            type: Number,
            default: 1
        },
        handles: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            items: []
        };
    },
    template: `
    <div>
        <slot></slot>
    </div>`,
    methods: {
        dragStart: function(drag,x,y,event) {
            drag.element.style.transition = "none";
        },
        dragEnd: function(drag,x,y,event) {
            drag.set(Math.round(x/400)*400);
            console.log(drag.options.id);
            drag.element.style.transition = "ease-out 0.1s";
        },
    },
    mounted: function() {
        // create list of draggable items
        for (var i=0; i<this.$el.children.length; i++) {
            element = this.$el.children[i];
            options = { 
                id: i,
                smoothDrag: true,
                onDragStart: this.dragStart,
                onDragEnd: this.dragEnd,
            };
            if (this.handles) options.handle = element.children[0];
            drag = new Draggable(element, options);
            this.items.push(drag);
        };

        // limit movability of draggable items
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

