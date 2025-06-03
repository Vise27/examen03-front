import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ 
        ...product, 
        quantity: 1,
        price: Number(product.price) // Asegurando número
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('¡Producto añadido al carrito!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10 font-semibold">{error}</div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-gray-500 text-center mt-10 font-medium">
        No hay productos disponibles
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
        <div>
          <button
            onClick={() => navigate('/cart')}
            className="bg-yellow-500 text-white px-4 py-2 rounded mr-3 hover:bg-yellow-600 transition-colors"
          >
            🛒 Carrito
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <li
            key={p.id}
            className="border rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={p.image_url}
              alt={p.name}
              className="w-full h-48 object-cover rounded mb-4"
              loading="lazy"
            />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{p.name}</h3>
              <p className="text-gray-700 mb-4">{p.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-blue-600">
                ${Number(p.price).toFixed(2)}
              </span>
              <button
                onClick={() => addToCart(p)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                🛒 Añadir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
