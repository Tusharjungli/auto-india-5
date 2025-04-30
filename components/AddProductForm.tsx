'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AddProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [engineType, setEngineType] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const imageUrl = await handleImageUpload();
    if (!imageUrl) {
      toast.error('❌ Failed to upload image');
      setIsUploading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, stock, imageUrl, categoryId, brand, vehicle, engineType }),
      });

      if (res.ok) {
        toast.success('✅ Product added successfully!');
        setName('');
        setDescription('');
        setPrice(0);
        setStock(0);
        setCategoryId('');
        setBrand('');
        setVehicle('');
        setEngineType('');
        setImageFile(null);
      } else {
        const errorData = await res.json();
        toast.error(`❌ ${errorData.error}`);
      }
    } catch (error) {
      console.error('❌ Error adding product:', error);
      toast.error('❌ Error adding product');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required className="input" />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input" />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="input" />
      <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(Number(e.target.value))} required className="input" />
      <input type="text" placeholder="Category ID" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="input" />
      <input type="text" placeholder="Brand (e.g. Bosch, TVS)" value={brand} onChange={(e) => setBrand(e.target.value)} className="input" />
      <input type="text" placeholder="Compatible Vehicle (e.g. Swift, Scorpio)" value={vehicle} onChange={(e) => setVehicle(e.target.value)} className="input" />
      <input type="text" placeholder="Engine Type (e.g. Petrol, Diesel)" value={engineType} onChange={(e) => setEngineType(e.target.value)} className="input" />
      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} required className="input" />
      <button type="submit" disabled={isUploading} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
        {isUploading ? 'Uploading...' : 'Add Product'}
      </button>
    </form>
  );
}
