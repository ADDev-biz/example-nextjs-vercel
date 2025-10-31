// Generate sample data for different time periods
function generateData(days) {
    const data = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    for (let i = 0; i <= days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        // Generate realistic looking data with trend and noise
        const trend = i * 0.5;
        const seasonal = Math.sin(i * 0.1) * 20;
        const noise = Math.random() * 30 - 15;
        const value = 100 + trend + seasonal + noise;
        
        data.push({
            date: new Date(currentDate),
            value: Math.max(0, value)
        });
    }
    
    return data;
}

// Store data for different periods
const dataStore = {
    30: generateData(30),
    60: generateData(60),
    120: generateData(120),
    365: generateData(365)
};

// Set up dimensions - will be updated on resize
const margin = { top: 60, right: 30, bottom: 60, left: 70 };

// Function to get responsive dimensions
function getChartDimensions() {
    const container = document.getElementById('chart');
    const containerWidth = container.offsetWidth;
    // Calculate responsive dimensions
    const chartWidth = Math.max(300, containerWidth - margin.left - margin.right);
    const chartHeight = Math.max(250, Math.min(500, containerWidth * 0.5));
    
    // Adjust margins for mobile
    if (containerWidth < 640) {
        margin.left = 50;
        margin.right = 20;
        margin.bottom = 50;
    } else {
        margin.left = 70;
        margin.right = 30;
        margin.bottom = 60;
    }
    
    return { 
        width: Math.max(300, containerWidth - margin.left - margin.right), 
        height: chartHeight 
    };
}

// Get initial dimensions
let dimensions = getChartDimensions();
let width = dimensions.width;
let height = dimensions.height;

// Create SVG
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize scales
const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

// Create line generator
const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value))
    .curve(d3.curveMonotoneX);

// Create area generator
const area = d3.area()
    .x(d => xScale(d.date))
    .y0(height)
    .y1(d => yScale(d.value))
    .curve(d3.curveMonotoneX);

// Add grid lines
const xGrid = g.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height})`);

const yGrid = g.append("g")
    .attr("class", "grid");

// Add axes groups
const xAxis = g.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", `translate(0,${height})`);

const yAxis = g.append("g")
    .attr("class", "y-axis axis");

// Add axis labels
const xAxisLabel = xAxis.append("text")
    .attr("class", "axis-label")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Date");

const yAxisLabel = yAxis.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Value");

// Add title
const title = svg.append("text")
    .attr("class", "chart-title")
    .attr("text-anchor", "middle")
    .attr("y", 30)
    .text("Time Series Data - 30 Days");

// Add area path
const areaPath = g.append("path")
    .attr("class", "area");

// Add line path
const linePath = g.append("path")
    .attr("class", "line");

// Add dots group
const dotsGroup = g.append("g")
    .attr("class", "dots");

// Tooltip
const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("padding", "10px")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "white")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("opacity", 0);

// Update function
function updateChart(days, skipTransition = false) {
    const data = dataStore[days];
    const t = skipTransition ? d3.transition().duration(0) : d3.transition().duration(750);
    
    // Update dimensions for responsive design
    const dimensions = getChartDimensions();
    width = dimensions.width;
    height = dimensions.height;
    
    // Update SVG size
    svg.attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom);
    
    g.attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Update scale ranges
    xScale.range([0, width]);
    yScale.range([height, 0]);
    
    // Update scales
    xScale.domain(d3.extent(data, d => d.date));
    yScale.domain([0, d3.max(data, d => d.value) * 1.1]);
    
    // Determine number of ticks based on screen size
    const isMobile = window.innerWidth < 640;
    const xTicks = isMobile ? 3 : 6;
    const yTicks = isMobile ? 4 : 5;
    
    // Update grid lines
    xGrid.transition(t)
        .call(d3.axisBottom(xScale)
            .tickSize(-height)
            .tickFormat("")
            .ticks(xTicks));
    
    yGrid.transition(t)
        .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat("")
            .ticks(yTicks));
    
    // Update axes
    xAxis.transition(t)
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat(isMobile ? "%m/%d" : "%b %d"))
            .ticks(xTicks));
    
    yAxis.transition(t)
        .call(d3.axisLeft(yScale)
            .tickFormat(d3.format(isMobile ? ".0f" : ".0f")));
    
    // Update axis label positions
    xAxisLabel
        .attr("x", width / 2)
        .attr("y", isMobile ? 40 : 45)
        .style("font-size", isMobile ? "11px" : "12px");
    
    yAxisLabel
        .attr("x", -height / 2)
        .attr("y", isMobile ? -35 : -50)
        .style("font-size", isMobile ? "11px" : "12px");
    
    // Update area
    areaPath
        .datum(data)
        .transition(t)
        .attr("d", area);
    
    // Update line
    linePath
        .datum(data)
        .transition(t)
        .attr("d", line);
    
    // Update dots (sample every nth point for performance)
    const sampledData = data.filter((d, i) => {
        if (days <= 30) return true;
        if (days <= 60) return i % 2 === 0;
        if (days <= 120) return i % 4 === 0;
        return i % 10 === 0;
    });
    
    const dots = dotsGroup.selectAll(".dot")
        .data(sampledData, d => d.date);
    
    // Remove old dots
    dots.exit()
        .transition(t)
        .attr("r", 0)
        .remove();
    
    // Update existing dots
    dots.transition(t)
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.value));
    
    // Add new dots
    dots.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 0)
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.value))
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 6);
            tooltip
                .style("opacity", 1)
                .html(`<strong>Date:</strong> ${d3.timeFormat("%B %d, %Y")(d.date)}<br>
                       <strong>Value:</strong> ${d.value.toFixed(2)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 3);
            tooltip.style("opacity", 0);
        })
        .transition(t)
        .attr("r", 3);
    
    // Update title
    title
        .attr("x", (width + margin.left + margin.right) / 2)
        .text(`Time Series Data - ${days} Days`);
    
    // Update statistics
    updateStats(data, days);
}

