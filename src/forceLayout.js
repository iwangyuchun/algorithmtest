import * as d3 from "d3"
import axios from "axios";

let nodes = d3.range(5000).map(function (i) {
  return {
    index: i,
    key: i,
    id: i,
    // fill: "#dddddd",
    // img: "https://avatar-static.segmentfault.com/333/685/3336855448-5e47cd160e991_big64",
    // font_size: "12",
    // stroke: "#dddddd",
    // text: "张三的一张卡",
    state: false
  };
});

let links = d3.range(nodes.length - 1).map(function (i) {
  return {
    source: Math.floor(Math.sqrt(i)),
    target: i + 1,
    from: Math.floor(Math.sqrt(i)),
    // stroke: "#ccc",
    // text: "交易发生了5000万",
    to: i + 1,
  };
});
axios.get("/src/asdata.json").then(res=>{
  console.log(res.data)
})

let layout = {
  name: "force",
  params: {
    electricalCharge: -1,
    springStiffness: 1,
    springLength: 1,
    maxIterations: 50,
    epsilonDistance: 50,
    infinityDistance: 100,
    nodeSpacing: 20,
    viewSize: {
      width: 1000,
      height: 1000
    }
  }
}
// let layout = {
//   name: "force",
//   params: {
//     electricalCharge: -15,
//     springStiffness: 1,
//     springLength: 1,
//     maxIterations: 5,
//     epsilonDistance: 100,
//     infinityDistance: 50,
//     nodeSpacing: 20,
//     viewSize: {
//       width: 1000,
//       height: 1000
//     }
//   }
let graph1 = {
  nodes: nodes,
  links: links,
  layout: layout
}

axios.post("http://127.0.0.1:8989/pos", graph1).then((res) => {
  console.log("finished");
 // console.log(res.data)
  render(res.data);
})


function render({ links, nodes }) {


  const svg = d3.select('body').append('svg');
  let maxX = d3.max(nodes, (d) => d.x/100);
  let maxY = d3.max(nodes, d => d.y/100);
  let minX = d3.min(nodes, d => d.x/100);
  let minY = d3.min(nodes, d => d.y/100);
  console.log(maxX - minX);
  console.log(maxY - minY);
  const scaleX = d3.scaleLinear().domain([minX, maxX]).range([0, 2000]);
  const scaleY = d3.scaleLinear().domain([minY, maxY]).range([0, 1800]);
  svg.attr('width', 2000)
    .attr('height', 1800)


  const mainG = svg.append('g');

  mainG.selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr("x2", d => {

      return scaleX(d.toPos.x / 100);
    })
    .attr('y2', d => {

      return scaleY(d.toPos.y / 100);
    })
    .attr('x1', d => {

      return scaleX(d.fromPos.x / 100);
    })
    .attr("y1", d => {

      return scaleY(d.fromPos.y / 100);
    })
    .attr('stroke', "#999")
    .attr("stroke-width", 2);

  mainG.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('cx', (d) => {

      return scaleX(d.x / 100);
    })
    .attr('cy', (d) => {

      return scaleY(d.y / 100);
    })
    .attr('r', 4)
    .attr('fill', 'red');

}

