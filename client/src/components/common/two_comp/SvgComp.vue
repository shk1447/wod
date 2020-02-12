<template>
    <div ref="container" :style="meta.props.style"></div>
</template>

<script>

import http from '../../../utils/http'

export default {
    type:'two_comp',
    category:'Svg',
    compName:'svg-loader-comp',
    input:true,
    output:false,
    props: ['meta'],
    init_props: {
        style: {
            position: "absolute",
            overflow: "hidden",
            top:"",
            left:"",
            width:"100px",
            height:"100px",
            zIndex: "0",
            border:"0px dashed black",
            background:"rgba(0,0,0,0)"
        },
        setter: {
            url:"/assets/svg/svg0.svg"
        },
        children:[]
    },
    fields:{
        setter:[[{
            "key":"url",
            "label":"SVG URL",
            "type":"el-input",
            "description":"SVG URL"
        }]],
        style:[[{
            "key":"id",
            "label":"ID",
            "type":"el-input",
            "description":"ID"
        }],[{
            "key":"props.style.top",
            "label":"TOP",
            "type":"el-input",
            "description":"TOP"
        },{
            "key":"props.style.left",
            "label":"LEFT",
            "type":"el-input",
            "description":"LEFT"
        }],[{
            "key":"props.style.width",
            "label":"WIDTH",
            "type":"el-input",
            "description":"LEFT"
        },{
            "key":"props.style.height",
            "label":"HEIGHT",
            "type":"el-input",
            "description":"LEFT"
        }],[{
            "key":"props.style.border",
            "label":"BORDER",
            "type":"el-input",
            "description":"BORDER"
        },{
            "key":"props.style.zIndex",
            "label":"Z-INDEX",
            "type":"el-input",
            "description":"Z-INDEX"
        }],[{
            "key":"props.style.background",
            "label":"BACKGROUND",
            "type":"el-input",
            "description":"BACKGROUND"
        }]]
    },
    data () {
        return {
            meta:this.meta
        }
    },
    
    methods: {
        input_data:function(data){
            
        },
        output_data: function() {
            // if(this.meta.flow.wires && this.meta.flow.wires.length > 0) {
            //     for(var i = 0; i < this.meta.flow.wires.length; i++) {
            //         var wired_obj = this.meta.flow.wires[i];
            //         wired_obj.input_data(this);
            //     }
            // }
        },
        createSVGElement(tag, attrs) {
            let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            if (tag == "svg") {
                  el.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            }
            for (let k in attrs)
                  el.setAttribute(k, attrs[k]);
            return el;
        },
        SVG(tag) {
            return document.createElementNS('http://www.w3.org/2000/svg', tag);
        },
        append(data, container) {
            var self = this;
            var target = $(data);

            if(!container) {
                container = $(self.SVG('g'))            
                container.css({width:'100%',height:'100%'})
                container.appendTo(this.svg);
                this.groups.push(container);
            };
            target.each(function(d,k){
                if(k.tagName) {
                    var tagName = k.tagName.toLowerCase();
                    var svg_tag = $(self.SVG(tagName));
                    if(k.children.length == 0 && k.innerText) {
                        svg_tag.text(k.innerText);
                    }
                    for(var i = 0; i < k.attributes.length; i++) {
                        var attr = k.attributes[i];
                        svg_tag.attr(attr.name, attr.value);
                    }
                    svg_tag.appendTo(container);
                    if(k.children.length > 0) {
                        for(var i = 0; i < k.children.length; i++) {
                            self.append(k.children[i].outerHTML, svg_tag)
                        }
                    }
                }
            });

            return container;
        }
    },
    components : {
        
    },
    created() {
        console.log('created')
    },
    mounted() {
        let me = this;
        this.groups = [];
        this.svg = $(this.createSVGElement('svg',{ width:'100%',height:'100%'}));
        this.svg.attr("preserveAspectRatio","none")
        this.svg.attr("viewBox", "0 0 100 100");
        this.svg.attr("x", "0px");
        this.svg.attr("y", "0px");
        $(this.$refs.container).append(this.svg);

        http.get(this.meta.props.setter.url).then(function(res) {
            me.append(res);
        });

        this.core.flow.manager.addCompNode(this);
    },
    destroyed() {
        console.log('destroyed')
        this.core.flow.manager.removeCompNode(this);
    }
}
</script>

<style>
</style>
