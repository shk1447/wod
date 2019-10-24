<template>
    <div>
        <i class="fas fa-layer-group" style="font-size : 50px; cursor:pointer; color : blue"></i>
        <i class="fas fa-layer-group" style="font-size : 50px; cursor:pointer; color : red"></i>
        <!--<el-select-->
                <!--v-model="gridNameStr"-->
                <!--placeholder="Select">-->
            <!--<el-option-->
                    <!--v-for="item in gridNameList"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
            <!--</el-option>-->
        <!--</el-select>-->
    </div>
</template>

<script>
    export default {
        name: "LayerControlPanel",
        props : ['gridData'],
        data(){
            return {
                gridNameList : [],
                gridNameStr : ""
            }
        },
        methods : {

        },
        mounted(){
            // this.$nextTick(()=>{
            //     console.log("############# LAYER CONTROL PANEL #############");
            //     console.log(this.gridData);
            //     this.gridNameList = [];
            //     this.gridData.forEach((d)=>{
            //         this.gridNameList.push({
            //             value : d.name,
            //             label : d.name
            //         });
            //     });
            //     this.gridNameStr = this.gridNameList[0].value;
            //     this.$forceUpdate()
            // })
        }
    }
</script>

<style scoped>

</style>
