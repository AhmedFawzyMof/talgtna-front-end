interface TopProducts {
  name: string;
  sales: number;
  revenue: number;
}

export function TopProducts({ topProducts }: { topProducts?: TopProducts[] }) {
  return (
    <div className="space-y-6">
      {topProducts!.map((product: TopProducts) => (
        <div
          key={product.name}
          className="space-y-2 border-b border-orange-400"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium leading-none">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.sales} الوحدات المباعة
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium leading-none">
                ربح: {product.revenue} ج.م
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
