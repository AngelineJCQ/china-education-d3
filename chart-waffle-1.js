var data2 = [
    { "name": "Admitted students (0.67M)", "value": 6700},
    { "name": "Participants but failed (2.05M)", "value": 20500},
    { "name": "Non-participants (24.38M)", "value": 243800},
  ]
  
  var domain = data2.map(function(d){ return slugify(d.name); })
  var range = ["#c7d4b6", "#a3aabd", "#a0d0de", "#97b5cf"]
  var palette = d3.scale.ordinal().domain(domain).range(range);


  var chart2 = d3waffle()
                  .rows(15)
                  .scale(1/290/2)
                  .colorscale(palette)
                  .appearancetimes(function(d, i){ return i*10 + Math.random()*250;})
                  .height(300);
  
  d3.select("#chart-waffle-1")
    .datum(data2)
    .call(chart2); 