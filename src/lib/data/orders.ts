import { db } from "@/lib/db";

export async function getAdminStats() {
  const [orderCount, productCount, revenue] = await Promise.all([
    db.order.count(),
    db.product.count({ where: { isActive: true } }),
    db.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
  ]);

  const recentOrders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: true },
  });

  return {
    totalOrders: orderCount,
    totalProducts: productCount,
    totalRevenue: revenue._sum.total ?? 0,
    recentOrders,
  };
}

export async function getPaginatedOrders(page: number, perPage: number) {
  const [total, orders] = await Promise.all([
    db.order.count(),
    db.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);
  return { total, orders };
}

export async function getOrderById(id: string) {
  return db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}
