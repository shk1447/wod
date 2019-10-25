<template>
    <free-transform v-if="visible" ref="test" @onSelect="onSelect"
        :x="element.x"
        :y="element.y"
        :width="element.width"
        :height="element.height"
        :scale-x="element.scaleX"
        :scale-y="element.scaleY"
        :angle="0"
        :offset-x="0"
        :offset-y="0"
        @update="update($event)">
    </free-transform>
</template>

<script>
import FreeTransform from 'vue-free-transform';

export default {
    data () {
        return {
            visible:false,
            element: {
                x:0,
                y:0,
                width:100,
                height:100,
                scaleX:1,
                scaleY:1
            },
            params:null
        }
    },
    components: {
        'free-transform':FreeTransform
    },
    methods: {
        onSelect(a,b,c) {
            console.log(a,b,c);
        },
        update(e) {
            console.log(e);
            if(e.angle || e.scaleX) {
                if(e.angle) {
                    // rotation
                } else {
                    // scale
                    // this.element.scaleX = e.scaleX;
                    // this.element.scaleY = e.scaleY;
                    this.params.item.props.style.width = this.element.width + 'px';
                    this.params.item.props.style.height = this.element.height + 'px';
                }
            } else {
                // position
                this.element.x = e.x;
                this.element.y = e.y;
                this.params.item.props.style.left = this.element.x + "px";
                this.params.item.props.style.top = this.element.y + "px";
            }
        },
        handleSelectedItem(params) {
            if(params.active) {
                this.visible = true;
                this.params = params;
                //var offset = $(params.event.currentTarget).offset()
                this.refresh();
            } else {
                this.visible = false;
                this.params = null;
            }
        },
        refresh() {
            this.element.x = this.params.event.currentTarget.offsetLeft;
            this.element.y = this.params.event.currentTarget.offsetTop;
            this.element.width = this.params.event.currentTarget.clientWidth;
            this.element.height = this.params.event.currentTarget.clientHeight;
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        var me = this;
        me.custom_events.on('active_transform',me.handleSelectedItem);
        console.log('mounted')
    },
    destroyed() {
        console.log('destroyed')
    }
}
</script>

<style>
    
    .tr-transform--active{
        position: absolute;
        z-index: 5;
    }
    
    .tr-transform__content{
        user-select: none;
    }
    .tr-transform__rotator {
        top: -45px;
        left: calc(50% - 7px);
    }

    .tr-transform__rotator,
    .tr-transform__scale-point {
        background: #fff;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        position: absolute;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    .tr-transform__rotator:hover,
    .tr-transform__scale-point:hover {
        background: #F1F5F8;
    }

    .tr-transform__rotator:active,
    .tr-transform__scale-point:active {
        background: #DAE1E7;
    }

    .tr-transform__scale-point {

    }

    .tr-transform__scale-point--tl {
        top: -7px;
        left: -7px;
    }

    .tr-transform__scale-point--ml {
        top: calc(50% - 7px);
        left: -7px;
    }

    .tr-transform__scale-point--tr {
        left: calc(100% - 7px);
        top: -7px;
    }

    .tr-transform__scale-point--tm {
        left: calc(50% - 7px);
        top: -7px;
    }

    .tr-transform__scale-point--mr {
        left: calc(100% - 7px);
        top: calc(50% - 7px);
    }

    .tr-transform__scale-point--bl {
        left: -7px;
        top: calc(100% - 7px);
    }

    .tr-transform__scale-point--bm {
        left: calc(50% - 7px);
        top: calc(100% - 7px);
    }

    .tr-transform__scale-point--br {
        left: calc(100% - 7px);
        top: calc(100% - 7px);
    }
    .tr-transform__controls {
        border : 1px dashed black;
    }
</style>
