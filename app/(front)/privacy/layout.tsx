import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası - Privacy Policy | Oyna.gg',
  description: 'Gizlilik politikamız. Kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu öğrenin.',
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