// Calculate and display statistics
function updateStats(data, days) {
    const values = data.map(d => d.value);
    const mean = d3.mean(values);
    const min = d3.min(values);
    const max = d3.max(values);
    const latest = values[values.length - 1];
    const change = latest - values[0];
    const changePercent = (change / values[0]) * 100;
    
    // Check if mobile view
    const isMobile = window.innerWidth < 640;
    
    if (isMobile) {
        d3.select("#stats").html(`
            <div><strong>Statistics (${days} days)</strong></div>
            <div class="mt-2 space-y-1">
                <div>Avg: <strong>${mean.toFixed(2)}</strong> | Min: <strong>${min.toFixed(2)}</strong> | Max: <strong>${max.toFixed(2)}</strong></div>
                <div>Latest: <strong>${latest.toFixed(2)}</strong> | Change: <strong class="${change >= 0 ? 'text-success' : 'text-error'}">${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%)</strong></div>
            </div>
        `);
    } else {
        d3.select("#stats").html(`
            <strong>Statistics (${days} days):</strong><br>
            Average: <strong>${mean.toFixed(2)}</strong> | 
            Min: <strong>${min.toFixed(2)}</strong> | 
            Max: <strong>${max.toFixed(2)}</strong> | 
            Latest: <strong>${latest.toFixed(2)}</strong> | 
            Change: <strong class="${change >= 0 ? 'text-success' : 'text-error'}">${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%)</strong>
        `);
    }
}

// Button click handlers for desktop
d3.selectAll(".time-period-btn").on("click", function() {
    // Update active button - remove outline and add solid primary
    d3.selectAll(".time-period-btn")
        .classed("btn-outline", true)
        .classed("btn-primary", true);
    
    // Make clicked button solid (remove outline)
    d3.select(this)
        .classed("btn-outline", false)
        .classed("btn-primary", true);
    
    // Update chart
    const days = +d3.select(this).attr("data-days");
    updateChart(days);
});

// Radio button handlers for mobile
d3.selectAll('input[name="time-period-1"]').on("change", function() {
    const days = +this.value;
    updateChart(days);
});

// Initial render
updateChart(30);

// Optional: Auto-refresh data
function refreshData() {
    // Regenerate data to simulate real-time updates
    dataStore[30] = generateData(30);
    dataStore[60] = generateData(60);
    dataStore[120] = generateData(120);
    dataStore[365] = generateData(365);
    
    // Update current view - find the button without btn-outline class
    const activeDays = +d3.select(".time-period-btn:not(.btn-outline)").attr("data-days");
    updateChart(activeDays);
}

// Uncomment to enable auto-refresh every 10 seconds
// setInterval(refreshData, 10000);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Find current active period for chart 1
        const activeDays = +d3.select(".time-period-btn:not(.btn-outline)").attr("data-days") || 
                          +document.querySelector('input[name="time-period-1"]:checked')?.value || 30;
        updateChart(activeDays, true); // Skip transition on resize
        
        // Find current active period for chart 2
        const activeDays2 = +d3.select(".time-period-btn-2:not(.btn-outline)").attr("data-days") || 
                           +document.querySelector('input[name="time-period-2"]:checked')?.value || 30;
        updateChart2(activeDays2, true); // Skip transition on resize
    }, 250);
});

// ========================================
// SECOND CHART - Different Data/Visualization
// ========================================

