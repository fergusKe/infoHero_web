// (function($) {

  $(function() {
    getData(setChart);
  });

  /*案件類型直條圖*/
  function setChart(pData, pTaipeiAreaObj) {
    // console.log('pData = ', pData);
    // console.log('pTaipeiAreaObj = ', pTaipeiAreaObj);
    // console.log('locationParam = ', locationParam);
    var index = 0;
    var village, villageName;

    villageName = store.get('villageName');

    for ( var i = 0; i < pTaipeiAreaObj['全部'].length; i++ ) {
        if (pTaipeiAreaObj['全部'][i].properties.Substitute == villageName) {
          index = i;
        }
    }
    village = pTaipeiAreaObj['全部'][index];

    $('.area-name').text(village.properties.T_Name);
    $('.village-name').text(villageName);
    $('.village-num').text(village['各里總案件數']);

    console.log('villageName = ', villageName);

    chartType(village);
    chartGender(village);
    chartAge(village);

  }
  function chartType(pData) {
    // d3.csv("data/case_type.csv", stringToNum, function(pData) {
      var barWidth = 129;
      var old = pData['老人保護Rank'];
      var children = pData['兒少保護Rank'];
      var intimate = pData['親密關係Rank'];
      var other = pData['兄弟姊妹間暴力Rank'];
      var LowIncome = pData['低收Rank'];
      var disabled = pData['障礙Rank'];
      $('.rank-old .mark-icon').css({
        left: old / 100 * 129
      });
      $('.rank-children .mark-icon').css({
        left: children / 100 * 129
      });
      $('.rank-intimate .mark-icon').css({
        left: intimate / 100 * 129
      });
      $('.rank-other .mark-icon').css({
        left: other / 100 * 129
      });
      $('.rank-LowIncome .mark-icon').css({
        left: LowIncome / 100 * 129
      });
      $('.rank-disabled .mark-icon').css({
        left: disabled / 100 * 129
      });

      var data = [
        {type: '老人保護', value: +pData['老人保護']},
        {type: '兒少保護', value: +pData['兒少保護']},
        {type: '親密關係', value: +pData['親密關係']},
        {type: '其他家虐', value: +pData['兄弟姊妹間暴力']}
      ];

      var width = 130,
        height = 200,
        margin = {left: 85, top: 30, right: 30, bottom: 30},
        svg_width = width + margin.left + margin.right,
        svg_height = height + margin.top + margin.bottom;

      var scale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.value;})])
        .range([0, width]);

      var scale_y = d3.scale.ordinal()
        .domain(data.map(function(d) {return d.type;}))
        .rangeBands([0, height], 0.15);

      var svg = d3.select(".chart-type")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height);

      var chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      var x_axis = d3.svg.axis().scale(scale).ticks(5);
          y_axis = d3.svg.axis().scale(scale_y).orient("left");

      chart.append("g")
        .call(x_axis)
        .attr("transform", "translate(0, " + height + ")");
      chart.append("g")
        .call(y_axis);

      var bar = chart.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {
          return "translate(0, " + scale_y(d.type) + ")";
        });

      bar.append("rect")
        .attr({
          "width": function(d) {return scale(d.value)},
          "height": scale_y.rangeBand()
        })
        .style("fill", "#00bcd4");

      bar.append("text")
        .text(function(d) {return d.value})
        .attr({
          "x": function(d) {return scale(d.value)},
          "y": scale_y.rangeBand()/2,
          "dx": 5,
          "dy": 6,
          "text-anchor": "start"
        });

      // chartAnimate();

      function chartAnimate() {
        bar.select("rect")
          .transition()
          .duration(2500)
          .attr({
            "width": function(d) {return scale(d.value)}
          });

        bar.select("text")
          .transition()
          .duration(2500)
          .attr({
            'x': function(d) {
              return scale(d.value)
            }
          })
          .tween('number', function(d) {
            var i = d3.interpolateRound(0, d.value);
            return function(t) {
              this.textContent = i(t);
            };
          });
      }
    // });

  }
  function adjustVal(data) {
    var dataArr = [];
    var totalVal = 0;
    var maxVal = data[0].value;
    var maxIndex = 0;
    var difference = 0;
    for(var i = 0; i < data.length; i++) {
      dataArr.push(data[i].value);
      totalVal += data[i].value;
      if (data[i].value > maxVal) {
        maxIndex = i;
        maxVal = data[i].value;
      }
    }
    difference = 100 - totalVal;
    data[maxIndex].value += difference;
    return data;
  }
  function chartGender(pData) {
    var data = [
      {type: '男', value: Math.floor( +pData['男'] )},
      {type: '女', value: Math.floor( +pData['女'] )}
    ];
    data = adjustVal(data);

    var width = 130,
        height = 140,
        margin = {left: 50, top: 30, right: 30, bottom: 30},
        svg_width = width + margin.left + margin.right,
        svg_height = height + margin.top + margin.bottom;

    var scale = d3.scale.linear()
      .domain([0, d3.max(data, function(d) {return d.value;})])
      .range([height, 0]);

    var scale_x = d3.scale.ordinal()
      .domain(data.map(function(d) {return d.type;}))
      .rangeBands([0, width], 0.5);

    var svg = d3.select(".chart-gender")
      .append("svg")
      .attr("width", svg_width)
      .attr("height", svg_height);

    var chart = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var x_axis = d3.svg.axis().scale(scale_x);
      y_axis = d3.svg.axis().scale(scale).orient("left").ticks(5);

    chart.append("g")
      .call(x_axis)
      .attr("transform", "translate(0, " + height + ")");
    chart.append("g")
      .call(y_axis);

    var bar = chart.selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) {
        return "translate(" + scale_x(d.type) + ", 0)";
      });

    bar.append("rect")
      .attr({
        "y": function(d) {return scale(d.value)},
        "width": scale_x.rangeBand(),
        "height": function(d) {return height - scale(d.value)}
      })
      .style("fill", "#00bcd4");

    bar.append("text")
      .text(function(d) {return d.value})
      .attr({
        "y": function(d) {return scale(d.value)},
        "x": scale_x.rangeBand()/2,
        "dy": -5,
        "text-anchor": "middle"
      });
  }
  function chartAge(pData) {
      var data = [
        {type: '~18', value: Math.floor( +pData['小於18歲'] )},
        {type: '18~65', value: Math.floor( +pData['18到65歲'] )},
        {type: '65~', value: Math.floor( +pData['大於65歲'] )}
      ];
      data = adjustVal(data);

      var width = 130,
        height = 140,
        margin = {left: 50, top: 30, right: 30, bottom: 30},
        svg_width = width + margin.left + margin.right,
        svg_height = height + margin.top + margin.bottom;

      var scale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.value;})])
        .range([height, 0]);

      var scale_x = d3.scale.ordinal()
        .domain(data.map(function(d) {return d.type;}))
        .rangeBands([0, width], 0.3);

      var svg = d3.select(".chart-age")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height);

      var chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      var x_axis = d3.svg.axis().scale(scale_x);
        y_axis = d3.svg.axis().scale(scale).orient("left").ticks(5);

      chart.append("g")
        .call(x_axis)
        .attr("transform", "translate(0, " + height + ")");
      chart.append("g")
        .call(y_axis);

      var bar = chart.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {
          return "translate(" + scale_x(d.type) + ", 0)";
        });

      bar.append("rect")
        .attr({
          "y": function(d) {return scale(d.value)},
          "width": scale_x.rangeBand(),
          "height": function(d) {return height - scale(d.value)}
        })
        .style("fill", "#00bcd4");

      bar.append("text")
        .text(function(d) {return d.value})
        .attr({
          "y": function(d) {return scale(d.value)},
          "x": scale_x.rangeBand()/2,
          "dy": -5,
          "text-anchor": "middle"
        });
    }

// })(jQuery)
