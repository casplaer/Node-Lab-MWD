import React, { Component } from 'react';

class FilterByCategory extends Component {
  state = {
    selectedCategory: ''
  };

  handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    this.setState({ selectedCategory });
    this.props.onCategoryChange(selectedCategory);
  };

  render() {
    const { categories } = this.props;
    return (
      <div className="filter-group">
        <label>Filter by Category</label>
        <select 
          value={this.state.selectedCategory} 
          onChange={this.handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default FilterByCategory;
