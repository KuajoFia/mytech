import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Phone, ArrowRight, Search } from "lucide-react";
import { formatDate, safeParse } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/site/json-ld";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await db.blogPost.findUnique({ where: { slug } });
    if (post) {
      return {
        title: post.title,
        description: post.excerpt,
        alternates: { canonical: `/blog/${post.slug}` },
      };
    }
  } catch {}
  return { title: "Article introuvable" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: any = null;
  let related: any[] = [];
  let dbError = false;

  try {
    post = await db.blogPost.findUnique({ where: { slug } });
    if (post && post.published) {
      related = await db.blogPost.findMany({
        where: { published: true, slug: { not: post.slug } },
        take: 3,
        orderBy: { createdAt: "desc" },
      });
    } else if (!post) {
      related = await db.blogPost.findMany({
        where: { published: true },
        take: 3,
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (e) {
    console.error("BlogPostPage DB error:", e);
    dbError = true;
  }

  if (dbError) {
    return <DBError />;
  }

  if (!post || !post.published) {
    return <ArticleNotFound related={related} />;
  }

  const tags = safeParse<string[]>(post.tags, []);

  return (
    <>
      {/* JSON-LD for SEO */}
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        image={post.cover || undefined}
        url={`/blog/${post.slug}`}
        datePublished={post.createdAt}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-brand mb-6 transition">
            <ArrowLeft className="h-4 w-4 mr-1" /> Tous les articles
          </Link>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(post.createdAt)}
            </span>
            <span>·</span>
            <span>AGBE-TECH</span>
            <span>·</span>
            <span>5 min de lecture</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-5 leading-relaxed">{post.excerpt}</p>

          {tags.length > 0 && (
            <div className="flex gap-2 mb-8 flex-wrap">
              {tags.map((t) => (
                <Badge key={t} variant="outline" className="text-xs">#{t}</Badge>
              ))}
            </div>
          )}

          <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-brand prose-strong:text-foreground">
            <ReactMarkdown
              components={{
                h2: ({ children }) => <h2 className="font-display text-xl font-bold mt-8 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="font-display text-lg font-bold mt-6 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-foreground/90 leading-relaxed mb-4">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4">{children}</ol>,
                li: ({ children }) => <li className="text-foreground/90">{children}</li>,
                strong: ({ children }) => <strong className="text-brand font-semibold">{children}</strong>,
                a: ({ href, children }) => <a href={href} className="text-brand hover:underline">{children}</a>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <Card className="mt-10 bg-secondary border-0">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <h3 className="font-display font-bold text-lg mb-1">Besoin d&apos;un devis personnalisé ?</h3>
                <p className="text-sm text-muted-foreground">
                  Nos techniciens répondent sous 24h ouvrées. Déplacement gratuit à Lomé.
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild className="bg-brand hover:bg-brand-light">
                  <Link href="/contact?devis=1">Demander un devis <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <a
                  href="tel:+22898897914"
                  className="inline-flex items-center gap-2 border rounded-md px-4 text-sm font-medium hover:bg-background transition"
                >
                  <Phone className="h-4 w-4" /> Appeler
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-display text-xl font-bold mb-6">À lire également</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Card key={r.id} className="overflow-hidden card-hover">
                  <Link href={`/blog/${r.slug}`} className="block aspect-video bg-mesh" />
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">{formatDate(r.createdAt)}</div>
                    <Link href={`/blog/${r.slug}`} className="font-semibold text-sm hover:text-brand line-clamp-2">
                      {r.title}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ArticleNotFound({ related }: { related: any[] }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
          <Search className="h-10 w-10 text-muted-foreground/60" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          Article introuvable
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Cet article n&apos;existe plus ou n&apos;a pas encore été publié. Découvrez nos derniers articles ci-dessous.
        </p>
        <Button asChild className="bg-brand hover:bg-brand-light">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" /> Tous les articles
          </Link>
        </Button>
      </div>

      {related.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {related.map((r) => (
            <Card key={r.id} className="overflow-hidden card-hover">
              <Link href={`/blog/${r.slug}`} className="block aspect-video bg-mesh" />
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">{formatDate(r.createdAt)}</div>
                <Link href={`/blog/${r.slug}`} className="font-semibold text-sm hover:text-brand line-clamp-2">
                  {r.title}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function DBError() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-3xl font-bold mb-3">Blog temporairement indisponible</h1>
        <p className="text-muted-foreground mb-6">
          Nos articles sont en cours de synchronisation. Revenez dans quelques instants.
        </p>
        <Button asChild className="bg-brand hover:bg-brand-light">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  );
}
