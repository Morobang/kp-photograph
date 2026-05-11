import { supabase } from '@/lib/supabase'
import SectionLabel from '@/components/SectionLabel'
import Reveal from '@/components/Reveal'
import Link from 'next/link'
import Image from 'next/image'

async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_path, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
  return data ?? []
}

export default async function JournalPage() {
  const posts = await getPosts()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  return (
    <div className="pt-24 md:pt-32">
      <section className="px-6 md:px-14 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <SectionLabel text="Journal" />
            <h1 className="font-serif font-bold text-4xl md:text-6xl text-paper mb-4" style={{ lineHeight: 1.05 }}>
              Behind the Lens
            </h1>
            <p className="font-body font-light text-muted text-sm md:text-base leading-relaxed max-w-xl mb-16">
              Stories, tips and behind the scenes from shoots across South Africa.
            </p>
          </Reveal>

          {posts.length === 0 ? (
            <Reveal>
              <p className="font-body font-light text-muted text-sm">No posts yet — check back soon.</p>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 100}>
                  <Link href={`/journal/${post.slug}`} className="group block">
                    {/* Cover image */}
                    <div className="relative aspect-[4/3] bg-mid overflow-hidden mb-5">
                      {post.cover_path ? (
                        <Image
                          src={`${supabaseUrl}/storage/v1/object/public/photos/${post.cover_path}`}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-mid to-ink flex items-center justify-center">
                          <span className="font-serif text-4xl font-black text-gold/20">
                            {post.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/10 transition-colors duration-300" />
                    </div>

                    {/* Meta */}
                    {post.published_at && (
                      <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-2">
                        {new Date(post.published_at).toLocaleDateString('en-ZA', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    )}

                    <h2 className="font-serif text-xl font-bold text-paper mb-2 group-hover:text-gold-light transition-colors duration-200" style={{ lineHeight: 1.2 }}>
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="font-body font-light text-muted text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <p className="font-cond text-xs tracking-[0.15em] uppercase text-gold/60 group-hover:text-gold mt-3 transition-colors duration-200">
                      Read More →
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}