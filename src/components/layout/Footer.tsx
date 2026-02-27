import Link from 'next/link'
import Image from 'next/image'
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'

export default function Footer() {
  const socialLinks = [
    { icon: FaWhatsapp, href: 'https://wa.me/233XXXXXXXXX', label: 'WhatsApp', color: 'hover:text-green-500' },
    { icon: FaInstagram, href: 'https://instagram.com/bestchoicevco', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: FaFacebook, href: 'https://facebook.com/bestchoicevco', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: FaTiktok, href: 'https://tiktok.com/@bestchoicevco', label: 'TikTok', color: 'hover:text-black' },
  ]

  return (
    <>
      {/* Floating Social Icons for Mobile */}
      <div className="fixed right-4 bottom-24 z-50 flex flex-col space-y-3 md:hidden">
        {socialLinks.map((social, index) => {
          const Icon = social.icon
          return (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 bg-[#2c6e49] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${social.color}`}
              aria-label={social.label}
            >
              <Icon className="w-6 h-6" />
            </a>
          )
        })}
      </div>

      {/* Main Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container-custom py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info with Logo */}
            <div className="text-center lg:text-left">
              <Link href="/" className="inline-block mb-4">
                <div className="relative h-20 w-20 mx-auto lg:mx-0">
                  <Image
                    src="/images/logo.png"
                    alt="BestChoiceVCO Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
              <h3 className="text-2xl font-bold mb-3">BestChoiceVCO</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Premium Virgin Coconut Oil for your health, beauty, and culinary needs.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Shop', 'About', 'FAQ', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link 
                      href={`/${link.toLowerCase()}`} 
                      className="text-gray-400 hover:text-white transition text-base"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400 text-base">
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <span>📍</span>
                  <span>Accra, Ghana</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <span>📞</span>
                  <span>+233 XX XXX XXXX</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <span>✉️</span>
                  <span>info@bestchoicevco.com</span>
                </li>
              </ul>
            </div>

            {/* Social Links - Desktop */}
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <div className="flex justify-center lg:justify-start space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a 
                      key={index} 
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 ${social.color} transition text-2xl hover:scale-110 transform`}
                      aria-label={social.label}
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} BestChoice Virgin Coconut Oil. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
