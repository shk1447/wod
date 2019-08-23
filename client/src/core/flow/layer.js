var d3 = require('d3');
var _ = require('lodash');
d3.rebind = function(target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
};

function d3_rebind(target, source, method) {
    return function() {
        var value = method.apply(source, arguments);
        return value === source ? target : value;
    };
}

d3.keybinding = function() {
    var _keys = {
        // MOD aka toggleable keys
        mods: {
            // Shift key, ⇧
            '⇧': 16,
            // CTRL key, on Mac: ⌃
            '⌃': 17,
            // ALT key, on Mac: ⌥ (Alt)
            '⌥': 18,
            // META, on Mac: ⌘ (CMD), on Windows (Win), on Linux (Super)
            '⌘': 91
        },
        // Normal keys
        keys: {
            // Backspace key, on Mac: ⌫ (Backspace)
            '⌫': 8, backspace: 8,
            // Tab Key, on Mac: ⇥ (Tab), on Windows ⇥⇥
            '⇥': 9, '⇆': 9, tab: 9,
            // Return key, ↩
            '↩': 13, 'return': 13, enter: 13, '⌅': 13,
            // Pause/Break key
            'pause': 19, 'pause-break': 19,
            // Caps Lock key, ⇪
            '⇪': 20, caps: 20, 'caps-lock': 20,
            // Escape key, on Mac: ⎋, on Windows: Esc
            '⎋': 27, escape: 27, esc: 27,
            // Space key
            space: 32,
            // Page-Up key, or pgup, on Mac: ↖
            '↖': 33, pgup: 33, 'page-up': 33,
            // Page-Down key, or pgdown, on Mac: ↘
            '↘': 34, pgdown: 34, 'page-down': 34,
            // END key, on Mac: ⇟
            '⇟': 35, end: 35,
            // HOME key, on Mac: ⇞
            '⇞': 36, home: 36,
            // Insert key, or ins
            ins: 45, insert: 45,
            // Delete key, on Mac: ⌦ (Delete)
            '⌦': 46, del: 46, 'delete': 46,
            // Left Arrow Key, or ←
            '←': 37, left: 37, 'arrow-left': 37,
            // Up Arrow Key, or ↑
            '↑': 38, up: 38, 'arrow-up': 38,
            // Right Arrow Key, or →
            '→': 39, right: 39, 'arrow-right': 39,
            // Up Arrow Key, or ↓
            '↓': 40, down: 40, 'arrow-down': 40,
            // odities, printing characters that come out wrong:
            // Num-Multiply, or *
            '*': 106, star: 106, asterisk: 106, multiply: 106,
            // Num-Plus or +
            '+': 107, 'plus': 107,
            // Num-Subtract, or -
            '-': 109, subtract: 109,
            // Semicolon
            ';': 186, semicolon:186,
            // = or equals
            '=': 187, 'equals': 187,
            // Comma, or ,
            ',': 188, comma: 188,
            //'-': 189, //???
            // Period, or ., or full-stop
            '.': 190, period: 190, 'full-stop': 190,
            // Slash, or /, or forward-slash
            '/': 191, slash: 191, 'forward-slash': 191,
            // Tick, or `, or back-quote
            '`': 192, tick: 192, 'back-quote': 192,
            // Open bracket, or [
            '[': 219, 'open-bracket': 219,
            // Back slash, or \
            '\\': 220, 'back-slash': 220,
            // Close backet, or ]
            ']': 221, 'close-bracket': 221,
            // Apostraphe, or Quote, or '
            '\'': 222, quote: 222, apostraphe: 222
        }
    };
    // To minimise code bloat, add all of the NUMPAD 0-9 keys in a loop
    var i = 95, n = 0;
    while (++i < 106) _keys.keys['num-' + n] = i; ++n;
    // To minimise code bloat, add all of the top row 0-9 keys in a loop
    i = 47, n = 0;
    while (++i < 58) _keys.keys[n] = i; ++n;
    // To minimise code bloat, add all of the F1-F25 keys in a loop
    i = 111, n = 1;
    while (++i < 136) _keys.keys['f' + n] = i; ++n;
    // To minimise code bloat, add all of the letters of the alphabet in a loop
    i = 64;
    while(++i < 91) _keys.keys[String.fromCharCode(i).toLowerCase()] = i;

    var pairs = d3.entries(_keys.keys),
        event = d3.dispatch.apply(d3, d3.keys(_keys.keys));

    function keys(selection) {
        selection.on('keydown', function () {
            var tagName = d3.select(d3.event.target).node().tagName;
            if (tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA') {
                return;
            }

            var modifiers = '';
            if (d3.event.shiftKey) modifiers += '⇧';
            if (d3.event.ctrlKey) modifiers += '⌃';
            if (d3.event.altKey) modifiers += '⌥';
            if (d3.event.metaKey) modifiers += '⌘';

            pairs.filter(function(d) {
                return d.value === d3.event.keyCode;
            }).forEach(function(d) {
                event["_"][d.key].forEach((e) => {
                    e.value(d3.event, modifiers);
                })

            });
        });
    }

    return d3.rebind(keys, event, 'on');
};

