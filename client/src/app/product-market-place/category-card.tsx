import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  name: string
  icon: string
  isActive?: boolean
}

export function CategoryCard({ name, icon, isActive = false }: CategoryCardProps) {
  return (
    <Card className={`cursor-pointer transition-colors ${isActive ? "bg-[#e8f5e9]" : ""}`}>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <span className="text-3xl mb-2">{icon}</span>
        <span className="text-sm font-medium">{name}</span>
      </CardContent>
    </Card>
  )
}

