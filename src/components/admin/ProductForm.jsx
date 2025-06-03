import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`)
        .then(res => {
          setForm({
            name: res.data.name || '',
            description: res.data.description || '',
            price: res.data.price?.toString() || '',
            stock: res.data.stock?.toString() || ''
          });
        })
        .catch(err => {
          console.error(err);
          if (err.response?.status === 401) {
            alert('Sesión expirada, por favor inicie sesión nuevamente');
          }
        });
    }
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!form.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) newErrors.price = 'Precio debe ser mayor a 0';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) newErrors.stock = 'Stock no puede ser negativo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      stock: parseInt(form.stock)
    };

    const request = id 
      ? api.put(`/products/${id}`, productData)
      : api.post('/products', productData);

    request
      .then(() => {
        alert(`Producto ${id ? 'actualizado' : 'creado'} correctamente!`);
        navigate('/admin/products');
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          alert('Sesión expirada, por favor inicie sesión nuevamente');
        } else {
          alert('Error al guardar el producto');
        }
      });
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
      errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
    }`;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">{id ? 'Editar' : 'Nuevo'} Producto</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="name">Nombre:</label>
          <input
            id="name"
            type="text"
            className={inputClass('name')}
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            className={inputClass('description')}
            rows="4"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="price">Precio:</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            className={inputClass('price')}
            value={form.price}
            onChange={e => setForm({...form, price: e.target.value})}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="stock">Stock:</label>
          <input
            id="stock"
            type="number"
            min="0"
            className={inputClass('stock')}
            value={form.stock}
            onChange={e => setForm({...form, stock: e.target.value})}
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
