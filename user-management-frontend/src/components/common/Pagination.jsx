import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100]
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 mt-4">
      {/* Items per page selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
          Items per page:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-600">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          aria-label="First page"
        >
          <span aria-hidden="true">&laquo;</span>
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          aria-label="Previous page"
        >
          <span aria-hidden="true">&lsaquo;</span>
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === pageNum
                ? 'bg-blue-600 text-white'
                : 'border hover:bg-gray-100'
            }`}
            aria-label={`Page ${pageNum}`}
            aria-current={currentPage === pageNum ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          aria-label="Next page"
        >
          <span aria-hidden="true">&rsaquo;</span>
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          aria-label="Last page"
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
  itemsPerPageOptions: PropTypes.arrayOf(PropTypes.number)
};

export default Pagination; 