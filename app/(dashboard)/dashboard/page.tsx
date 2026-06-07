import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tổng quan | Nest Ecom',
  description:
    'Quản lý cửa hàng của bạn với Nest Ecom Dashboard. Theo dõi doanh số, quản lý sản phẩm, và tối ưu hóa hiệu suất kinh doanh của bạn một cách dễ dàng.',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section className="rounded-2xl border bg-linear-to-r from-primary/10 via-primary/5 to-background p-6">
        <h1 className="text-3xl font-bold">Xin chào 👋</h1>

        <p className="mt-2 text-muted-foreground">
          Chào mừng bạn quay trở lại hệ thống quản trị. Chúc bạn có một ngày làm việc hiệu quả.
        </p>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Tổng doanh thu"
          value="₫128.500.000"
          change="+12.5%"
          icon={<DollarSign className="size-5" />}
        />

        <StatCard title="Đơn hàng" value="1.245" change="+8.2%" icon={<ShoppingCart className="size-5" />} />

        <StatCard title="Khách hàng" value="856" change="+5.4%" icon={<Users className="size-5" />} />

        <StatCard title="Sản phẩm" value="320" change="+2.1%" icon={<Package className="size-5" />} />
      </section>

      {/* Content */}
      <section className="grid gap-4 xl:grid-cols-3">
        {/* Recent Orders */}
        <div className="xl:col-span-2 rounded-xl border p-5">
          <h2 className="mb-4 text-lg font-semibold">Đơn hàng gần đây</h2>

          <div className="space-y-4">
            {[
              {
                id: '#DH001',
                customer: 'Nguyễn Văn A',
                total: '₫1.250.000',
              },
              {
                id: '#DH002',
                customer: 'Trần Văn B',
                total: '₫2.400.000',
              },
              {
                id: '#DH003',
                customer: 'Lê Thị C',
                total: '₫890.000',
              },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{item.id}</p>
                  <p className="text-sm text-muted-foreground">{item.customer}</p>
                </div>

                <span className="font-semibold">{item.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border p-5">
          <h2 className="mb-4 text-lg font-semibold">Thao tác nhanh</h2>

          <div className="space-y-3">
            <QuickAction label="Tạo sản phẩm mới" />
            <QuickAction label="Tạo đơn hàng" />
            <QuickAction label="Quản lý khách hàng" />
            <QuickAction label="Xem báo cáo" />
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{title}</span>

        {icon}
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold">{value}</p>

        <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
          <ArrowUpRight className="size-4" />
          {change}
        </div>
      </div>
    </div>
  )
}

function QuickAction({ label }: { label: string }) {
  return <button className="w-full rounded-lg border p-3 text-left transition hover:bg-muted">{label}</button>
}
