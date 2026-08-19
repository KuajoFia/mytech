import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Phone, ArrowRight } from "lucide-react";
import { formatDate, safeParse } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

// ISR — refresh article every hour
export const revalidate = 3600;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const tags = safeParse<string[]>(post.tags, []);

  const related = await db.blogPost.findMany({
    where: { published: true, slug: { not: post.slug } },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-brand mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Tous les articles
          </Link>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(post.createdAt)}
            </span>
            <span>·</span>
            <span>AGBE-TECH</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-5">{post.excerpt}</p>

          {tags.length > 0 && (
            <div className="flex gap-2 mb-8">
              {tags.map((t) => (
                <Badge key={t} variant="outline" className="text-xs">#{t}</Badge>
              ))}
            </div>
          )}

          <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-brand prose-strong:text-foreground">
            <ReactMarkdown
              components={{
                h2: ({ children }) => <h2 className="font-display text-xl font-bold mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="font-display text-lg font-bold mt-5 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-foreground/90 leading-relaxed mb-3">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3">{children}</ol>,
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
                  className="inline-flex items-center gap-2 border rounded-md px-4 text-sm font-medium hover:bg-background"
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
                <Card key={r.id} className="overflow-hidden hover:shadow-brand">
                  <Link href={`/blog/${r.slug}`} className="block aspect-video bg-brand-gradient" />
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
