import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import Breadcrumb from "@/components/Breadcrumb";
import ProductTabs from "@/components/ProductTabs";
import ProductCard from "@/components/ProductCard";
import FeedbackForm from "@/components/FeedbackForm";

type Props = {
  params: { id: string };
};

export default async function ProductDetail({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  const related = await prisma.product.findMany({
    where: { NOT: { id: params.id } },
    take: 3,
  });

  if (!product) return notFound();

  return (
    <main className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.name, href: `/products/${product.id}` },
          ]}
        />

        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative w-full h-96 rounded overflow-hidden border dark:border-gray-800">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-500 mb-4">{product.description}</p>
            </div>
            <div className="text-xl font-semibold mb-6">
              ₹{product.price.toLocaleString()}
            </div>

            <ProductDetailClient
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          </div>
        </div>

        {/* ✅ Product tabs */}
        <ProductTabs description={product.description ?? ""} />

        {/* ✅ Related products */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                imageUrl={item.imageUrl}
                description={item.description ?? ""}
              />
            ))}
          </div>
        </div>

        {/* ✅ Feedback Form Integration */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Submit Your Feedback</h2>
          <FeedbackForm productId={product.id} />
        </div>
      </div>
    </main>
  );
}
