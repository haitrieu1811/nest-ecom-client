export default function DashboardFooter() {
  return (
    <footer className="w-full border-t bg-background py-4 px-6 flex items-center justify-between text-muted-foreground text-sm mt-8 rounded-b-xl">
      <span>© {new Date().getFullYear()} Nest Ecom Dashboard</span>
      <span>
        Được phát triển bởi{' '}
        <a target="_blank" href="https://yourcompany.com" className="underline hover:text-primary transition-colors">
          Tran Hai Trieu
        </a>
      </span>
    </footer>
  )
}
