'use client'

import { ArrowUp, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, RotateCcw, Shield, Truck, Sparkles, Heart, Star } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-rose-50 text-gray-800">
      {/* Trust Badges Section */}
      <div className="border-b border-rose-200 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-7 h-7 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">দ্রুত ডেলিভারি</h3>
                <p className="text-xs sm:text-sm text-gray-500">সারা দেশে ২-৩ দিনে</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">নিরাপদ পেমেন্ট</h3>
                <p className="text-xs sm:text-sm text-gray-500">১০০% সুরক্ষিত লেনদেন</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-end">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-7 h-7 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">সহজ রিটার্ন</h3>
                <p className="text-xs sm:text-sm text-gray-500">৭ দিনের গ্যারান্টি</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Glow Beauty</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Glow Beauty Shop হল বাংলাদেশের শীর্ষস্থানীয় অনলাইন বিউটি প্রোডাক্টের প্ল্যাটফর্ম যেখানে আমরা গুণমান, সাশ্রয়ী মূল্য এবং দ্রুত সেবা নিশ্চিত করি। আপনার সৌন্দর্যের যাত্রায় আমরা আপনার পাশে আছি।
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-all hover:shadow-lg hover:scale-110 text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-pink-400 hover:bg-pink-500 rounded-full flex items-center justify-center transition-all hover:shadow-lg hover:scale-110 text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all hover:shadow-lg hover:scale-110 text-white">
                <Heart className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-rose-600 hover:bg-rose-700 rounded-full flex items-center justify-center transition-all hover:shadow-lg hover:scale-110 text-white">
                <Star className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-800 font-bold text-lg mb-6 border-b border-rose-200 pb-3">দ্রুত লিংক</h4>
            <ul className="space-y-3">
              {['নতুন প্রোডাক্ট', 'বেস্ট সেলার', 'বিশেষ অফার', 'বিউটি ব্লগ', 'মেকআপ টিউটোরিয়াল'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-600 hover:text-pink-600 transition-colors text-sm font-medium">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-gray-800 font-bold text-lg mb-6 border-b border-rose-200 pb-3">গ্রাহক সেবা</h4>
            <ul className="space-y-3">
              {['আমাদের সম্পর্কে', 'যোগাযোগ করুন', 'রিটার্ন নীতি', 'শিপিং নীতি', 'গোপনীয়তা নীতি'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-600 hover:text-pink-600 transition-colors text-sm font-medium">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gray-800 font-bold text-lg mb-6 border-b border-rose-200 pb-3">যোগাযোগ করুন</h4>
            <div className="space-y-4">
              <div className="flex gap-3 items-start group">
                <Phone className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <div>
                  <p className="text-gray-500 text-xs">সাপোর্ট হটলাইন</p>
                  <a href="tel:+88017230000000" className="text-gray-800 font-bold hover:text-pink-600 transition-colors">+88 01723-000000</a>
                </div>
              </div>
              <div className="flex gap-3 items-start group">
                <Mail className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <div>
                  <p className="text-gray-500 text-xs">ইমেল</p>
                  <a href="mailto:contact@glowbeauty.com.bd" className="text-gray-800 font-bold hover:text-pink-600 transition-colors">contact@glowbeauty.com.bd</a>
                </div>
              </div>
              <div className="flex gap-3 items-start group">
                <MapPin className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <div>
                  <p className="text-gray-500 text-xs">ঠিকানা</p>
                  <p className="text-gray-800 font-bold">ঢাকা, বাংলাদেশ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="border-t border-rose-200 pt-10 mb-10">
          <h4 className="text-gray-800 font-bold text-lg mb-6">জনপ্রিয় ক্যাটাগরি</h4>
          <div className="flex flex-wrap gap-3">
            {['স্কিন কেয়ার', 'মেকআপ', 'হেয়ার কেয়ার', 'পারফিউম', 'বডি কেয়ার', 'মেনস গ্রুমিং', 'বিউটি টুলস', 'ন্যাচারাল প্রোডাক্ট'].map((category) => (
              <Link
                key={category}
                href="#"
                className="bg-white hover:bg-pink-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-pink-700 transition-all border border-rose-200 hover:border-pink-300"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-rose-200 pt-10 mb-10">
          <h4 className="text-gray-800 font-bold text-lg mb-6">আমরা গ্রহণ করি</h4>
          <div className="flex flex-wrap gap-3">
            {['বিকাশ', 'নগদ', 'রকেট', 'ক্রেডিট কার্ড', 'ডেবিট কার্ড', 'ব্যাংক ট্রান্সফার'].map((method) => (
              <div key={method} className="bg-white hover:bg-pink-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-pink-700 transition-all cursor-pointer border border-rose-200 hover:border-pink-300">
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-rose-200 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              © {new Date().getFullYear()} Glow Beauty Shop। সর্বাধিকার সংরক্ষিত। আমাদের প্রোডাক্ট এবং সেবা ব্যবহারের মাধ্যমে আপনি আমাদের শর্তাবলী স্বীকার করেন।
            </p>
            <div className="flex flex-wrap gap-4 sm:justify-end">
              <Link href="#" className="text-gray-500 hover:text-pink-600 transition-colors text-xs sm:text-sm font-medium">
                গোপনীয়তা নীতি
              </Link>
              <Link href="#" className="text-gray-500 hover:text-pink-600 transition-colors text-xs sm:text-sm font-medium">
                শর্তাবলী
              </Link>
              <Link href="#" className="text-gray-500 hover:text-pink-600 transition-colors text-xs sm:text-sm font-medium">
                সাইটম্যাপ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 z-40 group"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  )
}