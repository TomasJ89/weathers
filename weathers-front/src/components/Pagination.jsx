function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = []; // Array to store page numbers

    // Generate page numbers from 1 to totalPages
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="join">
            {/* Render pagination buttons */}
            {pageNumbers.map(number => (
                <button
                    key={number}
                    className={`join-item btn ${currentPage === number ? "btn-active" : ""}`}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}
        </div>
    );
}

export default Pagination;

