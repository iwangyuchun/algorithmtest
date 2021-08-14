import * as d3 from "d3"
import axios from "axios";




async function loadData() {
  const linkData = await d3.csv("/data/links.csv")
  const nodeData = await d3.csv("/data/nodes.csv")
  const nodeIdMap = new Map()
  nodeData.forEach(v => {
    v.id = v.KEY.trim()
    nodeIdMap.set(v.id, v)
  })
  //预处理添加缺少的node
  linkData.forEach(v => {
    v.FROM = v.FROM.trim()
    v.TO = v.TO.trim()
    if (!nodeIdMap.has(v.FROM)) {

      const tempNode = { id: v.FROM }
      nodeData.push(tempNode)
      nodeIdMap.set(v.FROM, tempNode)
    
    }
    if (!nodeIdMap.has(v.TO)) {
      const tempNode = { id: v.TO }
      nodeData.push(tempNode)
      nodeIdMap.set(v.TO, tempNode)
    
    }
    v.from = v.FROM;
    v.to = v.TO;
  })
  //力导参数
  let layout = {
    name: "force",
    params: {
      electricalCharge: -50,
      springStiffness: 1,
      springLength: 0.0,
      maxIterations: 200,
      epsilonDistance: 0,
      infinityDistance: 100,
      nodeSpacing: 20,
      viewSize: {
        width: 2000,
        height: 2000
      }
    }
  }

  const graph = {
    layout,
    nodes: nodeData,
    links: linkData
  }
  const { data: layoutedData } = await axios.post("http://127.0.0.1:8989/pos", graph)
  render(layoutedData)
}

loadData()


function render({ links, nodes }) {


  const svg = d3.select('body').append('svg');
  let maxX = d3.max(nodes, (d) => d.x / 100);
  let maxY = d3.max(nodes, d => d.y / 100);
  let minX = d3.min(nodes, d => d.x / 100);
  let minY = d3.min(nodes, d => d.y / 100);
  console.log(maxX - minX);
  console.log(maxY - minY);
  const scaleX = d3.scaleLinear().domain([minX, maxX]).range([0, 800]);
  const scaleY = d3.scaleLinear().domain([minY, maxY]).range([0, 800]);
  svg.attr('width', 1000)
    .attr('height', 1000)


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

