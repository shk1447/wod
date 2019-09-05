import domEvents from 'threex-domevents'
import * as THREE from 'three'
const ThreeLayerEvent = {
    data(){
        return {
            domEvents : null,
            threeLayerEventMap : {},
            THREEx : {}
        }
    },
    methods : {
        initializeThreeLayerEvent(camera, domElement){
            domEvents(THREE, this.THREEx);
            this.domEvents = new this.THREEx.DomEvents(camera, domElement);
            console.log("@@@@@@@@@@@@@@@ THREE LAYEr EVENT @@@@@@@@@@@@@@@@@@")
            console.log(this.domEvents);
            console.log(this.custom_events);
        },
        addLayerEventListener(listenerType, eventType, callback, threeObj = null){
            if(listenerType === 'custom_event')
                this.custom_events.on(eventType, callback)
            else if(listenerType === 'layer_mouse_event')
                this.domEvents.addEventListener(threeObj, eventType, callback);
        },
        removeLayerEventListener(listenerType, eventType, callback, threeObj = null){
            if(listenerType === 'custom_event'){
                this.custom_events.off(eventType);
            }else if(listenerType === 'layer_mouse_event'){
                this.domEvents.removeEventListener(threeObj, eventType, callback);
            }
        }
    }
};

export default ThreeLayerEvent;
