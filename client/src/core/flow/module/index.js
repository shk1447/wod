const PollingNode = require('./PollingNode');
const PushNode = require('./PushNode');

module.exports = [{
    compName:"push-comp",
    type:'flow_comp',
    class:PushNode,
    props:{
        setter:{
            data_key:""
        }
    },
    fields:{
        setter:[{
            "key":"id",
            "label":"노드 아이디",
            "type":"string",
            "description":""
        },{
            "key":"props.setter.data_key",
            "label":"데이터 기준 키",
            "type":"string",
            "description":""
        }]
    }
},{
    compName:"polling-comp",
    type:'flow_comp',
    class:PollingNode,
    props:{
        setter:{
            url:""
        }
    },
    fields:{
        setter:[{
            "key":"id",
            "label":"노드 아이디",
            "type":"string",
            "description":""
        },{
            "key":"props.setter.url",
            "label":"데이터 URL",
            "type":"string",
            "description":""
        }]
    }
}]