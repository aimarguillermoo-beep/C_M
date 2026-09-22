import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryData {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface CategoryCardProps {
  category: CategoryData;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/productos?categoria=${category.name}`}
      className="group block relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="absolute inset-0">
        <img 
          src={category.image} 
          alt={category.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/90 via-brown-dark/40 to-transparent group-hover:from-brown-dark/70 transition-colors duration-300" />
      </div>
      
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="transform transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="font-heading text-2xl font-bold text-white mb-2">
            {category.name}
          </h3>
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/30">
            {category.productCount} productos
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
