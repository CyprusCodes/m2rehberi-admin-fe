import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Home, ArrowLeft, AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-neutral-800 text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-black dark:bg-white rounded-3xl flex items-center justify-center shadow-lg">
              <Search className="w-12 h-12 text-white dark:text-black" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-7xl font-black text-gray-900 dark:text-white">
                404
              </h1>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sayfa Bulunamadı
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
                Ana sayfaya dönerek devam edebilirsiniz.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild variant="outline" className="rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200">
                <Link href="/" className="flex items-center space-x-2 px-6 py-3">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Geri Dön</span>
                </Link>
              </Button>
              
              <Button asChild className="rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg transition-all duration-200 px-6 py-3">
                <Link href="/" className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-lg dark:border-gray-700 dark:bg-neutral-800">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Yardıma mı ihtiyacınız var? Destek ekibimizle iletişime geçin.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
