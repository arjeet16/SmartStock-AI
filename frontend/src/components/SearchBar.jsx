import { FaSearch } from "react-icons/fa";

function SearchBar({
  search,
  setSearch,
  categories,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
}) {
  return (
    <>
      <div className="search-container">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search Product or Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
      </div>

      <div className="filter-row">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort Products</option>
          <option value="name">Name (A-Z)</option>
          <option value="quantity">Quantity (High-Low)</option>
          <option value="profit">Profit (High-Low)</option>
        </select>
      </div>
    </>
  );
}

export default SearchBar;