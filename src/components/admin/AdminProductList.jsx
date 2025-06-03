import { useState, useEffect } from 'react'; 
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function AdminProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      api.delete(`/products/${id}`)
        .then(() => setProducts(products.filter(p => p.id !== id)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Administrar Productos</h2>
        <Link 
          to="/admin/products/new" 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Nuevo Producto
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Precio</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      loading="lazy"
                    />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center space-x-3">
                  <Link 
                    to={`/admin/products/edit/${product.id}`} 
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No hay productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
