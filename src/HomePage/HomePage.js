import { useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import * as d3 from "d3";

function HomePage() {
  const chartRef = useRef(null); 
  const d3ChartRef = useRef(null); 

  const dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#ffcd56",
          "#ff6384",
          "#36a2eb",
          "#fd6b19",
          "#6e7abb",
          "#95e982",
          "#b839d8",
          "#808080",
        ],
      },
    ],
    labels: [],
  };

  function createChart() {
    const ctx = chartRef.current.getContext("2d");
    if (window.myPieChart) {
      window.myPieChart.destroy();
    }
    window.myPieChart = new Chart(ctx, {
      type: "pie",
      data: dataSource,
    });
  }

  function getBudget() {
    axios.get('/myBudget.json').then(function (res) {
      const budgetData = res.data.myBudget;
  
      // Reset the dataSource to avoid duplications
      dataSource.datasets[0].data = [];
      dataSource.labels = [];
  
      // Populate Chart.js data
      budgetData.forEach(item => {
        dataSource.datasets[0].data.push(item.value);
        dataSource.labels.push(item.title);
      });
  
      createChart(); // Create Chart.js chart
  
      // Update D3 chart
      updateD3Chart(budgetData);
    }).catch(err => console.error("Error fetching data", err));
  }
  

  function updateD3Chart(data) {
    var width = 400;
    var height = 400;
    var margin = 40
    var radius = Math.min(width, height) / 2 - margin;
    var donutWidth = 75;
    var color = d3.scaleOrdinal()
        .range(["#ffcd56", "#ff6384", "#36a2eb", "#fd6b19", "#ffe633", "#74ff33", "#da33ff"]);


    var svg = d3.select(d3ChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
          ',' + (height / 2) + ')');

  var arc = d3.arc()
      .innerRadius(radius- donutWidth)
      .outerRadius(radius);

  var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

  var pie = d3.pie()
      .value(function (d) {
          return d.value;
      })
      .sort(null);

  var data_points = pie(data)
  console.log(data_points)

  var path = svg.selectAll('allSlices')
      .data(data_points)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d, i) {
          return color(d.data.title);
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .attr('transform', 'translate(0, 0)')

  var allPolylines = svg.selectAll('allPolylines')
      .data(data_points)
      .enter()
      .append('polyline')
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function (d) {
          var posA = arc.centroid(d) // line insertion in the slice
          var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
          var posC = outerArc.centroid(d); // Label position = almost the same as posB
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC]
      })

  var labels = svg
      .selectAll('allLabels')
      .data(data_points)
      .enter()
      .append('text')
      .text(function (d) { console.log(d.data.title); return d.data.title })
      .attr('transform', function (d) {
          var pos = outerArc.centroid(d);
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
      })
      .style('text-anchor', function (d) {
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          return (midangle < Math.PI ? 'start' : 'end')
      })


  }

  useEffect(() => {
    getBudget();
  }, []);

  return (
    <main className="center" id="main">
      <section className="page-area">
        <article>
          <h1>Stay on track</h1>
          <p>Do you know where you are spending your money? If you really stop to track it down, you would get surprised! Proper budget management depends on real data... and this app will help you with that!</p>
        </article>

        <article>
          <h1>Alerts</h1>
          <p>What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.</p>
        </article>

        <article>
          <h1>Results</h1>
          <p>People who stick to a financial plan, budgeting every expense, get out of debt faster! Also, they live happier lives... since they expend without guilt or fear... because they know it is all good and accounted for.</p>
        </article>

        <article>
          <h1>Free</h1>
          <p>This app is free!!! And you are the only one holding your data!</p>
        </article>
          <article>
            <h1>Chart</h1>
            <canvas ref={chartRef} id="myChart" width="200" height="0"></canvas>
          </article>

          <article>
            <h1>D3.js Chart</h1>
            <svg ref={d3ChartRef} width="600" height="400"></svg>
          </article>
      </section>
    </main>
  );
}

export default HomePage;
