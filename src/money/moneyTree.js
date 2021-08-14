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
    const bfsRes = BFS(nodeData, linkData);
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
    const graph = {
      layout,
      nodes: bfsRes.nodes,
      links: bfsRes.links
    }
    
    const { data: layoutedData } = await axios.post("http://127.0.0.1:8989/pos", graph)
    render(layoutedData)
}

loadData()
function BFS(nodes, links) {
    const neborTable = new Map();

    const tagMap = new Map();
    const nodeMap = new Map();
    let nodeRes = [];
    let linkRes = [];
    nodes.forEach((node) => {
        nodeMap.set(node.id, node);
        neborTable.set(node.id, [])
    });
    links.forEach(link => {
        if (neborTable.has(link.from)) {
            neborTable.get(link.from).push(link.to);
        }
    })
    let index=0;
    let maxNum=0;
    let numArr=[];
    let resNode=[];
    let resLink=[];
    //从每一个结点BFS选择一个结点最多的
    for (let i = 0; i < nodes.length; i++) {
        const queue = [nodes[i].id];
        tagMap.set(nodes[i].id, 1);
        nodeRes.push(nodeMap.get(nodes[i].id));
        while (queue.length > 0) {
            const fromNode = queue.shift();

            neborTable.get(fromNode).forEach(toNode => {
                if (!tagMap.has(toNode)) {
                    tagMap.set(toNode, 1);
                    queue.push(toNode);
                    nodeRes.push(nodeMap.get(toNode));
                    linkRes.push({
                        from: fromNode,
                        to: toNode
                    })
                }
            })
        }
        tagMap.clear()
        if(nodeRes.length>maxNum){
            index=i;
            maxNum=nodeRes.length;
            resNode=nodeRes;
            resLink=linkRes;
            
        }
        if(nodeRes.length>2){
            numArr.push(nodeRes.length);
        }
        nodeRes=[];
        linkRes=[];
        
    }
    
    return {
        nodes: resNode,
        links: resLink
    }

}

function render(graph) {
    const svg = d3.select('body').append('svg');
    svg.attr('width', 1500)
        .attr('height', 1200)


    const mainG = svg.append('g')
        .attr("transfrom", "translate(10,10)")
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