import { FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";

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
    <div className="inventory-toolbar">
      <div className="inventory-toolbar-header">
        <div>
          <p>Inventory Workspace</p>
          <h2>Search, Filter & Organize Products</h2>
        </div>

        <span className="toolbar-badge">
          Smart Inventory
        </span>
      </div>

      <div className="inventory-toolbar-grid">

        <div className="premium-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search product, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="premium-select">
          <FaFilter />

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="premium-select">
          <FaSortAmountDown />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="">Sort Products</option>
            <option value="name">Name A → Z</option>
            <option value="quantity">
              Quantity High → Low
            </option>
            <option value="profit">
              Profit High → Low
            </option>
          </select>
        </div>

      </div>
    </div>
  );
}

export default SearchBar;