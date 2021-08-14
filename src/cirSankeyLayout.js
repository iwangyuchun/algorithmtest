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
        },{
            from:"F",
            to:"A",
            value:5
        } ,
        {
            from: "C",
            to: "E",
            value: 3
        }

    ],
    layout: {
        name: "cirsankey",
        params: {
            direction: 0,
            layerSpacing:20,
            layerSpacing: 20,
            columnSpacing: 50,
            viewSize: {
                width: 1000,
                height: 500
            }
        }
    }
}

axios.post("http://localhost:8989/pos", JSON.stringify(data)).then((res) => {
    console.log(res.data)
    render(res.data);
});