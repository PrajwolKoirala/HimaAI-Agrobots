import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ProductCardProps {
  name: string
  price: string
  location: string
  distance: string
}

export function ProductCard({ name, price, location, distance }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-4" />
        <div className="space-y-1">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-blue-500">{price}</p>
          <div className="text-sm text-muted-foreground">
            <p>Location: {location}</p>
            <p>Distance: {distance}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <Button className="w-full rounded-none bg-black text-white hover:bg-gray-800">Add To Cart</Button>
      </CardFooter>
    </Card>
  )
}

