
import TwoComp from "./two_comp";
import ThreeComp from "./three_comp";

import ThreeLayerComp from "./ThreeLayerComp.vue";
import TwoLayerComp from "./TwoLayerComp.vue";
import MapLayerComp from "./MapLayerComp.vue";

export default {
    layer_comp : [TwoLayerComp,ThreeLayerComp,MapLayerComp],
    two_comp : TwoComp,
    three_comp : ThreeComp,
};