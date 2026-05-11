import { supabase } from '@/lib/supabase'
import SectionLabel from '@/components/SectionLabel'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

async function getPost(slug: string) {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  return (
    <div className="pt-24 md:pt-32">
      {/* Cover */}
      {post.cover_path && (
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden mb-12">
          <Image
            src={`${supabaseUrl}/storage/v1/object/public/photos/${post.cover_path}`}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>
      )}

      <article className="px-6 md:px-14 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <SectionLabel text="Journal" />
            {post.published_at && (
              <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-3">
                {new Date(post.published_at).toLocaleDateString('en-ZA', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            )}
            <h1 className="font-serif font-bold text-3xl md:text-5xl text-paper mb-4" style={{ lineHeight: 1.1 }}>
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="font-body font-light text-muted text-base md:text-lg leading-relaxed border-l-2 border-gold pl-4">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Content */}
          <div
            className="prose-kp"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
          />

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-paper/[0.08]">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 font-cond text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              Back to Journal
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}