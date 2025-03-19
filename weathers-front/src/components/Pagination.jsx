function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="join">
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

