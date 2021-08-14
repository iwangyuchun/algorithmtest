
const SankeyCircular=require("d3-sankey-circular")
const d3=require("d3");
import * as d3sankey from "d3-sankey";


// let nodes=[{
//     id:"a0",
// },
// {
//     id:"b1"
// },{
//     id:"c2"
// },{
//     id:"d3"
// },{
//     id:"e4"
// },{
//     id:"f5"
// }];
// let links=[{
//     source:"a0",target:"d3",value:1
// },
// {
//     source:"b1",target:"c2",value:1
// },
// {
//     source:"c2",target:"f5",value:1
// },
// {
//     source:"c2",target:"e4",value:1
// },
// {
//     source:"d3",target:"e4",value:1
// }
// ];
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
            source: "A",
            target: "D",
            value: 5
        }, {
            source: "A",
            target: "E",
            value: 3
        }, {
            source: "B",
            target: "D",
            value: 2
        }, {
            source: "B",
            target: "E",
            value: 2
        }, {
            source: "A",
            target: "F",
            value: 2
        }, {
            source: "D",
            target: "E",
            value: 2
        }, {
            source: "D",
            target: "F",
            value: 3
        }, {
            source: "E",
            target: "F",
            value: 4
        },{
            source:"F",
            target:"A",
            value:5
        } ,
        {
            source: "C",
            target: "E",
            value: 3
        },{
            source:"F",
            target:"B",
            value:2
        },{
            source:"F",
            target:"C",
            value:2
        }

    ]
}
// //console.log(graph);
// function left(node) {
//     return node.depth;
//   }
// // Sankey.sankey(graph);
// //console.log(Sankey);
// const sankey=new Sankey()
// sankey.nodeId(d=>{
//     return d.id;
// })
// sankey.nodeAlign(left)
// const ga=sankey(graph)

// console.log(ga.nodes);
// d3.forceSimulation()

const cirSankey=SankeyCircular.sankeyCircular()
cirSankey.nodeId(d=>{
    return d.id; 
})
.nodeWidth(10)
.nodePadding(20)
.size([800,600])
.iterations(32)

const graph=cirSankey(data);
render(graph);

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
    // const nodeMap=new Map();
    // graph.nodes.forEach((node)=>{
    //     nodeMap.set(node.id,node);
    // });

    // graph.links.forEach((link)=>{
    //     link.source=nodeMap.get(link.from);
    //     link.target=nodeMap.get(link.to);
    //     link.width=link.fromWidth;
    // })
    const link=mainG.append('g')
        .selectAll('g')
        .data(graph.links)
        .enter()
        .append('g');
    link.append("path")
    .attr("d",d=>d.path)//d3sankey.sankeyLinkHorizontal())
    .attr('stroke',(d,i)=>{
        return d3.interpolatePuOr(i / 9);
    })
    .attr('fill','none')
    .attr('stroke-width',d=>Math.max(1,d.width))
    .attr("opacity",0.8)


}
