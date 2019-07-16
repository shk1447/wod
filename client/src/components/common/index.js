
import TwoComp from "./two_comp";
import ThreeComp from "./three_comp";

import ThreeLayerComp from "./ThreeLayerComp.vue";
import TwoLayerComp from "./TwoLayerComp.vue";

export default {
    two_comp : TwoComp,
    three_comp : ThreeComp,
    layer_comp : [ThreeLayerComp, TwoLayerComp]
};