var names = [
  "input",
  "output",
  "sigmoid",
  "tanh",
  "identity",
  "hlim",
  "relu",
  "softsign",
  "sinusoid",
  "gaussian"
];

var colorTable = [
  '#2124FF', // input
  '#FF2718', // output
  '#1F22C1', // logistic sigmoid
  '#EE8A2A', // tanh
  '#B17516', // identity
  '#B1B0AA', // hlim
  '#2CB11F', // relu
  '#C5B12C', // softsign
  '#E685E7',  // sinusoid
  '#257580',  // gaussian
];

var width = $('.xor').width();
var height = $('.xor').height();
var nodeRadius = 7;
var repelForce = 10;

var d3cola = cola.d3adaptor()
      .avoidOverlaps(true)
      .size([width,height]);

var drawGraph = function(graph, panel) {
    svg = d3.select(panel);

    d3.selectAll(panel + "> *").remove();

    // define arrow markers for graph links
    svg.append('svg:defs').append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#337ab7');

    graph.nodes.forEach(function (v) { v.height = v.width = 2 * nodeRadius; });

    d3cola
        .nodes(graph.nodes)
        .links(graph.links)
        .constraints(graph.constraints)
        .symmetricDiffLinkLengths(repelForce)
        .linkDistance(80)
        .start(10, 15, 20);

    var path = svg.selectAll(".link")
        .data(graph.links)
        .enter().append('svg:path')
        .attr('class', 'link')
        .style("stroke-width", function (d) { return 1.5 + Math.sqrt(d.weight * 5); });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return nodeRadius; })
        .style("fill", '#337ab7')
        .call(d3cola.drag);

    node.append("title")
        .text(function (d) { return d.id; });

    var label = svg.selectAll(".label")
          .data(graph.nodes)
          .enter().append("text")
          .attr("class", "label")
          .text(function (d) { return "(" + d.id + ") " + names[d.type]; })
          .call(d3cola.drag)

    d3cola.on("tick", function () {
        // draw directed edges with proper padding from node centers
        path.attr('d', function (d) {
            var deltaX = d.target.x - d.source.x,
                deltaY = d.target.y - d.source.y,
                dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                normX = deltaX / dist,
                normY = deltaY / dist,
                sourcePadding = nodeRadius,
                targetPadding = nodeRadius + 2,
                sourceX = d.source.x + (sourcePadding * normX),
                sourceY = d.source.y + (sourcePadding * normY),
                targetX = d.target.x - (targetPadding * normX),
                targetY = d.target.y - (targetPadding * normY);
            return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
        });

        node.attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })

        label
          .attr("x", function (d) { return d.x + 10; })
          .attr("y", function (d) { return d.y - 10; });
    });
};