const randomColor = require('randomcolor') ;

module.exports = (function() {
    var width, height, container_div;
    var outer, vis, outer_background, link_group, drag_group;
    var x, y, gX, gY, xAxis, yAxis, zoom;
    var node_size = 16;
    var outer_transform = {
        x:0,
        y:0,
        k:1
    };

    var drag_line;
    var temp_link = {source:null,target:null};

    var lineGenerator;

    var activeNodes = [];
    var activeLinks = [];
    var selected_id = "";

    var color_define = {
        "speed" : {
            "1G":"#008000",
            "10G":"#7CFC00",
            "25G":"#4B0082",
            "100G":"#008080"
        }
    }

    var push_node_count = 0;

    function portMouseDown(port, node, type) {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        if(type === 'input') {
            temp_link.target = node;
        } else {
            temp_link.source = node;
        }
    }

    function portMouseUp(port, node, type) {
        if(type === 'input') {
            temp_link.target = node;
        } else {
            temp_link.source = node;
        }
        if(temp_link.source && temp_link.target) {
            activeLinks.push(temp_link);
            redraw();
        }
        temp_link = {source:null,target:null};
    }

    function portMouseOver(port, node, type) {
        port.classed("port_hovered",true);
    }

    function portMouseOut(port, node, type) {
        port.classed("port_hovered",false);
    }

    function canvasContextMenu() {
        var selected_node = activeNodes.find(function(d) { return d.id === selected_id});
        var position = getPosition(d3.event)
        Vue.custom_events.emit('contextmenu', {
            active:true,
            params : {
                node_info:selected_node,
                event:d3.event,
                position:position
            }
        });
        console.log('location 재조정')
        d3.event.stopPropagation();
        d3.event.preventDefault();
    }

    function canvasMouseUp() {
        temp_link = {source:null,target:null};
        if(drag_line) {
            drag_line.remove();
            drag_line = null;
        }
    }

    function canvasMouseDown() {
        selected_id = "";
        Vue.custom_events.emit('contextmenu', {
            active:false,
            x : d3.event.pageX,
            y : d3.event.pageY,
            params : {},
            event:d3.event
        });
        redraw();
    }

    function canvasMouseMove() {
        var start_point = temp_link.source ? temp_link.source : temp_link.target;
        var mouse_x = (d3.event.offsetX - outer_transform.x ) / outer_transform.k;
        var mouse_y = (d3.event.offsetY - outer_transform.y ) / outer_transform.k;
        if(start_point) {
            var x1 = temp_link.source ? (start_point.flow.x + node_size*8) : mouse_x;
            var y1 = temp_link.source ? (start_point.flow.y + node_size) : mouse_y;
            var x2 = temp_link.source ? mouse_x : start_point.flow.x;
            var y2 = temp_link.source ? mouse_y : (start_point.flow.y + node_size);
            if(drag_line) {
                drag_line.attr("d", lineGenerator([[x1, y1], [x2, y2]]))
            } else {
                drag_line = drag_group.append("svg:path").attr("class", "drag_line").attr("d", lineGenerator([[x1, y1], [x2, y2]]))
            }
        }
    }

    function canvasDblClick() {
        console.log('dbl click!!!');
        var x = (d3.event.offsetX - outer_transform.x ) / outer_transform.k;
        var y = (d3.event.offsetY - outer_transform.y ) / outer_transform.k
        var node_info = {
            id:'receiver' + (activeNodes.length + 1),
            name:'receiver' + (activeNodes.length + 1),
            x:x,
            y:y,
            input:false,output:true,
            props:{
                protocol:''
            }
        }
        addNodes([node_info]);
    };

    function zoomed() {
        outer_transform = d3.event.transform;
        vis.attr("transform", d3.event.transform);
        gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));

        //redraw();
    }

    function dragstarted(d) {
        //d3.event.stopPropagation();
        d3.select(this).classed("dragging", true);
        //redraw();
    }

    function dragged(d) {
        d3.select(this).attr("cx", d.flow.x = (d3.event.x - node_size*4)).attr("cy", d.flow.y = (d3.event.y - node_size));
        redraw();
    }

    function dragended(d) {
        d3.select(this).classed("dragging", false);
        //redraw();
    }

    function addNodes(nodes) {
        // push_node_count
        _.each(nodes, function(node, i) {
            if(node.hasOwnProperty('eventCallback')){
                node.id += '_' + (push_node_count + 1);
            }
            activeNodes.push(node);
            if(node.type === 'push_node')
                push_node_count++;
        });
        redraw();
    }

    var activeDropShadow, activeBlur;

    var dropShadow = {
        'stdDeviation': 2,
        'dx': 0,
        'dy': 0,
        'slope': 0.5,
        'type': 'linear'
    };

    function addDrawDropShadow() {
        activeBlur = 'blur';
        activeDropShadow = 'dropshadow';

        var defs = outer.append('defs')
        var blur_filter = defs.append('filter').attr('id', activeBlur)
        blur_filter.append('feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('stdDeviation', parseInt(dropShadow.stdDeviation))

        var filter = defs.append('filter')
                .attr('id', activeDropShadow)
                .attr('filterUnits','userSpaceOnUse');

        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', parseInt(dropShadow.stdDeviation));

        filter.append('feOffset')
            .attr('dx', parseInt(dropShadow.dx))
            .attr('dy', parseInt(dropShadow.dy));

        var feComponentTransfer = filter.append('feComponentTransfer');
        feComponentTransfer
            .append('feFuncA')
                .attr('type', dropShadow.type)
                .attr('slope', parseFloat(dropShadow.slope));

        var feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }

    function nodeClicked(node, node_info) {
        d3.event.stopPropagation();
        d3.event.preventDefault();

        selected_id = node_info.id

        Vue.custom_events.emit('selected_item', node_info);

        redraw();
    }

    function getPosition(event) {
        var x = Math.round((event.offsetX - outer_transform.x) / outer_transform.k);
        var y = Math.round((event.offsetY - outer_transform.y) / outer_transform.k);
        return {
            x: x,
            y: y
        }
    }

    function redraw() {
        var node = vis.selectAll(".nodegroup").data(activeNodes, function(d) { return d.id });

        node.exit().remove();

        var nodeEnter = node.enter().insert("svg:g")
            .attr("class", "node nodegroup");

        // 신규
        nodeEnter.each(function(d,i) {
            var node = d3.select(this);
            node.attr("id",d.id)
                .attr("transform", function(d) { return "translate(" + (d.flow.x) + "," + (d.flow.y) + ")"; })
                .style("cursor", "pointer")
                .on('click', (function() { var node = d; return function(d,i) { nodeClicked(d3.select(this),node) }})())
                .on('contextmenu', function() {
                    console.log(d);
                    // d3.event.stopPropagation();
                    // d3.event.preventDefault();
                })
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended))
            node.w = node_size;
            node.h = node_size;

            // var anim_alarm = node.append("circle")
            //                     .attr("r", node_size)
            //                     .attr("fill", "rgba(255,0,0,0)")
            //                     .style("stroke-width", 0)

            // d.animate = function () {
            //     if(d.status === 0) {
            //         return;
            //     }
            //     anim_alarm.attr('r', node_size*0).attr('opacity', 1).style("stroke-width", 0).style("stroke", d.status > 0 ? "red" : 'blue');
            //     anim_alarm.transition()
            //                 .duration(1000)
            //                 .attr("r", node_size)
            //                 .attr('opacity', 0)
            //                 .style("stroke-width", 2.5)
            //             .on("end", d.animate)
            // }


            d.node = node.append("rect")
                .attr('rx', node_size/4)
                .attr('x', 0)
                .attr('y', 0)
                .attr("width", node_size*8)
                .attr("height", node_size*2)

            if(d.output) {
                node.append("circle")
                .attr("class", "port")
                .attr("cx", node_size*8)
                .attr("cy", node_size)
                .attr("r", node_size/3)
                .attr("fill", function(d) { return '#ddd' })
                .attr('stroke', function(d) {
                    var color = '#999';
                    return color;
                })
                .style("cursor", "crosshair")
                .on('mousedown', (function() { var node = d; return function(d,i) { portMouseDown(d3.select(this),node,'output') }})() )
                .on('mouseup', (function() { var node = d; return function(d,i) { portMouseUp(d3.select(this),node,'output') }})() )
                .on('mouseover', (function() { var node = d; return function(d,i) { portMouseOver(d3.select(this),node,'output') }})() )
                .on('mouseout', (function() { var node = d; return function(d,i) { portMouseOut(d3.select(this),node,'output') }})() )
            }

            if(d.input) {
                node.append("circle")
                .attr("class", "port")
                .attr("cx", 0)
                .attr("cy", node_size)
                .attr("r", node_size/3)
                .attr("fill", function(d) { return '#ddd' })
                .attr('stroke', function(d) {
                    var color = '#999';
                    return color;
                })
                .style("cursor", "crosshair")
                .on('mousedown', (function() { var node = d; return function(d,i) { portMouseDown(d3.select(this),node,'input') }})() )
                .on('mouseup', (function() { var node = d; return function(d,i) { portMouseUp(d3.select(this),node,'input') }})() )
                .on('mouseover', (function() { var node = d; return function(d,i) { portMouseOver(d3.select(this),node,'input') }})() )
                .on('mouseout', (function() { var node = d; return function(d,i) { portMouseOut(d3.select(this),node,'input') }})() )
            }

            d.node.style("cursor", "pointer")
                .attr("class", "node")
                .attr("fill",function(d) {
                    var color = 'rgb(166, 187, 207)';
                    return color;
                })
                .attr('stroke', function(d) {
                    var color = '#999';
                    return color;
                })

            var text_node = node.append('svg:text').attr('x', node_size*4).attr('y', node_size)
                .style('stroke', 'none').style('dominant-baseline', 'central').style("text-anchor", "middle").style('fill', 'rgb(53, 53, 53)')
                .text(d.id);

            d.update = function() {
                text_node.text(d.id)
            };
            if(d.flow.wires && d.flow.wires.length > 0) {
                _.each(d.flow.wires, function(target_id,i) {
                    var wired_obj = activeNodes.find(function(d) {return d.id === target_id});
                    if(wired_obj) {
                        activeLinks.push({source:d, target:wired_obj})
                    }
                })
            }
        });

        // 갱신
        node.each(function(d,i) {
            var thisNode = d3.select(this);

            thisNode.attr("transform", function(d) { return "translate(" + (d.flow.x) + "," + (d.flow.y) + ")"; });
            // d.animate();
            d.update();
            if(selected_id === d.id) {
                d.node.classed('selected', true)
                d.node.attr('filter', 'url(#' + activeDropShadow + ')' );
                // d.node.transition().duration(250).attr('width', node_size*2*2 ).attr('height', node_size*2*2 ).attr("fill", '#eaedf1')
                // .on("end", function() {

                // })
            } else {
                d.node.classed('selected', false)
                d.node.attr('filter', null );
                // d.node.transition().duration(250).attr('width', node_size*2*2 ).attr('height', node_size*2).attr("fill",function(d) {
                //     var color = 'rgb(166, 187, 207)';
                //     if(d.total_status === "상승") {
                //         color = 'rgb(200, 150, 150, 1)';
                //     } else if(d.total_status === "하락") {
                //         color = 'rgb(150, 150, 200, 1)';
                //     }
                //     return color;
                // });
            }
        });

        var link = link_group.selectAll(".link").data(activeLinks, function(d) { return d.source.id+":"+d.target.id });

        var linkEnter = link.enter().insert("svg:g")
            .attr("class", "link");

        linkEnter.each(function(d,i) {
            var l = d3.select(this);
            l.append("svg:path").attr("class", "link_background link_path");
            l.append("svg:path").attr('class', 'link_line link_path')
            l.append("svg:path").attr('class', 'link_anim')
            if(!d.sourceNode) d.sourceNode = activeNodes.find(function(a) { return a.id === d.source.id});
            if(!d.targetNode) d.targetNode = activeNodes.find(function(a) { return a.id === d.target.id});
        })
        link.exit().remove();

        // var speed_texts = link_group.selectAll('.volume_power');

        // speed_texts.each(function(d,i) {
        //     var text = d3.select(this);
        //     var text_width = text.node().getComputedTextLength()
        //     text.attr('x', (d.sourceNode.x + d.targetNode.x)/2 - (text_width/2))
        //     .attr('y', (d.sourceNode.y + d.targetNode.y)/2)
        // })

        var links = link_group.selectAll('.link_path')
        links.each(function(d,i) {
            var thisLink = d3.select(this);
            var id = d.sourceNode.id + ":" + d.targetNode.id;
            var path_data = lineGenerator([[d.sourceNode.flow.x + (node_size*8), d.sourceNode.flow.y + node_size],
                                            [d.targetNode.flow.x, d.targetNode.flow.y + node_size]])
            thisLink.attr("d", path_data).attr("stroke-width", node_size/4).attr('stroke','#888');
            if(selected_id === id) {
                thisLink.attr('stroke', '#ff7f0e');
            }
            if(selected_id === d.sourceNode.id || selected_id === d.targetNode.id) {
                var result = activeNodes.filter(function(a) {return a.id === d.sourceNode.id || a.id === d.targetNode.id});
                result.forEach(function(v,i) {
                    v.node.attr('filter', 'url(#' + activeDropShadow + ')' );
                })
                thisLink.attr('stroke', color_define.speed[d.speed] ? color_define.speed[d.speed] : '#ff7f0e');
            }
        })
        // var anim_links = link_group.selectAll('.link_anim');
        // anim_links.each(function(d,i) {
        //     var thisLink = d3.select(this);
        //     var path_data = lineGenerator([[d.sourceNode.x, d.sourceNode.y],[d.targetNode.x, d.targetNode.y]])
        //     thisLink.attr("d", path_data).attr("stroke-width", node_size/4)
        //         .attr('stroke', 'rgb(221,221,221)');
        //     var totalLength = thisLink.node().getTotalLength();
        //     thisLink.attr("stroke-dasharray", totalLength/8 + " " + totalLength);
        //     function repeat() {
        //         thisLink.attr('stroke-dashoffset', totalLength + (totalLength/4));
        //         thisLink.transition()
        //             .duration(20000/d.volume_percent)
        //             .attr("stroke-dashoffset", totalLength/8)
        //         .on("end", repeat)
        //     }
        //     repeat();
        // })
    }

    function deleteItem() {
        var node_index = activeNodes.findIndex(function(d) {return selected_id === d.id});
        if(node_index >= 0) {
            var remove_index = [];
            var link_length = activeLinks.length;
            for(var i = 0; i < link_length; i++) {
                var d = activeLinks[i];
                if((selected_id === d.sourceNode.id || selected_id === d.targetNode.id)) {
                    remove_index.push(i);
                }
            }
            activeNodes.splice(node_index, 1);

            remove_index.sort(function(a,b){return b-a});
            remove_index.forEach(function(link_index) {
                activeLinks.splice(link_index, 1);
            })
            redraw();
        }
    }

    function reload(data) {
        var me = this;
        activeNodes = [];
        activeLinks = [];
        me.redraw();
        if(data && data.activeNodes) activeNodes = data.activeNodes;
        if(data && data.activeLinks) activeLinks = data.activeLinks;
        me.redraw();
    }

    function getNodes () {
        return activeNodes;
    }

    function getLinks () {
        return activeLinks;
    }

    function addEventHandlers() {
        Vue.custom_events.on("saveFlow", saveFlow);
        Vue.custom_events.on("addNodes", addNodes);
        Vue.custom_events.on("redrawFlow", redraw);
    }

    function removeEventHandlers() {
        Vue.custom_events.off("saveFlow", saveFlow);
        Vue.custom_events.off("addNodes", addNodes);
        Vue.custom_events.off("redrawFlow", redraw);
    }

    function saveFlow() {

    }

    return {
        getPosition: getPosition,
        clear: function() {
            activeNodes = [];
            activeLinks = [];
            redraw();
        },
        zoom_reset: function(evt) {
            outer_transform = d3.zoomIdentity;
            outer.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
            redraw();
        },
        focus_target: function(d) {
            var focusing = d3.zoomIdentity.translate((container_div.clientWidth/2)-d.flow.x, (container_div.clientHeight/2)-d.flow.y).scale(1);
            outer.transition().duration(1200).call(zoom.transform, focusing);
        },
        reload:reload,
        init: function(id) {
            container_div = document.getElementById(id);
            lineGenerator = d3.line().curve(d3.curveCardinal);
            width = container_div.clientWidth;
            height = container_div.clientHeight;
            zoom = d3.zoom().on("zoom", zoomed)

            function test() {
                console.log('test');
            }
            var keyboard = d3.keybinding()
                            .on('delete', deleteItem)
                            .on('←', test)
                            .on('↑', test)
                            .on('→', test)
                            .on('↓', test);

            d3.select('body').call(keyboard);

            outer = d3.select("#" + id)
                        .append("svg:svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr('preserveAspectRatio', 'xMinYMin')
                        // .attr("pointer-events", "all")
                        // .style("cursor", "crosshair")
                        .call(zoom)
                        .on('dblclick.zoom', null)
                        .on('contextmenu', canvasContextMenu)
                        .on('click', canvasMouseDown)
                        .on('mousemove', canvasMouseMove)
                        .on('mouseup', canvasMouseUp)
                        .on('dblclick', canvasDblClick)


            vis = outer.append("svg:g")

            link_group = vis.append("g");
            drag_group = vis.append("g");

            x = d3.scaleLinear()
                .domain([-1, width + 1])
                .range([-1, width + 1]);

            y = d3.scaleLinear()
                .domain([-1, height + 1])
                .range([-1, height + 1]);

            xAxis = d3.axisBottom(x)
                .ticks((width + 2) / (height + 2) * 20)
                .tickSize(height)
                .tickPadding(8 - height);

            yAxis = d3.axisRight(y)
                .ticks(20)
                .tickSize(width)
                .tickPadding(8 - width);

            gX = outer.append("g")
                .attr("class", "axis axis--x")
                .attr("opacity", ".5")
                .call(xAxis);

            gY = outer.append("g")
                .attr("class", "axis axis--y")
                .attr("opacity", ".5")
                .call(yAxis);

            addDrawDropShadow();
            redraw();

            addEventHandlers();
        },
        redraw : redraw,
        addNodes : addNodes,
        getNodes : getNodes,
        getLinks : getLinks,
        uninit: function() {
            outer.remove();
            width;
            height;
            outer, vis, outer_background, link_group, drag_group;
            x, y, xAxis, yAxis, gX, gY;
            node_size = 16;
            outer_transform = {
                x:0,
                y:0,
                k:1
            };
            temp_link = {source:null,target:null};

            activeNodes = [];
            activeLinks = [];
            selected_id = "";
            redraw();

            removeEventHandlers();
        }
    }
})()
