import * as d3 from "d3";
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
        },{
            from:"F",
            to:"B",
            value:5,
        }

    ],
    layout: {
        name: "circle",
        params: {
            direction: 0,
            radius: 250,
            startAngle: 0,
            spacing: 10,
            viewSize: {
                width: 500,
                height: 500
            }
        }
    }
}
function render(graph) {
    const svg = d3.select('body').append('svg');
    svg.attr('width', 500)
        .attr('height', 500)
        

    const mainG = svg.append('g');
    const maxX = d3.max(graph.nodes, (d) => d.x);
    const minX = d3.min(graph.nodes, (d) => d.x);
    const maxY = d3.max(graph.nodes, d => d.y);
    const minY = d3.min(graph.nodes, d => d.y);
    const scaleX = d3.scaleLinear()
        .domain([minX, maxX])
        .range([5, 495]);
    const scaleY = d3.scaleLinear()
        .domain([minY, maxY])
        .range([5, 495]);
    const arc = d3.arc()
        .innerRadius(230)
        .outerRadius(250)

    const group = mainG.append('g')
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append('g')
        .attr("transform", "translate(250,250)")
    group.append("path")
        .attr("fill", "red")
        .attr("d", arc)
        .append("title")
        .text((d) => (d.id));
    const ribbon = d3.ribbon()
        .sourceRadius(230)
        .targetRadius(230)
        .padAngle(1 / 230);
    graph.links.forEach((link) => {

             link.source = {
                startAngle: link.startAngle1,
                endAngle:  link.endAngle1
            };
            link.target = {
                startAngle: link.startAngle2,
                endAngle: link.endlAngle2
            }
          
        });


    mainG.append("g")
        .attr("transform", "translate(250,250)")
        .selectAll("path")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("fill", (d, i) => {
           
            return d3.interpolatePuOr(i / 9);
        })
        .attr("opacity", 0.8)
        .attr("d", ribbon)
        .append("title")
        .text((d) => (d.from + d.to))





    mainG.selectAll('text')
        .data(graph.nodes)
        .enter()
        .append('text')
        .attr('x', (d) => {
            return scaleX(d.x);
        })
        .attr('y', (d) => {
            return scaleY(d.y);
        })
        .text((d) => d.id)


}

// axios.post("http://101.200.56.16:8088/pos", JSON.stringify(data)).then((res) => {
//     console.log(res.data);
//     render(res.data);
// });
axios.post("http://127.0.0.1:8989/pos", JSON.stringify(data)).then((res) => {
    console.log(res.data);
    render(res.data);
});


