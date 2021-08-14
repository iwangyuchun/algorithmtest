const d3 = require('d3');


let nodes = d3.range(100000).map(function (i) {
    return {
        index: i,
        key: i,
        id: i,
        state: false
    };
});

let links = d3.range(nodes.length - 1).map(function (i) {
    return {
        source: Math.floor(Math.sqrt(i)),
        target: i + 1,
        from: Math.floor(Math.sqrt(i)),
        to: i + 1,
    };
});

console.log("hhhh")

var simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(0).strength(1).iterations(5))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

const timeStart=Date.now();

let count=0;



simulation.on('tick',(number) => {

   count++;
   console.log(count,Date.now()-timeStart);
})