import React, { useState } from 'react';
import './FilterPanel.css';

const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
const DATE_RANGES = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'thisWeek', label: 'This Week' },
  { id: 'thisMonth', label: 'This Month' },
  { id: 'lastMonth', label: 'Last Month' },
  { id: 'custom', label: 'Custom Range' },
];

const FilterPanel = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const applyFilters = () => {
    const filters = {
      category: selectedCategory === 'All' ? null : selectedCategory,
      dateRange: selectedDateRange,
      customStart: customStartDate,
      customEnd: customEndDate,
    };
    onFilterChange(filters);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    setSelectedDateRange(e.target.value);
  };

  const handleCustomStartDateChange = (e) => {
    setCustomStartDate(e.target.value);
  };

  const handleCustomEndDateChange = (e) => {
    setCustomEndDate(e.target.value);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedDateRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    onFilterChange({
      category: null,
      dateRange: 'all',
      customStart: '',
      customEnd: '',
    });
  };

  return (
    <div className="filter-panel">
      <h3>Filters</h3>

      <div className="filter-group">
        <label htmlFor="category-filter">Category</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="date-range-filter">Date Range</label>
        <select
          id="date-range-filter"
          value={selectedDateRange}
          onChange={handleDateRangeChange}
        >
          {DATE_RANGES.map((range) => (
            <option key={range.id} value={range.id}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {selectedDateRange === 'custom' && (
        <>
          <div className="filter-group">
            <label htmlFor="custom-start">Start Date</label>
            <input
              type="date"
              id="custom-start"
              value={customStartDate}
              onChange={handleCustomStartDateChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="custom-end">End Date</label>
            <input
              type="date"
              id="custom-end"
              value={customEndDate}
              onChange={handleCustomEndDateChange}
            />
          </div>
        </>
      )}

      <div className="filter-actions">
        <button className="btn-apply" onClick={applyFilters}>
          Apply Filters
        </button>
        <button className="btn-reset" onClick={resetFilters}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
