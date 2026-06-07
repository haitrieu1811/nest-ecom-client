import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingDown, TrendingUp } from 'lucide-react'

type SectionCardProps = {
  title: string
  description: string
  value: string
  trend: 'up' | 'down'
  trendValue: string
}

export default function SectionCard({ title, description, value, trend, trendValue }: SectionCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{value}</CardTitle>
        <CardAction>
          <Badge variant="outline">
            {trend === 'up' ? <TrendingUp /> : <TrendingDown />}
            {trendValue}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending {trend === 'up' ? 'up' : 'down'} this month{' '}
          {trend === 'up' ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
        </div>
        <div className="text-muted-foreground">Visitors for the last 6 months</div>
      </CardFooter>
    </Card>
  )
}
