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
        'widget': {
            template: `
                <div class='widget'>
                    <div class='widget-handle'>
                        <slot></slot>
                    </div>
                </div>`,
            mounted: function() {
                options = {
                    grid: 100,
                    smoothDrag: true,
                    handle: this.$el.children[0]
                };
                new Draggable(this.$el, options);
            },
            props: {},
        }
    }
    
});