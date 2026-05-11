import { supabase } from '@/lib/supabase'
import SectionLabel from '@/components/SectionLabel'
import Link from 'next/link'
import Image from 'next/image'

async function getLatestPosts() {
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_path, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(2)
  return data ?? []
}

export default async function JournalTeaser({ supabaseUrl }: { supabaseUrl: string }) {
  const posts = await getLatestPosts()
  if (posts.length === 0) return null

  return (
    <section className="bg-ink px-6 md:px-14 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel text="Journal" />
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-paper mt-2" style={{ lineHeight: 1.1 }}>
              Behind the Lens
            </h2>
          </div>
          <Link
            href="/journal"
            className="hidden md:inline-flex font-cond text-xs tracking-[0.2em] uppercase text-gold border border-gold/40 px-5 py-2.5 hover:bg-gold hover:text-ink transition-all duration-300"
          >
            All Posts →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => (
            <Link key={post.id} href={`/journal/${post.slug}`} className="group">
              <div className="relative aspect-[16/9] bg-mid overflow-hidden mb-5">
                {post.cover_path ? (
                  <Image
                    src={`${supabaseUrl}/storage/v1/object/public/photos/${post.cover_path}`}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-mid to-off flex items-center justify-center">
                    <span className="font-serif text-5xl font-black text-gold/15">{post.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              {post.published_at && (
                <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-2">
                  {new Date(post.published_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              <h3 className="font-serif text-xl font-bold text-paper group-hover:text-gold-light transition-colors duration-200 mb-2">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="font-body font-light text-muted text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/journal"
            className="font-cond text-xs tracking-[0.2em] uppercase text-gold border border-gold/40 px-5 py-2.5 hover:bg-gold hover:text-ink transition-all duration-300 inline-flex"
          >
            All Posts →
          </Link>
        </div>
      </div>
    </section>
  )
}