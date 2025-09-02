import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center space-y-6 p-6">
        <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <ShieldX className="w-12 h-12 text-red-600 dark:text-red-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Yetkisiz Erişim</h1>
          <p className="text-muted-foreground">
            Bu sayfaya erişim yetkiniz bulunmamaktadır. Sadece yöneticiler bu alana erişebilir.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Geri Dön</span>
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Ana Sayfa</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
