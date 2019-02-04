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
        dragStart: function() {
            console.log(":drag start");
        },
        dragEnd: function() {
            console.log(":drag end");
        }
    },
    mounted: function() {
        // create list of draggable items
        for (var i=0; i<this.$el.children.length; i++) {
            console.log(i);
            element = this.$el.children[i];
            options = { 
                smoothDrag: true,
                onDragStart: this.dragStart,
                onDragEnd:  this.dragEnd
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

