import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Agrisupply chain</h3>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-gray-400">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-gray-400">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-gray-400">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-gray-400">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <p>Team Agrobots</p>
              <p>hiagro@gmail.com</p>
              <p>9840462211</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-gray-400">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-400">
                  Login / Register
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-400">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-400">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-400">
                  Shop
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Link</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-gray-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-400">
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          © Copyright. project 2024. All rights reserved
        </div>
      </div>
    </footer>
  );
}
