var data2 = [
    { "name": "Admitted students (7.62M)", "value": 76200},
    { "name": "Participants but failed (1.68M)", "value": 16800},
    { "name": "Non-participants (8.97M)", "value": 89700},
  ]
  
  var domain = data2.map(function(d){ return slugify(d.name); })
  var range = ["#dd383d","#efd046",  "#a0d0de"]
  var palette = d3.scale.ordinal().domain(domain).range(range);


  var chart2 = d3waffle()
                  .rows(15)
                  .scale(1/290/2)
                  .colorscale(palette)
                  .appearancetimes(function(d, i){ return i*10 + Math.random()*250;})
                  .height(300);
  
  d3.select("#chart-waffle-2")
    .datum(data2)
    .call(chart2); 