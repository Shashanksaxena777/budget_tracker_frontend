/**
 * Financial Chart Component (D3.js)
 * 
 * Beautiful bar chart showing income vs expenses.
 * Uses D3.js for data visualization.
 * 
 * Features:
 * - Animated bars
 * - Color-coded (green for income, red for expenses)
 * - Responsive design
 * - Tooltips on hover
 * - Smooth transitions
 */

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, Empty } from 'antd';
import type { FinancialSummary } from '../../../api/transactionApi';
import './FinancialCharts.css';

/**
 * Props Interface
 */
interface FinancialChartProps {
  summary: FinancialSummary | null;
  loading: boolean;
}

/**
 * Chart Data Interface
 * 
 * Structure for D3.js data
 */
interface ChartData {
  label: string;      // "Income" or "Expenses"
  value: number;      // Amount
  color: string;      // Bar color
}

/**
 * FinancialChart Component
 */
const FinancialChart = ({ summary, loading }: FinancialChartProps) => {
  /**
   * Refs
   * 
   * useRef creates a reference to DOM element.
   * We need this to tell D3.js where to draw the chart.
   * 
   * Why useRef instead of getElementById?
   * - Works with React's virtual DOM
   * - Persists across re-renders
   * - Type-safe with TypeScript
   */
  const chartRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  /**
   * useEffect - Draw chart when data changes
   * 
   * Dependencies: [summary]
   * - Runs when summary changes
   * - Redraws chart with new data
   */
  useEffect(() => {
    if (!summary || loading) return;

    // Clear previous chart
    d3.select(chartRef.current).select('svg').remove();

    // Draw new chart
    drawChart();
  }, [summary, loading]);

  /**
   * Draw Chart Function
   * 
   * This is where D3.js magic happens!
   */
  const drawChart = () => {
    if (!summary || !chartRef.current) return;

    /**
     * Prepare Data
     * 
     * Convert summary to chart-friendly format
     */
    const data: ChartData[] = [
      {
        label: 'Income',
        value: parseFloat(summary.total_income),
        color: '#52c41a',  // Green
      },
      {
        label: 'Expenses',
        value: parseFloat(summary.total_expenses),
        color: '#ff4d4f',  // Red
      },
    ];

    /**
     * Chart Dimensions
     * 
     * Calculate chart size based on container
     */
    const containerWidth = chartRef.current.clientWidth;
    const margin = { top: 10, right: 30, bottom: 40, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    /**
     * Create SVG Element
     * 
     * SVG = Scalable Vector Graphics
     * - Resolution-independent
     * - Perfect for charts
     * - D3.js works with SVG
     */
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', 300)
      .style('display', 'block')  // Remove any inline spacing
      .append('g')  // Group element for margins
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Store reference for cleanup
    svgRef.current = chartRef.current.querySelector('svg');

    /**
     * Create Scales
     * 
     * Scales map data values to pixel positions.
     * 
     * X Scale (scaleBand):
     * - For categorical data (Income, Expenses)
     * - Creates evenly spaced bands
     * - padding: Space between bars
     * 
     * Y Scale (scaleLinear):
     * - For numerical data (amounts)
     * - Maps amount to pixel height
     * - domain: Data range [0, max]
     * - range: Pixel range [height, 0] (inverted for SVG coordinates)
     */
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))  // ["Income", "Expenses"]
      .range([0, width])
      .padding(0.3);  // 30% space between bars

    const maxValue = d3.max(data, (d) => d.value) || 0;
    const y = d3
      .scaleLinear()
      .domain([0, maxValue * 1.1])  // Add 10% padding at top
      .range([height, 0]);

    /**
     * Add X Axis
     * 
     * axisBottom creates bottom-aligned axis
     * - Shows labels (Income, Expenses)
     */
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '14px')
      .style('font-weight', '500');

    /**
     * Add Y Axis
     * 
     * axisLeft creates left-aligned axis
     * - Shows amount scale
     * - Formatted as currency
     */
    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)  // 5 tick marks
          .tickFormat((d) => `₹${d3.format('.2s')(d as number)}`)  // Format: ₹1.0k, ₹2.5k
      )
      .selectAll('text')
      .style('font-size', '12px');

    /**
     * Add Grid Lines (Horizontal)
     * 
     * Makes it easier to read values
     */
    svg
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width)  // Extend across full width
          .tickFormat(() => '')  // No labels, just lines
      )
      .style('stroke-dasharray', '3,3')  // Dashed lines
      .style('opacity', 0.1);

    /**
     * Create Tooltip
     * 
     * Div element that shows on hover
     */
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('opacity', 0);

    /**
     * Draw Bars
     * 
     * This is the main chart visualization!
     */
    svg
      .selectAll('.bar')
      .data(data)  // Bind data to elements
      .enter()     // For each data point...
      .append('rect')  // Create a rectangle
      .attr('class', 'bar')
      .attr('x', (d) => x(d.label) || 0)  // X position
      .attr('width', x.bandwidth())       // Bar width
      .attr('y', height)                  // Start at bottom (for animation)
      .attr('height', 0)                  // Start with 0 height (for animation)
      .attr('fill', (d) => d.color)       // Bar color
      .attr('rx', 8)                      // Rounded corners
      .style('cursor', 'pointer')
      /**
       * Animation: Bars grow from bottom to top
       * 
       * transition() creates smooth animation
       * duration() sets animation length (800ms)
       * delay() staggers animations (100ms apart)
       */
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)  // Second bar animates after first
      .attr('y', (d) => y(d.value))          // Final Y position
      .attr('height', (d) => height - y(d.value));  // Final height

    /**
     * Add Bar Labels (Amount on top of bars)
     */
    svg
      .selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => (x(d.label) || 0) + x.bandwidth() / 2)  // Center of bar
      .attr('y', height)  // Start at bottom
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', (d) => d.color)
      .style('opacity', 0)  // Start invisible
      .text((d) => `₹${d3.format(',.0f')(d.value)}`)  // Format: ₹1,000
      /**
       * Animate labels
       */
      .transition()
      .duration(800)
      .delay((_, i) => i * 100 + 400)  // After bars start
      .attr('y', (d) => y(d.value) - 10)  // 10px above bar
      .style('opacity', 1);

    /**
     * Add Hover Effects
     * 
     * Re-select bars to add event listeners
     * (Can't add to elements during transition)
     */
    setTimeout(() => {
      svg
        .selectAll('.bar')
        .on('mouseover', function (event, d: any) {
          // Highlight bar
          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 0.8)
            .attr('transform', 'scale(1.05)');

          // Show tooltip
          tooltip.transition().duration(200).style('opacity', 1);
          tooltip
            .html(
              `
              <strong>${d.label}</strong><br/>
              Amount: ₹${d3.format(',.2f')(d.value)}<br/>
              Transactions: ${d.label === 'Income' ? summary.income_count : summary.expense_count}
              `
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          // Remove highlight
          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 1)
            .attr('transform', 'scale(1)');

          // Hide tooltip
          tooltip.transition().duration(200).style('opacity', 0);
        });
    }, 1000);

    /**
     * Add Chart Title (Optional)
     */
    svg
      .append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', '600')
      .style('fill', 'rgba(0, 0, 0, 0.85)')
      .text('Income vs Expenses');
  };

  /**
   * Cleanup Effect
   * 
   * Remove tooltip when component unmounts
   */
  useEffect(() => {
    return () => {
      d3.selectAll('.d3-tooltip').remove();
    };
  }, []);

  /**
   * Render
   */
  if (loading) {
    return (
      <Card title="Financial Overview" loading={loading}>
        <div style={{ height: 300 }}></div>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card title="Financial Overview">
        <Empty description="No data available" />
      </Card>
    );
  }

  return (
    <Card title="Financial Overview" bordered={false} className="financial-chart-card">
      <div ref={chartRef} className="chart-container"></div>
    </Card>
  );
};

