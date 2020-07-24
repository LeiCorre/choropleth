import React from 'react';
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import './App.css';
import * as topojson from "topojson-client";
import { style } from 'd3';

const require = new XMLHttpRequest()
  require.open("GET", "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
  require.send()
  require.onload = function () {
    let map = JSON.parse(require.responseText)

  require.open("GET", "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
  require.send()
  require.onload = function () {
    let data = JSON.parse(require.responseText)
    
    let map2 = topojson.feature(map, map.objects.counties).features // https://forum.freecodecamp.org/t/d3-topojson-feature-explanation/235396
    d3.select('.App')
      .append('H1')
      .text('US Post Secondary Education Levels')
      .attr('id', 'title')
      .style('margin-top', '10px')

    d3.select('.App')
      .append('H4')
      .text('Percentage of Adults Age 25+, Holding a Bachelors Degree or Higher')
      .attr('id', 'description')
      .style('margin-top', '-10px')

    const w = 1000
    const h = 600

    const svg = d3.select('.App')
                  .append('svg')
                  .attr('height', h)
                  .attr('width', w)
                  .style('margin-top', '-60px');
                  
                  

    svg.selectAll('path')  
       .data(map2) 
       .enter()
       .append('path')   
       .attr('d', d3.geoPath())
       .attr('id', i => i.id)
       .attr('data-fips', i => i.id)
       .attr('class', 'county')
       .attr('xCoord', i => (document.getElementById(i.id).getBoundingClientRect().x -w-180) + 'px') // Got clues as to using getBoundingClientRect() from here https://www.digitalocean.com/community/tutorials/js-getboundingclientrect
       .attr('yCoord', i => (document.getElementById(i.id).getBoundingClientRect().y -90) + 'px');
       
       
    data.forEach(e=> document.getElementById(e['fips'])
                             .setAttribute('data-education', e["bachelorsOrHigher"])
                             ) 
    data.forEach(e=> document.getElementById(e['fips'])                   
                             .setAttribute('area', e["area_name"])
                             )                    
    data.forEach(e=> document.getElementById(e['fips'])
                             .setAttribute('state', e['state'])
                             )  

   let info = d3.select('.App')
                  .append('div')
                  .style('height', "20px")
                  
                  .style('background-color', 'rgb(63,63,64,0.8')
                  .style('padding', "5px 10px")
                  .style('border-radius', '5%')
                  .style('color', 'white')
                  .style('font-size', '12px')
                  .style('display', 'none')
                  .style('position', 'absolute') 
                  .attr('id', 'tooltip') //inspired by the last answer on this post (https://www.freecodecamp.org/forum/t/d3-tooltip-wanted-is-that-15-chars-now/92398/6)
                  
                  

      svg.selectAll('path') 
         .style('fill', e=> 
          
              document.getElementById(e['id']).getAttribute('data-education') >56? "hsl(220,100%,50%)" 
            : document.getElementById(e['id']).getAttribute('data-education') >49? "hsl(220,100%,56%)" 
            : document.getElementById(e['id']).getAttribute('data-education') >42? "hsl(220,100%,62%)" 
            : document.getElementById(e['id']).getAttribute('data-education') >35? "hsl(220,100%,69%)" 
            : document.getElementById(e['id']).getAttribute('data-education') >28? "hsl(220,100%,75%)" 
            : document.getElementById(e['id']).getAttribute('data-education') >21? "hsl(220,100%,81%)" 
            : document.getElementById(e['id']).getAttribute('data-education') >14? "hsl(220,100%,87%)" 
            : document.getElementById(e['id']).getAttribute('data-education') >7? "hsl(220,100%,93%)" 
            : "white" )
         .on('mouseover', function(e) {
           info = info.style('display', 'inline')
                      .attr('data-education', this.getAttribute('data-education'))
                      .style('transform', i => 'translate(' + this.getAttribute('xCoord') + ',' + this.getAttribute('yCoord') +')')
                      .html('<div>' + this.getAttribute('area') + ', ' + this.getAttribute('state') + ': ' + this.getAttribute('data-education') + '% </div>')
                     
         }) 
         .on('mouseout', function (e) {
          info = info.style('display', 'none')
        });

     const leg = [1,2,3,4,5,6,7,8]

     const legend = d3.select('.App') //Took my legend from my Heat Map and altered it
                      .append('svg')
                      .attr('height', 40)
                      .attr('width', 247)
                      .attr('id', 'legend')
                      .style('margin-top', "-40px")
                      .style('text-align', 'center')
                      .attr("transform", "translate(-150,0)")

    legend.selectAll('rect')
                      .data(leg) 
                      .enter()
                      .append('rect') 
                      .attr('height', 15)
                      .attr('width', 30)
                      .attr('x', i => -22.5 + i*30)
                      .style('fill', i => i===8? 'hsl(220,100%,50%)' : i===7? "hsl(220,100%,56%)" : i===6? "hsl(220,100%,62%)" : i===5? "hsl(220,100%,68%)" : i==4? "hsl(220,100%,75%)" : i===3? "hsl(220,100%,81%)" : i===2? "hsl(220,100%,87%)" : "hsl(220,100%,93%)")                 
      
    const lScale = d3.scaleLinear()
                      .domain([1,9])
                      .range([7,247])
    

  const lA = d3.axisBottom(lScale)
               .ticks(9)
               .tickFormat(i=> i===1? "7%" : i===2? "14%" : i===3? "21%" : i===4? "28%": i===5? "35%" : i===6? '42%' : i===7? '49%' : i===8? '56% +' : '')
               .tickSize(30,0) // looked here for changing ticksize https://stackoverflow.com/questions/21583032/custom-tick-size-on-axis-d3js

  legend.append('g')
     .attr('id', 'leg-axis')
     .attr("transform", "translate(0,-4)")
     .call(lA)     
                      

  }
  }
function App() {
  return (
    <div className="App">
      

    <div></div>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById('root'))
export default App;
