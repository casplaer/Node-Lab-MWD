import React from 'react';
import FilterByCategory from './FilterByCategory';

const Filters = ({ 
  filterName, setFilterName, 
  filterPrice, setFilterPrice, 
  setFilterCategory, 
  handleSortChange, 
  categories 
}) => {
  return (
    <div className="filters">
      <div className="filter-group">
        <label>Filter by Name</label>
        <input 
          type="text" 
          value={filterName} 
          onChange={(e) => setFilterName(e.target.value)} 
          placeholder="Product name"
        />
      </div>

      <div className="filter-group">
        <label>Filter by Price</label>
        <input 
          type="number" 
          value={filterPrice} 
          onChange={(e) => setFilterPrice(e.target.value)} 
          placeholder="Max price"
          min={0}
        />
      </div>

      <FilterByCategory 
        categories={categories} 
        onCategoryChange={setFilterCategory} 
      />

      <div className="filter-group">
        <button onClick={() => handleSortChange('name')}>Sort by Name</button>
        <button onClick={() => handleSortChange('price')}>Sort by Price</button>
      </div>
    </div>
  );
};

Filters.defaultProps = {
  filterName: '',
  filterPrice: '',
  categories: [],
  setFilterName: () => {},
  setFilterPrice: () => {},
  setFilterCategory: () => {},
  handleSortChange: () => {}
};

export default Filters;
