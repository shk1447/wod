<template>
    <div style="height:100%; overflow:auto; display:flex;">
        <div class="form-row" v-for="field in fields[activeType]" :key="field.key">
            <label class="form-label">{{field.label}}</label>
            <component :is="field.type" :height="500" @init="editorInit" lang="javascript"
                        :value="getModel(field.key)" @input="handleChangeSetter(field.key, $event)">
            </component>
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
}
.form-label {
    flex:0.2
}
</style>
