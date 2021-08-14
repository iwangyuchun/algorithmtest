//import * as sankey from "d3-sankey";
import * as d3 from "d3"
import axios from "axios";
// let nodes=new Array();
// let links=new Array();
// for(let i=0;i<10000;i++){
//     nodes.push({
//         id:i+""
//     });
//     let fromId=Math.floor(Math.random()*10000)+"";
//     let toId=Math.floor(Math.random()*10000)+"";
//     while(fromId===toId){
//         toId=Math.floor(Math.random()*10000)+"";
//     }
//     links.push({
//         from:fromId,
//         to:toId
//     })

// }
// let nodes = d3.range(10000).map(function (i) {
//   return {
//     index: i,
//     key: i,
//     id: i,
//     fill: "#dddddd",
//     img: "https://avatar-static.segmentfault.com/333/685/3336855448-5e47cd160e991_big64",
//     font_size: "12",
//     stroke: "#dddddd",
//     text: "张三的一张卡",
//     state: false
//   };
// });

// let links = d3.range(nodes.length - 1).map(function (i) {
//   return {
//     source: Math.floor(Math.sqrt(i)),
//     target: i + 1,
//     from: Math.floor(Math.sqrt(i)),
//     stroke: "#ccc",
//     text: "交易发生了5000万",
//     to: i + 1,
//   };
// })
// axios.get("/src/example700.json").then(res => {
//   let links = res.data.links;
//   console.log(res.data.links.length);
//   console.log(res.data.nodes.length);
//   links.forEach(link=>{
//     link.source=link.from;
//     link.target=link.to;
//   })
//   let nodes = res.data.nodes;
//   main(links, nodes);
// })
async function loadData() {
  const linkData = await d3.csv("/data/links.csv")
  const nodeData = await d3.csv("/data/nodes.csv")
  const nodeIdMap = new Map()
  nodeData.forEach(v => {
    v.id = v.KEY.trim()
    nodeIdMap.set(v.id, v)
  })
  let sum = 0;
  linkData.forEach(v => {
    v.FROM = v.FROM.trim()
    v.TO = v.TO.trim()
    if (!nodeIdMap.has(v.FROM)) {

      const tempNode = { id: v.FROM }
      nodeData.push(tempNode)
      nodeIdMap.set(v.FROM, tempNode)
      sum++;
    }
    if (!nodeIdMap.has(v.TO)) {
      const tempNode = { id: v.TO }
      nodeData.push(tempNode)
      nodeIdMap.set(v.TO, tempNode)
      sum++;
    }
    v.source = v.FROM;
    v.target = v.TO;
  })

  const graph = {
    nodes: nodeData,
    links: linkData
  }
  //const {data:layoutedData}=await axios.post("http://127.0.0.1:8989/pos",graph)
  main(graph)
}
loadData()
function main({ links, nodes }) {
  const svg = d3.select('body').append('svg');
  svg.attr('width', 1000)
    .attr('height', 1000)
  let mainG = null;
  var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-1))
    .force("link", d3.forceLink(links).distance(0).id(d=>d.id))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    //.force("collide",d3.forceCollide().radius(4))
    .on("tick", render);


  function render() {



    let maxX = d3.max(nodes, (d) => d.x);
    let maxY = d3.max(nodes, d => d.y);
    let minX = d3.min(nodes, d => d.x);
    let minY = d3.min(nodes, d => d.y);

    const scaleX = d3.scaleLinear().domain([minX, maxX]).range([0, 800]);
    const scaleY = d3.scaleLinear().domain([minY, maxY]).range([0, 800]);

    if (mainG !== null) {
      mainG.remove()
    }
    mainG = svg.append('g');


    mainG.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr("x2", d => {
        return scaleX(d.target.x);
      })
      .attr('y2', d => {

        return scaleY(d.target.y);
      })
      .attr('x1', d => {

        return scaleX(d.source.x);
      })
      .attr("y1", d => {

        return scaleY(d.source.y);
      })
      .attr('stroke', "#999")
      .attr("stroke-width", 2);
    mainG.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', (d) => {
        return scaleX(d.x);
      })
      .attr('cy', (d) => {
        return scaleY(d.y);
      })
      .attr('r', 4)
      .attr('fill', 'red');


  }
}