// Generate different data for second chart (more volatile/different pattern)
function generateData2(days) {
    const data = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    for (let i = 0; i <= days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        // Generate different pattern - more volatile, inverse trend
        const trend = -i * 0.3; // Declining trend
        const seasonal = Math.cos(i * 0.15) * 25; // Different seasonal pattern
        const noise = Math.random() * 40 - 20; // More noise
        const value = 150 + trend + seasonal + noise;
        
        data.push({
            date: new Date(currentDate),
            value: Math.max(20, value)
        });
    }
    
    return data;
}

// Store data for second chart
const dataStore2 = {
    30: generateData2(30),
    60: generateData2(60),
    120: generateData2(120),
    365: generateData2(365)
};

// Set up dimensions for chart 2
const margin2 = { top: 60, right: 30, bottom: 60, left: 70 };

// Function to get responsive dimensions for chart 2
function getChartDimensions2() {
    const container = document.getElementById('chart2');
    const containerWidth = container.offsetWidth;
    const chartWidth = Math.max(300, containerWidth - margin2.left - margin2.right);
    const chartHeight = Math.max(250, Math.min(500, containerWidth * 0.5));
    
    if (containerWidth < 640) {
        margin2.left = 50;
        margin2.right = 20;
        margin2.bottom = 50;
    } else {
        margin2.left = 70;
        margin2.right = 30;
        margin2.bottom = 60;
    }
    
    return { 
        width: Math.max(300, containerWidth - margin2.left - margin2.right), 
        height: chartHeight 
    };
}

// Get initial dimensions for chart 2
let dimensions2 = getChartDimensions2();
let width2 = dimensions2.width;
let height2 = dimensions2.height;

// Create SVG for chart 2
const svg2 = d3.select("#chart2")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom);

const g2 = svg2.append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

// Initialize scales for chart 2
const xScale2 = d3.scaleTime().range([0, width2]);
const yScale2 = d3.scaleLinear().range([height2, 0]);

// Create line generator for chart 2 (using orange/secondary color)
const line2 = d3.line()
    .x(d => xScale2(d.date))
    .y(d => yScale2(d.value))
    .curve(d3.curveMonotoneX);

// Create area generator for chart 2
const area2 = d3.area()
    .x(d => xScale2(d.date))
    .y0(height2)
    .y1(d => yScale2(d.value))
    .curve(d3.curveMonotoneX);

