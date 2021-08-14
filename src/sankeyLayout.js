import * as d3 from "d3";
import * as d3sankey from "d3-sankey";
import axios from "axios";
let data = {
    nodes: [
        {
            id: "A"
        }, {
            id: "D"
        }, {
            id: "E"
        }, {
            id: "B"
        }, {
            id: "F"
        }, {
            id: "C"
        }
    ],
    links: [
        {
            from: "A",
            to: "D",
            value: 5
        }, {
            from: "A",
            to: "E",
            value: 3
        }, {
            from: "B",
            to: "D",
            value: 2
        }, {
            from: "B",
            to: "E",
            value: 2
        }, {
            from: "A",
            to: "F",
            value: 2
        }, {
            from: "D",
            to: "E",
            value: 2
        }, {
            from: "D",
            to: "F",
            value: 3
        }, {
            from: "E",
            to: "F",
            value: 4
        }, {
            from: "C",
            to: "E",
            value: 3
        }

    ],
    layout: {
        name: "sankey",
        params: {
            direction: 0,
            layerSpacing:20,
            layerSpacing: 20,
            columnSpacing: 50,
            viewSize: {
                width: 1000,
                height: 500
            }
        }
    }
}
function render(graph) {
    const svg = d3.select('body').append('svg');
    svg.attr('width', 1000)
        .attr('height', 1000)


    const mainG = svg.append('g');
    mainG.selectAll('rect')
        .data(graph.nodes)
        .enter()
        .append('rect')
        .attr("x",d=>d.x0)
        .attr("y",d=>d.y0)
        .attr("width",d=>(d.x1-d.x0))
        .attr("height",d=>(d.y1-d.y0))
        .attr("fill","#000")
        .append('title')
        .text(d=>d.id)
        .append("title")
        .text(d=>d.id);
    const nodeMap=new Map();
    graph.nodes.forEach((node)=>{
        nodeMap.set(node.id,node);
    });

    graph.links.forEach((link)=>{
        link.source=nodeMap.get(link.from);
        link.target=nodeMap.get(link.to);
        link.width=link.fromWidth;
    })
    const link=mainG.append('g')
        .selectAll('g')
        .data(graph.links)
        .enter()
        .append('g');
    link.append("path")
    .attr("d",d3sankey.sankeyLinkHorizontal())
    .attr('stroke',(d,i)=>{
        return d3.interpolatePuOr(i / 9);
    })
    .attr('stroke-width',d=>Math.max(1,d.width))
    .attr("opacity",0.8)


}

axios.post("http://localhost:8989/pos", JSON.stringify(data)).then((res) => {
    console.log(res.data)
    render(res.data);
});

