import * as d3 from "d3";
import axios from "axios";


axios.get("/src/example700.json").then(res=>{
    const nodes=res.data.nodes;
    const links=res.data.links;
    const linksMap=new Map();
    const resLinks=[];
    links.forEach(link=>{
        if(!linksMap.has(link.from+"_"+link.to)&&!linksMap.has(link.to+"_"+link.from)){
           
            linksMap.set(link.from+"_"+link.to,{from:link.from,to:link.to,value:1});
        }else{
            if(linksMap.has(link.from+"_"+link.to)){
                linksMap.get(link.from+"_"+link.to).value++;
            }else{
                linksMap.get(link.to+"_"+link.from).value++;
            }
        }
    });
    for(const key of linksMap.keys()){
        resLinks.push(linksMap.get(key));
    }
    const data={
        nodes:nodes,
        links:resLinks,
        layout: {
            name: "circle",
            params: {
                direction: 0,
                radius: 500,
                startAngle: 0,
                spacing: 10,
                viewSize: {
                    width: 1000,
                    height: 1000
                }
            }
        }
    }
    axios.post("http://127.0.0.1:8989/pos", JSON.stringify(data)).then((res) => {
    console.log(res.data);
    render(res.data);
});

})
function render(graph) {

    console.log(graph.nodes.length);
    console.log(graph.links.length);
    const svg = d3.select('body').append('svg');
    const width=1000;
    const height=1000
    svg.attr('width', width)
        .attr('height', height)
        

    const mainG = svg.append('g');
    const maxX = d3.max(graph.nodes, (d) => d.x);
    const minX = d3.min(graph.nodes, (d) => d.x);
    const maxY = d3.max(graph.nodes, d => d.y);
    const minY = d3.min(graph.nodes, d => d.y);
    const scaleX = d3.scaleLinear()
        .domain([minX, maxX])
        .range([5, width-5]);
    const scaleY = d3.scaleLinear()
        .domain([minY, maxY])
        .range([5, height-5]);
    const arc = d3.arc()
        .innerRadius(width/2-20)
        .outerRadius(width/2)

    const group = mainG.append('g')
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append('g')
        .attr("transform", `translate(${width/2},${height/2})`)
    group.append("path")
        .attr("fill", (d,i)=>{
            return d3.interpolateSpectral(i/graph.links.length)
        })
        .attr("d", arc)
        // .append("title")
        // .text((d) => (d.id));
    const ribbon = d3.ribbon()
        .sourceRadius(width/2-20)
        .targetRadius(height/2-20)
        .padAngle(1 / (width-20));
        d3.sort(graph.links,(d)=>d.value);
        console.log(graph.links[0])
    graph.links.forEach((link) => {

             link.source = {
                startAngle:link.endAngle1,
                endAngle:   link.startAngle1,
            };
            link.target = {
                startAngle: link.endlAngle2, 
                endAngle:link.startAngle2,
            }
          
        });


    mainG.append("g")
        .attr("transform", `translate(${width/2},${height/2})`)
        .selectAll("path")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("fill", (d, i) => {
           
            return d3.interpolateSpectral(i/graph.links.length)
        })
        .attr("opacity", 0.8)
        .attr("d", ribbon)
       //.append("title")
       // .text((d) => (d.from + d.to))





    // mainG.selectAll('text')
    //     .data(graph.nodes)
    //     .enter()
    //     .append('text')
    //     .attr('x', (d) => {
    //         return scaleX(d.x);
    //     })
    //     .attr('y', (d) => {
    //         return scaleY(d.y);
    //     })
       // .text((d) => d.id)
}



