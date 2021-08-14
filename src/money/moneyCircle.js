import * as d3 from "d3";
import axios from "axios";
async function loadData() {
    const linkData = await d3.csv("/data/links.csv")
    const nodeData = await d3.csv("/data/nodes.csv")
    const nodeIdMap = new Map()
    nodeData.forEach(v => {
        v.id = v.KEY.trim()
        nodeIdMap.set(v.id, v)
    })
    
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
    //参数
    let layout = {
        name: "circle",
        params: {
            direction: 0,
            radius: 750,
            startAngle: 0,
            spacing: 10,
            viewSize: {
                width: 1500,
                height: 1500
            }
        }
    }

    const linksMap = new Map();
    const resLinks = [];
    linkData.forEach(link => {
        if (!linksMap.has(link.from + "_" + link.to) && !linksMap.has(link.to + "_" + link.from)) {

            linksMap.set(link.from + "_" + link.to, { from: link.from, to: link.to, value: 1 });
        } else {
            if (linksMap.has(link.from + "_" + link.to)) {
                linksMap.get(link.from + "_" + link.to).value++;
            } else {
                linksMap.get(link.to + "_" + link.from).value++;
            }
        }
    });
   
    for (const key of linksMap.keys()) {
        
        resLinks.push(linksMap.get(key));
    }

    const graph = {
        layout,
        nodes: nodeData,
        links: resLinks
    }
    const { data: layoutedData } = await axios.post("http://127.0.0.1:8989/pos", graph)
    render(layoutedData)
}

loadData()


function render(graph) {

    console.log(graph.nodes.length);
    console.log(graph.links.length);
    const svg = d3.select('body').append('svg');
    const width = 1500;
    const height = 1500
    svg.attr('width', width)
        .attr('height', height)


    const mainG = svg.append('g');
    const maxX = d3.max(graph.nodes, (d) => d.x);
    const minX = d3.min(graph.nodes, (d) => d.x);
    const maxY = d3.max(graph.nodes, d => d.y);
    const minY = d3.min(graph.nodes, d => d.y);
    const scaleX = d3.scaleLinear()
        .domain([minX, maxX])
        .range([5, width - 5]);
    const scaleY = d3.scaleLinear()
        .domain([minY, maxY])
        .range([5, height - 5]);
    const arc = d3.arc()
        .innerRadius(width / 2 - 20)
        .outerRadius(width / 2)

    const group = mainG.append('g')
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append('g')
        .attr("transform", `translate(${width / 2},${height / 2})`)
    group.append("path")
        .attr("fill", (d, i) => {
            return d3.interpolateSpectral(i / graph.links.length)
        })
        .attr("d", arc)
        .append("title")
        .text((d) => (d.id));
    const ribbon = d3.ribbon()
        .sourceRadius(width / 2 - 20)
        .targetRadius(height / 2 - 20)
        .padAngle(1 / (width - 20));
    d3.sort(graph.links, d => d.value)
    console.log(graph.links[0]);
    graph.links.forEach((link) => {

        link.source = {
            startAngle: link.endAngle1,
            endAngle: link.startAngle1,
        };
        link.target = {
            startAngle: link.endlAngle2,
            endAngle: link.startAngle2,
        }

    });

    const maxValue = d3.max(graph.links, d => d.value)
    let isOver = false
    const paths = mainG.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("path")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("fill", (d, i) => {
            d.color = d3.interpolateBlues(i / graph.links.length)
            return d3.interpolateBlues(i / graph.links.length)
        })
        .attr("opacity", d => d.value / maxValue)
        .attr("d", ribbon)
        .on("mouseover", (e, da) => {
        })
        .append("title")
        .text((d) => (d.from + " " + d.to + " " + d.value))

}



