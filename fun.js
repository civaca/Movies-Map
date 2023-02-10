document.addEventListener("DOMContentLoaded",()=>{
fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json")
.then(response=>response.json())
.then(dataset=>{

//constants
const w=995;
const h1=510;
const categories=["Action","Comedy","Drama","Family","Biography", "Adventure","Animation"]
const w2=60

//scales
const colorScale=d3.scaleOrdinal().domain(categories)
.range(['#99CCFF','#0066CC',  '#CCE5FF', '#FFFF99','#FF9933','#FFB266','#FF3333'])
//svg of tree
const svg=d3.select("body")
            .append("svg")
            .attr("width",w)
            .attr("height",h1)
            
//tooltip

const tooltip=d3.select("body")
                .append("div")
                .attr("id","tooltip")
//creatin tree hierchary

const treeMap=d3.treemap().size([w,h1])
const root=d3.hierarchy(dataset)
            .sum((d)=>d.value)
           

treeMap(root)

//tree cells
const cell=  svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr('class', 'group')
        .attr('transform',(d)=> 
             'translate('+ [d.x0, d.y0] + ')'
          );

//creating cells
cell.append("rect")
    .attr('width',d=>d.x1 - d.x0)//children node-parent node
    .attr('height',d=>d.y1 - d.y0)
    .attr("class","tile")
    .attr("fill",d=>colorScale(d.data.category)  )
    .attr("data-name",d=>d.data.name)
    .attr("data-category",d=>d.data.category)
    .attr("data-value",d=>d.value)
    .on("mouseenter",(event,d)=>{
        tooltip.style("visibility","visible")
            .attr("data-value",d.data.value)
            .style("top",event.pageY+"px")
            .style("left",event.pageX+"px")
            .html(
                "<p>"+d.data.name+"</p>"+
                "<p>$"+((d.data.value/1000000).toFixed(2))+" M</p>"
            )
  })
  .on("mouseleave",(event,d)=>{
    tooltip.style("visibility","hidden")
  })

cell.append("text")
        .selectAll("tspan")
        .data(d=>d.data.name.split(" "))
        .enter()
        .append("tspan")
        .attr("x",2)
        .attr("y",(d,i)=>10+i*8)
        .text(d=>d)
    

// legends
const legend=d3.select("body")
                .append("svg")
                .attr("id","legend")
                .attr('transform',"translate(200,0)")
                .selectAll("g")
                .data(categories)
                .enter()
                .append("g")

            legend.append("rect")
                .attr("x",(d,i)=>i*w2)
                .attr("y",0)
                .attr("width",w2)
                .attr("height",20)
                .attr('class',"legend-item")
                .attr("fill",d=>colorScale(d))
               
            legend.append('text')
                .attr("class","text-legs")
                .attr("x",(d,i)=>(i*w2)+3)
                .attr("y",12).text(d=>d)
                .attr("width",w2)
                .style("font-weight",700)


    })//closing fetching
})//document Loaded