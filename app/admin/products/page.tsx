'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import RequireAdmin from '@/components/RequireAdmin';
import ClipLoader from 'react-spinners/ClipLoader';
import Image from 'next/image';
import toast from 'react-hot-toast';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
};

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6; // ✅ 6 items per page

  // ✅ For Add/Edit form:
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/products?page=${currentPage}&pageSize=${pageSize}`);
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.isAdmin) {
      fetchProducts();
    }
  }, [session, currentPage]);

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('✅ Product deleted successfully');
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        toast.error('❌ Failed to delete product');
      }
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      toast.error('❌ Error deleting product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isEditing ? `/api/admin/products/${formData.id}` : '/api/admin/products';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(isEditing ? '✅ Product updated successfully' : '✅ Product added successfully');
        setFormData({});
        setIsEditing(false);
        const updatedProducts = await (await fetch(`/api/admin/products?page=${currentPage}&pageSize=${pageSize}`)).json();
        setProducts(updatedProducts.products);
        setTotalPages(updatedProducts.totalPages);
      } else {
        toast.error('❌ Failed to submit product');
      }
    } catch (error) {
      console.error('❌ Error submitting product:', error);
      toast.error('❌ Error submitting product');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
  };

  return (
    <RequireAdmin>
      <main className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin - Product Control</h1>

        {/* ✅ Add/Edit Product Form */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-10 space-y-4 bg-gray-900 p-6 rounded">
          <h2 className="text-xl font-semibold">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 rounded bg-[var(--bg)] border dark:border-gray-700"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 rounded bg-[var(--bg)] border dark:border-gray-700"
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full p-2 rounded bg-[var(--bg)] border dark:border-gray-700"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock || ''}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            className="w-full p-2 rounded bg-[var(--bg)] border dark:border-gray-700"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.imageUrl || ''}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full p-2 rounded bg-[var(--bg)] border dark:border-gray-700"
            required
          />
          <input
            type="text"
            placeholder="Category ID"
            value={formData.categoryId || ''}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full p-2 rounded bg-[var(--bg)] border dark:border-gray-700"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        {/* ✅ Product List */}
        {loading ? (
          <div className="text-center mt-20">
            <ClipLoader size={40} color="#888" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border p-4 rounded shadow">
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={product.imageUrl.startsWith('http') ? product.imageUrl : `/${product.imageUrl.replace(/^\/+/, '')}`}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <h2 className="text-lg font-bold">{product.name}</h2>
                  <p className="text-sm text-gray-400">₹{product.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Stock: {product.stock}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Pagination Controls */}
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </RequireAdmin>
  );
}