export default FinancialChart;

/**
 * Understanding D3.js Concepts:
 * 
 * 1. Data Binding:
 *    selectAll('.bar').data(data)
 *    - Binds data array to DOM elements
 *    - Creates relationship between data and visuals
 * 
 * 2. Enter/Update/Exit Pattern:
 *    .enter() - Create new elements for new data
 *    .update() - Update existing elements
 *    .exit() - Remove elements for removed data
 * 
 * 3. Scales:
 *    - Map data domain to visual range
 *    - scaleBand: For categories (Income, Expenses)
 *    - scaleLinear: For numbers (amounts)
 * 
 * 4. Transitions:
 *    .transition().duration(800)
 *    - Animates changes smoothly
 *    - duration: Animation length in milliseconds
 * 
 * 5. SVG Coordinates:
 *    - (0, 0) is top-left
 *    - Y increases downward
 *    - That's why we invert Y scale: range([height, 0])
 * 
 * 6. Method Chaining:
 *    d3.select().append().attr().style()
 *    - Each method returns the selection
 *    - Allows chaining multiple operations
 * 
 * Chart Creation Flow:
 * 
 * 1. Prepare data
 *    ↓
 * 2. Create SVG canvas
 *    ↓
 * 3. Create scales (map data to pixels)
 *    ↓
 * 4. Draw axes
 *    ↓
 * 5. Draw bars (with animation)
 *    ↓
 * 6. Add labels
 *    ↓
 * 7. Add interactivity (hover effects)
 * 
 * Why D3.js Instead of Chart Library?
 * 
 * Pros:
 * - Complete control over appearance
 * - Custom animations
 * - Any visualization possible
 * - Better performance for complex charts
 * 
 * Cons:
 * - More code to write
 * - Steeper learning curve
 * - Need to handle responsive manually
 * 
 * But for this project:
 * - Required by assessment
 * - Great learning experience
 * - Beautiful, custom result
 */