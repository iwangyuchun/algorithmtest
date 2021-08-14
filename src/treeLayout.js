import * as d3 from "d3";
import axios from "axios";
const data = `{
    "nodes":[
        {
            "id":"001",
            "x":0,
            "y":0
        },
        {
            "id":"002",
            "x":0,
            "y":0
        },
        {
            "id":"003",
            "x":0,
            "y":0
        },
        {
            "id":"004",
            "x":0,
            "y":0
        }, 
        {
            "id":"005",
            "x":0,
            "y":0
        }
        , 
        {
            "id":"006",
            "x":0,
            "y":0
        }
        , 
        {
            "id":"007",
            "x":0,
            "y":0
        },{
          "id":"008"
        }
    ],
  "links": [
    {
      "from": "001",
      "to": "002"
    },
    {
      "from": "001",
      "to": "003"
    },
    {
      "from": "002",
      "to": "004"
    },
    {
      "from": "002",
      "to": "005"
    },
    {
      "from": "003",
      "to": "006"
    },
    {
      "from": "003",
      "to": "007"
    },{
      "from":"003",
      "to":"008"
    }
  ],
  "layout": {
    "name": "tree",
    "params": {
      "nodeSpacing":20,
      "layerSpacing":20,
      "angle":0,
      "alignment":0,
      "viewSize": {
        "width": 500,
        "height": 500
      }
    }
  }
}`;

function render(graph) {
    const svg = d3.select('body').append('svg');
    svg.attr('width', 600)
        .attr('height', 600)


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

axios.post("http://localhost:8989/pos", JSON.stringify(JSON.parse(data))).then((res) => {
    console.log(res.data)
    render(res.data);
});