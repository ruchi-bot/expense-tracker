const exportToCSV = (expenses, filename = 'expenses.csv') => {
  if (!expenses || expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  const headers = ['Date', 'Category', 'Amount', 'Note'];
  const csvContent = [
    headers.join(','),
    ...expenses.map((expense) => {
      const date = new Date(expense.date).toLocaleDateString('en-IN');
      const escapeCSV = (value) => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };
      return [
        date,
        escapeCSV(expense.category),
        expense.amount,
        escapeCSV(expense.note),
      ].join(',');
    }),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default exportToCSV;
