import * as d3 from "d3";
import axios from "axios";

axios.get("/src/asdata.json").then(res => {
    let layout = {

        "name": "tree",
        "params": {
            "nodeSpacing": 20,
            "layerSpacing": 20,
            "angle": 0,
            "alignment": 0,
            "viewSize": {
                "width": 1500,
                "height": 1200
            }
        }

    }
    res.data.nodes.forEach(v => {
        v.x = 0;
        v.y = 0;
    });
    res.data.links.forEach(v=>{
        v.from=v.from+'';
        v.to=v.to+''
    })
    const bfsRes=BFS(res.data.nodes,res.data.links)
    console.log(res.data.nodes.length);
    console.log(res.data.links.length)
    let graph1 = {
        nodes: bfsRes.nodes,
        links: bfsRes.links,
        layout: layout
    }
    console.log()
    axios.post("http://127.0.0.1:8989/pos", graph1).then((res) => {
        console.log("finished");
        console.log(res.data)
        render(res.data);
    })

});

function BFS(nodes,links){
    const neborTable=new Map();

    const tagMap=new Map();
    const nodeMap=new Map();
    const nodeRes=[];
    const linkRes=[];
    nodes.forEach((node)=>{
        nodeMap.set(node.id,node);
        neborTable.set(node.id,[])
    });
    links.forEach(link=>{
        if(neborTable.has(link.from)){
            neborTable.get(link.from).push(link.to);
        }
    })
    const queue=["0"];
    tagMap.set("0",1);
    nodeRes.push(nodeMap.get("0"));
    while(queue.length>0){
        const fromNode=queue.shift();
       
        neborTable.get(fromNode).forEach(toNode=>{
            if(!tagMap.has(toNode)){
                tagMap.set(toNode,1);
                queue.push(toNode);
                nodeRes.push(nodeMap.get(toNode));
                linkRes.push({
                    from:fromNode,
                    to:toNode
                })
            }
        })
    }
    return {
        nodes:nodeRes,
        links:linkRes
    }

}

function render(graph) {
    const svg = d3.select('body').append('svg');
    svg.attr('width', 1500)
        .attr('height', 1200)


    const mainG = svg.append('g')
        .attr("transfrom","translate(10,10)")
        d3.h
    mainG.selectAll('line')
        .data(graph.links)
        .enter()
        .append('line')
        .attr("x2", d => {
            return d.toPos.x
        })
        .attr('y2', d => {
            return d.toPos.y

        })
        .attr('x1', d => {
            return d.fromPos.x;

        })
        .attr("y1", d => {
            return d.fromPos.y;

        })
        .attr('stroke', "#999")
        .attr("stroke-width", 2);
    mainG.selectAll('circle')
        .data(graph.nodes)
        .enter()
        .append('circle')
        .attr('cx', (d) => {
            return d.x;
        })
        .attr('cy', (d) => {
            return d.y;
        })
        .attr('r', 5)
        .attr('fill', 'red');

}