library(htmltools)

browsable(
  tags$html(
    tags$head(
      tags$script(src="https://cdn.plot.ly/plotly-latest.js")
    ),
    tags$body(
      tags$script(
'
var d3 = Plotly.d3;
var gd = d3.select("body").append("div");

var x = [1,2,3,4,5];

Plotly.plot(gd.node(), [{x:x, y:x}]);
'        
      )
    )
  )
)