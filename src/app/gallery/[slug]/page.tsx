import { notFound } from 'next/navigation'
import ClientGalleryViewer from '@/components/ClientGalleryViewer'
import { supabase } from '@/lib/supabase'

async function getGallery(slug: string) {
  const { data } = await supabase
    .from('client_galleries')
    .select('id, client_name, description, shoot_date, password_hash')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

export default async function ClientGalleryPage({ params }: { params: { slug: string } }) {
  const gallery = await getGallery(params.slug)
  if (!gallery) notFound()

  return (
    <ClientGalleryViewer
      galleryId={gallery.id}
      clientName={gallery.client_name}
      description={gallery.description}
      shootDate={gallery.shoot_date}
      passwordHash={gallery.password_hash}
      slug={params.slug}
    />
  )
}