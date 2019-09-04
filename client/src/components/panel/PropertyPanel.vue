<template>
    <div style="height:100%; overflow:auto; font-size: 12px;">
        <div class="form-row" v-for="(row_fields, row_i) in fields[activeType]" :key="row_i">
            <div class="form-column" v-for="(field, col_i) in row_fields" :key="row_i + '_' + col_i" :style="field.style">
                <span class="form-label">{{field.label}}</span>
                <component class="form-comp" :is="field.type" @init="editorInit" lang="javascript" size="mini"
                            :value="getModel(field.key)" @input="handleChangeSetter(field.key, $event)">
                </component>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api";
import aceEditor from 'vue2-ace-editor';

export default {
    data() {
        return {
            activeType:'setter',
            selected_item:{
                props:{
                    setter:{}
                }
            },
            fields:{
                setter:[],
                style:[]
            }
      }
    },
    computed: {
        getModel: function() {
            return function(key) {
                console.log(key);
                var me = this;
                var res = new Function('return this.selected_item.' + key ).bind(this);
                return res();
            }
        }
    },
    components: {
        'ace-editor':aceEditor
    },
    methods: {
        editorInit: function () {
            require('brace/ext/language_tools') //language extension prerequsite...
            require('brace/mode/html')                
            require('brace/mode/javascript')    //language
            require('brace/mode/less')
            require('brace/theme/chrome')
            require('brace/snippets/javascript') //snippet
        },
        setValueByPath(object, path, value) {
            var count = 0;
            var path_arr = path.split('.')
            var result = path_arr.reduce(function (d, index) {
                count++;
                if(count === path_arr.length) {
                    d[index] = value
                }
                return d[index]
            }, object)
            return result;
        },
        handleChangeSetter(key, event){
            var setter = this.setValueByPath(this.selected_item, key, event);
            if(this.activeType === 'setter') {
                this.custom_events.emit('redrawFlow');
            }
            this.$forceUpdate();
        }
    },
    created() {
        
    },
    updated() {
        console.log('updated!!', this.selected_item);
        var comp_fields = this[this.selected_item.type][this.selected_item.compName].fields;
        this.fields = comp_fields ? comp_fields : {setter : [], style : []};
    },
    mounted() {
        
    },
    destroyed() {
        
    }
}
</script>

<style>
.form-row {
    display: flex;
    width:100%;
    height:40px;
    margin: 6px 0;
}
.form-column {
    display: flex;
    flex:auto;
}
.form-label {
    display: flex;
    text-align: right;
    margin-right: 6px;
    width:60px;
    line-height:12px;
    align-items: center;
    justify-content: flex-end;
}
.form-comp {
    display: inline-block;
    flex: 1;
}
</style>
