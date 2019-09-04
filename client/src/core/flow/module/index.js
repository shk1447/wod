const PollingNode = require('./PollingNode');
const PushNode = require('./PushNode');
const FunctionNode = require('./FunctionNode');

module.exports = [{
    compName:"push-comp",
    type:'flow_comp',
    input:false,
    output:true,
    class:PushNode,
    props:{
        setter:{
            data_key:""
        }
    },
    fields:{
        setter:[[{
            "key":"id",
            "label":" 아이디",
            "type":"el-input",
            "description":""
        }],[{
            "key":"props.setter.data_key",
            "label":"기준 키",
            "type":"el-input",
            "description":""
        }]]
    }
},{
    compName:"polling-comp",
    type:'flow_comp',
    input:false,
    output:true,
    class:PollingNode,
    props:{
        setter:{
            url:""
        }
    },
    fields:{
        setter:[[{
            "key":"id",
            "label":"아이디",
            "type":"el-input",
            "description":""
        }],[{
            "key":"props.setter.url",
            "label":"URL",
            "type":"el-input",
            "description":""
        }]]
    }
},{
    compName:"function-comp",
    type:'flow_comp',
    input:true,
    output:true,
    class:FunctionNode,
    props:{
        setter:{
            script:""
        }
    },
    fields:{
        setter:[[{
            "key":"id",
            "label":"아이디",
            "type":"el-input",
            "description":""
        }],[{
            "key":"props.setter.script",
            "label":"SCRIPT",
            "type":"ace-editor",
            "description":"",
            "style": {
                "height":'400px'
            }
        }]]
    }
}]