// Add grid lines for chart 2
const xGrid2 = g2.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height2})`);

const yGrid2 = g2.append("g")
    .attr("class", "grid");

// Add axes groups for chart 2
const xAxis2 = g2.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", `translate(0,${height2})`);

const yAxis2 = g2.append("g")
    .attr("class", "y-axis axis");

// Add axis labels for chart 2
const xAxisLabel2 = xAxis2.append("text")
    .attr("class", "axis-label")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Date");

const yAxisLabel2 = yAxis2.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Value");

// Add title for chart 2
const title2 = svg2.append("text")
    .attr("class", "chart-title")
    .attr("text-anchor", "middle")
    .attr("y", 30)
    .text("Secondary Metrics - 30 Days");

// Add area path for chart 2 (orange color)
const areaPath2 = g2.append("path")
    .attr("class", "area")
    .style("fill", "orange")
    .style("opacity", 0.2);

// Add line path for chart 2
const linePath2 = g2.append("path")
    .attr("class", "line")
    .style("stroke", "orange");

// Add dots group for chart 2
const dotsGroup2 = g2.append("g")
    .attr("class", "dots");

// Tooltip for chart 2 (reuse the same tooltip)
const tooltip2 = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("padding", "10px")
    .style("background", "rgba(255, 140, 0, 0.9)")
    .style("color", "white")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("opacity", 0);

// Update function for chart 2
function updateChart2(days, skipTransition = false) {
    const data = dataStore2[days];
    const t = skipTransition ? d3.transition().duration(0) : d3.transition().duration(750);
    
    // Update dimensions for responsive design
    const dimensions = getChartDimensions2();
    width2 = dimensions.width;
    height2 = dimensions.height;
    
    // Update SVG size
    svg2.attr("width", width2 + margin2.left + margin2.right)
       .attr("height", height2 + margin2.top + margin2.bottom);
    
    g2.attr("transform", `translate(${margin2.left},${margin2.top})`);
    
    // Update scale ranges
    xScale2.range([0, width2]);
    yScale2.range([height2, 0]);
    
    // Update scales
    xScale2.domain(d3.extent(data, d => d.date));
    yScale2.domain([0, d3.max(data, d => d.value) * 1.1]);
    
    // Determine number of ticks based on screen size
    const isMobile = window.innerWidth < 640;
    const xTicks = isMobile ? 3 : 6;
    const yTicks = isMobile ? 4 : 5;
    
    // Update grid lines
    xGrid2.transition(t)
        .attr("transform", `translate(0,${height2})`)
        .call(d3.axisBottom(xScale2)
            .tickSize(-height2)
            .tickFormat("")
            .ticks(xTicks));
    
    yGrid2.transition(t)
        .call(d3.axisLeft(yScale2)
            .tickSize(-width2)
            .tickFormat("")
            .ticks(yTicks));
    
    // Update axes
    xAxis2.transition(t)
        .attr("transform", `translate(0,${height2})`)
        .call(d3.axisBottom(xScale2)
            .tickFormat(d3.timeFormat(isMobile ? "%m/%d" : "%b %d"))
            .ticks(xTicks));
    
    yAxis2.transition(t)
        .call(d3.axisLeft(yScale2)
            .tickFormat(d3.format(isMobile ? ".0f" : ".0f")));
    
    // Update axis label positions
    xAxisLabel2
        .attr("x", width2 / 2)
        .attr("y", isMobile ? 40 : 45)
        .style("font-size", isMobile ? "11px" : "12px");
    
    yAxisLabel2
        .attr("x", -height2 / 2)
        .attr("y", isMobile ? -35 : -50)
        .style("font-size", isMobile ? "11px" : "12px");
    
    // Update area
    area2.y0(height2);
    areaPath2
        .datum(data)
        .transition(t)
        .attr("d", area2);
    
    // Update line
    linePath2
        .datum(data)
        .transition(t)
        .attr("d", line2);
    
    // Update dots
    const sampledData = data.filter((d, i) => {
        if (days <= 30) return true;
        if (days <= 60) return i % 2 === 0;
        if (days <= 120) return i % 4 === 0;
        return i % 10 === 0;
    });
    
    const dots2 = dotsGroup2.selectAll(".dot")
        .data(sampledData, d => d.date);
    
    dots2.exit()
        .transition(t)
        .attr("r", 0)
        .remove();
    
    dots2.transition(t)
        .attr("cx", d => xScale2(d.date))
        .attr("cy", d => yScale2(d.value));
    
    dots2.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 0)
        .attr("cx", d => xScale2(d.date))
        .attr("cy", d => yScale2(d.value))
        .style("fill", "orange")
        .style("stroke", "white")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 6);
            tooltip2
                .style("opacity", 1)
                .html(`<strong>Date:</strong> ${d3.timeFormat("%B %d, %Y")(d.date)}<br>
                       <strong>Value:</strong> ${d.value.toFixed(2)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 3);
            tooltip2.style("opacity", 0);
        })
        .transition(t)
        .attr("r", 3);
    
    // Update title
    title2
        .attr("x", (width2 + margin2.left + margin2.right) / 2)
        .text(`Secondary Metrics - ${days} Days`);
    
    // Update statistics
    updateStats2(data, days);
}

// Calculate and display statistics for chart 2
function updateStats2(data, days) {
    const values = data.map(d => d.value);
    const mean = d3.mean(values);
    const min = d3.min(values);
    const max = d3.max(values);
    const latest = values[values.length - 1];
    const change = latest - values[0];
    const changePercent = (change / values[0]) * 100;
    
    const isMobile = window.innerWidth < 640;
    
    if (isMobile) {
        d3.select("#stats2").html(`
            <div><strong>Statistics (${days} days)</strong></div>
            <div class="mt-2 space-y-1">
                <div>Avg: <strong>${mean.toFixed(2)}</strong> | Min: <strong>${min.toFixed(2)}</strong> | Max: <strong>${max.toFixed(2)}</strong></div>
                <div>Latest: <strong>${latest.toFixed(2)}</strong> | Change: <strong class="${change >= 0 ? 'text-success' : 'text-error'}">${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%)</strong></div>
            </div>
        `);
    } else {
        d3.select("#stats2").html(`
            <strong>Statistics (${days} days):</strong><br>
            Average: <strong>${mean.toFixed(2)}</strong> | 
            Min: <strong>${min.toFixed(2)}</strong> | 
            Max: <strong>${max.toFixed(2)}</strong> | 
            Latest: <strong>${latest.toFixed(2)}</strong> | 
            Change: <strong class="${change >= 0 ? 'text-success' : 'text-error'}">${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%)</strong>
        `);
    }
}

// Button click handlers for chart 2 desktop
d3.selectAll(".time-period-btn-2").on("click", function() {
    d3.selectAll(".time-period-btn-2")
        .classed("btn-outline", true)
        .classed("btn-secondary", true);
    
    d3.select(this)
        .classed("btn-outline", false)
        .classed("btn-secondary", true);
    
    const days = +d3.select(this).attr("data-days");
    updateChart2(days);
});

// Radio button handlers for chart 2 mobile
d3.selectAll('input[name="time-period-2"]').on("change", function() {
    const days = +this.value;
    updateChart2(days);
});

// Initial render for chart 2
updateChart2(30);