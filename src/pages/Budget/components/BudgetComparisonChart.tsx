/**
 * Budget Comparison Chart (D3.js)
 * 
 * Visual comparison of budget vs actual expenses.
 * Shows budget amount and actual spending side by side.
 * 
 * Features:
 * - Bar chart with two bars (Budget, Actual)
 * - Color coding (green if under budget, red if over)
 * - Animated bars
 * - Tooltips on hover
 * - Percentage indicator
 */

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, Empty } from 'antd';
import type { BudgetComparison } from '../../../api/budgetApi';
import './BudgetComparisonChart.css';

/**
 * Props Interface
 */
interface BudgetComparisonChartProps {
  comparison: BudgetComparison | null;
  loading: boolean;
}

/**
 * Chart Data Interface
 */
interface ChartData {
  label: string;
  value: number;
  color: string;
}

/**
 * BudgetComparisonChart Component
 */
const BudgetComparisonChart = ({ comparison, loading }: BudgetComparisonChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  /**
   * Draw chart when data changes
   */
  useEffect(() => {
    if (!comparison || loading) return;

    // Clear previous chart
    if (svgRef.current) {
      d3.select(svgRef.current).selectAll('*').remove();
    }

    drawChart();
  }, [comparison, loading]);

  /**
   * Draw Chart
   */
  const drawChart = () => {
    if (!comparison || !chartRef.current) return;

    /**
     * Prepare Data
     */
    const budgetAmount = parseFloat(comparison.budget_amount);
    const actualExpenses = parseFloat(comparison.actual_expenses);
    
    // Determine color based on performance
    const isOverBudget = actualExpenses > budgetAmount;
    const actualColor = isOverBudget ? '#ff4d4f' : '#52c41a';

    const data: ChartData[] = [
      {
        label: 'Budget',
        value: budgetAmount,
        color: '#1677ff', // Blue
      },
      {
        label: 'Actual',
        value: actualExpenses,
        color: actualColor, // Green or Red
      },
    ];

    /**
     * Chart Dimensions
     */
    const containerWidth = chartRef.current.clientWidth;
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const width = containerWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    /**
     * Create SVG
     */
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', 350)
      .style('display', 'block')  // Remove inline spacing
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svgRef.current = chartRef.current.querySelector('svg');

    /**
     * Create Scales
     */
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, width])
      .padding(0.4);

    const maxValue = Math.max(budgetAmount, actualExpenses) * 1.1;
    const y = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([height, 0]);

    /**
     * Add X Axis
     */
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '16px')
      .style('font-weight', '600');

    /**
     * Add Y Axis with currency format
     */
    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `₹${d3.format('.2s')(d as number)}`)
      )
      .selectAll('text')
      .style('font-size', '13px');

    /**
     * Add Grid Lines
     */
    svg
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.1);

    /**
     * Create Tooltip
     */
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3-tooltip budget-tooltip')
      .style('opacity', 0);

    /**
     * Draw Bars
     */
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', (d) => d.color)
      .attr('rx', 8)
      .style('cursor', 'pointer')
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => height - y(d.value));

    /**
     * Add Value Labels on Bars
     */
    svg
      .selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', height)
      .attr('text-anchor', 'middle')
      .style('font-size', '15px')
      .style('font-weight', '700')
      .style('fill', (d) => d.color)
      .style('opacity', 0)
      .text((d) => `₹${d3.format(',.0f')(d.value)}`)
      .transition()
      .duration(800)
      .delay((_, i) => i * 100 + 400)
      .attr('y', (d) => y(d.value) - 10)
      .style('opacity', 1);

    /**
     * Add Status Badge
     * 
     * Shows "Under Budget" or "Over Budget"
     */
    const statusText = isOverBudget ? '⚠️ Over Budget' : '✅ Under Budget';
    const statusColor = isOverBudget ? '#ff4d4f' : '#52c41a';

    svg
      .append('text')
      .attr('class', 'status-badge')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', '600')
      .style('fill', statusColor)
      .style('opacity', 0)
      .text(statusText)
      .transition()
      .duration(800)
      .delay(1000)
      .style('opacity', 1);

    /**
     * Add Percentage Text
     */
    const percentageUsed = comparison.percentage_used;
    const percentageText = `${percentageUsed.toFixed(1)}% of budget used`;
    const percentageColor = percentageUsed > 100 ? '#ff4d4f' : percentageUsed > 80 ? '#faad14' : '#52c41a';

    svg
      .append('text')
      .attr('class', 'percentage-text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '500')
      .style('fill', percentageColor)
      .style('opacity', 0)
      .text(percentageText)
      .transition()
      .duration(800)
      .delay(1200)
      .style('opacity', 1);

    /**
     * Add Hover Effects
     */
    setTimeout(() => {
      svg
        .selectAll('.bar')
        .on('mouseover', function (event, d: any) {
          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 0.8);

          tooltip.transition().duration(200).style('opacity', 1);
          tooltip
            .html(
              `
              <strong>${d.label}</strong><br/>
              Amount: ₹${d3.format(',.2f')(d.value)}<br/>
              ${d.label === 'Actual' ? `${percentageUsed.toFixed(1)}% of budget` : ''}
              `
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 1);

          tooltip.transition().duration(200).style('opacity', 0);
        });
    }, 1500);
  };

  /**
   * Cleanup
   */
  useEffect(() => {
    return () => {
      d3.selectAll('.d3-tooltip.budget-tooltip').remove();
    };
  }, []);

  /**
   * Render
   */
  if (loading) {
    return (
      <Card title="Budget vs Actual" loading={loading}>
        <div style={{ height: 350 }}></div>
      </Card>
    );
  }

  if (!comparison) {
    return (
      <Card title="Budget vs Actual">
        <Empty description="No budget data available" />
      </Card>
    );
  }

  return (
    <Card title="Budget vs Actual" bordered={false} className="budget-comparison-card">
      <div ref={chartRef} className="chart-container"></div>
    </Card>
  );
};

export default BudgetComparisonChart;

/**
 * Understanding Budget Visualization:
 * 
 * Chart Shows:
 * - Budget bar (blue) - What you planned to spend
 * - Actual bar (green/red) - What you actually spent
 *   - Green if under budget
 *   - Red if over budget
 * 
 * Visual Indicators:
 * 1. Bar heights - Easy comparison at a glance
 * 2. Colors - Instant feedback (green = good, red = warning)
 * 3. Labels - Exact amounts on bars
 * 4. Status badge - "Under Budget" or "Over Budget"
 * 5. Percentage - How much of budget used
 * 
 * Color Logic:
 * 
 * if (actual > budget) {
 *   color = red (over budget, needs attention)
 * } else {
 *   color = green (under budget, doing well)
 * }
 * 
 * Percentage Colors:
 * - Green (0-80%): Safe zone
 * - Orange (80-100%): Warning zone
 * - Red (>100%): Over budget
 * 
 * Animation Sequence:
 * 1. Bars grow from bottom (0-800ms)
 * 2. Value labels fade in (400-1200ms)
 * 3. Status badge appears (1000-1800ms)
 * 4. Percentage text appears (1200-2000ms)
 * 5. Hover effects enabled (after 1500ms)
 * 
 * Why staggered animations?
 * - Guides user's attention
 * - Professional feel
 * - Not overwhelming
 * - Each element tells part of story
 * 
 * User Experience Flow:
 * 1. User sees chart
 * 2. Bars grow → Immediate visual comparison
 * 3. Numbers appear → Exact amounts
 * 4. Status shows → Clear verdict
 * 5. Percentage clarifies → Precise tracking
 * 6. Hover for details → Interactive exploration
 */