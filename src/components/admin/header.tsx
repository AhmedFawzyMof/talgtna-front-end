export default function Header({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          آخر تحديث: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
