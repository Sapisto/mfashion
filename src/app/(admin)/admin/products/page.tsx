import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getPaginatedProducts } from "@/lib/data/products";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ClickableRow } from "@/components/admin/ClickableRow";

const PER_PAGE = 10;
type ProductRow = { id: string; name: string; slug: string; price: number; stock: number; isActive: boolean; isFeatured: boolean; images: string[]; category: { name: string } | null };

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { total, products: rawProducts } = await getPaginatedProducts(page, PER_PAGE);
  const products = rawProducts as unknown as ProductRow[];
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {total} product{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white px-4 py-2.5 rounded-sm text-sm font-semibold transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Product
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">
                Category
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Price
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">
                Stock
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <ClickableRow key={p.id} href={`/admin/products/${p.id}/edit`} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-12 rounded-sm overflow-hidden bg-brand-sand shrink-0">
                      {p.images[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-sand" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 leading-snug">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                        /{p.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                  {p.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {formatPrice(p.price)}
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {p.stock === 0 ? (
                    <span className="text-red-500 font-medium">Out of stock</span>
                  ) : (
                    p.stock
                  )}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="p-1.5 text-gray-400 hover:text-brand-terracotta transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </td>
              </ClickableRow>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-400">No products yet.</p>
            <Link
              href="/admin/products/new"
              className="mt-3 inline-flex items-center gap-1.5 text-brand-terracotta hover:underline text-sm font-medium"
            >
              <Plus className="h-4 w-4" /> Add your first product
            </Link>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={`/admin/products?page=${page - 1}`}
                aria-disabled={page <= 1}
                className={`p-1.5 rounded border text-gray-600 transition-colors ${page <= 1 ? "pointer-events-none opacity-40 border-gray-200" : "border-gray-200 hover:border-brand-terracotta hover:text-brand-terracotta"}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/products?page=${p}`}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${p === page ? "bg-brand-terracotta text-white border-brand-terracotta font-semibold" : "border-gray-200 text-gray-600 hover:border-brand-terracotta hover:text-brand-terracotta"}`}
                >
                  {p}
                </Link>
              ))}
              <Link
                href={`/admin/products?page=${page + 1}`}
                aria-disabled={page >= totalPages}
                className={`p-1.5 rounded border text-gray-600 transition-colors ${page >= totalPages ? "pointer-events-none opacity-40 border-gray-200" : "border-gray-200 hover:border-brand-terracotta hover:text-brand-terracotta"}`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
