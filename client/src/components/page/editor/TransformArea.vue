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
import FreeTransform from './FreeTransform';

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
            params:null,
            target:null
        }
    },
    components: {
        'free-transform':FreeTransform
    },
    methods: {
        onSelect(a,b,c) {
            
        },
        update(e) {
            if(e.angle || e.scaleX) {
                if(e.angle) {
                    // rotation
                } else {
                    // tl tm tr ml mr bl bm br
                    this.element.width = (e.origin_width * e.scaleX);
                    this.element.height = (e.origin_height * e.scaleY);

                    switch(e.scaleType) {
                        case "tl" : 
                            this.element.x = e.origin_x + e.origin_width - (e.origin_width * e.scaleX);
                            this.element.y = e.origin_y + e.origin_height - (e.origin_height * e.scaleY);
                            this.params.item.props.style.left = this.element.x + "px";
                            this.params.item.props.style.top = this.element.y + "px";
                        break;
                        case "tm" :
                            this.element.y = e.origin_y + e.origin_height - (e.origin_height * e.scaleY);
                            this.params.item.props.style.top = this.element.y + "px";
                        break;
                        case "tr" :
                            this.element.y = e.origin_y + e.origin_height - (e.origin_height * e.scaleY);
                            this.params.item.props.style.top = this.element.y + "px";
                        break;
                        case "ml" :
                            this.element.x = e.origin_x + e.origin_width - (e.origin_width * e.scaleX);
                            this.params.item.props.style.left = this.element.x + "px";
                        break;
                        case "bl" :
                            this.element.x = e.origin_x + e.origin_width - (e.origin_width * e.scaleX);
                            this.params.item.props.style.left = this.element.x + "px";
                        break;
                    }
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
                this.target = params.event.currentTarget;
                this.refresh();
            } else {
                this.visible = false;
                this.params = null;
            }
        },
        refresh() {
            this.$nextTick(() => {
                try {
                    this.element.x = this.target.offsetLeft;
                    this.element.y = this.target.offsetTop;
                    this.element.width = this.target.clientWidth;
                    this.element.height = this.target.clientHeight;
                    this.$forceUpdate();
                } catch (error) {
                    console.log(error);
                }
            })
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        var me = this;
        me.custom_events.on('active_transform',me.handleSelectedItem);
        me.custom_events.on('refresh_transform',me.refresh);
        console.log('mounted')
    },
    destroyed() {
        var me = this;
        me.custom_events.off('active_transform',me.handleSelectedItem);
        me.custom_events.off('refresh_transform',me.refresh);
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
