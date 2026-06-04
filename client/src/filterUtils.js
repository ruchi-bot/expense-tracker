// Utility function to apply filters to expenses
export const applyFilters = (expenses, filters) => {
  let filtered = [...expenses];

  // Filter by category
  if (filters.category) {
    filtered = filtered.filter((e) => e.category === filters.category);
  }

  // Filter by date range
  if (filters.dateRange && filters.dateRange !== 'all') {
    const now = new Date();
    let startDate;
    let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month

    switch (filters.dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;

      case 'thisWeek':
        const first = now.getDate() - now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), first);
        break;

      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;

      case 'lastMonth':
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        startDate = lastMonthDate;
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;

      case 'custom':
        if (filters.customStart && filters.customEnd) {
          startDate = new Date(filters.customStart);
          endDate = new Date(filters.customEnd);
        } else {
          return filtered;
        }
        break;

      default:
        return filtered;
    }

    filtered = filtered.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  return filtered;
};
