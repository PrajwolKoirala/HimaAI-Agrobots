import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "./product-card"
import { CategoryCard } from "./category-card"
import { Footer } from "./footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            AgriSupplyChain
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm">
              Home
            </Link>
            <Link href="/contact" className="text-sm">
              Contact
            </Link>
            <Link href="/about" className="text-sm">
              About
            </Link>
            <Link href="/signup" className="text-sm">
              Sign Up
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="What are you looking for?" className="w-[200px] pl-8" />
            </div>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#e8f5e9]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="py-12 md:py-24">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Fresh from the Farm, Delivered to You!
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Buy organic vegetables, fruits, and farm-fresh produce directly from local farmers
                </p>
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  Buy Now
                </Button>
              </div>
              <div className="relative h-[400px]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/E-Commerce%20HomePage-X9eIPgEPPdhLUpLTceX7pf99jUiuCk.png"
                  alt="Farm landscape with workers loading produce"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Today's Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Today's</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  ←
                </Button>
                <Button variant="outline" size="icon">
                  →
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ProductCard name="Potato" price="3 ETH" location="6,578" distance="100 KM" />
              <ProductCard name="Tomato" price="3 ETH" location="6,578" distance="100 KM" />
              <ProductCard name="Potato" price="3 ETH" location="6,578" distance="100 KM" />
              <ProductCard name="Potato" price="3 ETH" location="6,578" distance="100 KM" />
            </div>
            <div className="flex justify-center mt-8">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white">View All Products</Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">Browse By Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <CategoryCard name="Vegetables" icon="🥬" />
              <CategoryCard name="Fruits" icon="🍎" />
              <CategoryCard name="Grains and cereals" icon="🌾" />
              <CategoryCard name="Seasonal Specials" icon="🌿" isActive={true} />
              <CategoryCard name="Meat" icon="🥩" />
              <CategoryCard name="Organic produce" icon="🥗" />
            </div>
          </div>
        </section>

        {/* Explore Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Explore Our Products</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  ←
                </Button>
                <Button variant="outline" size="icon">
                  →
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCard key={i} name="Potato" price="3 ETH" location="6,578" distance="100 KM" />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white">View All Products</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

