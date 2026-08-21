import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDate, safeParse } from "@/lib/utils";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Blog & conseils — AGBE-TECH",
  description:
    "Conseils techniques sur l'installation de caméras, panneaux solaires, câblage réseau et électricité à Lomé, Togo.",
  alternates: { canonical: "/blog" },
};

// ISR — refresh blog list every hour

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <section className="bg-brand-gradient text-white py-14">
        <div className="container mx-auto px-4 max-w-3xl">
          <Badge className="mb-3 bg-accent-yellow text-black hover:bg-accent-yellow">Blog & conseils</Badge>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold">
            Conseils d&apos;experts pour vos projets tech & énergie
          </h1>
          <p className="mt-4 text-white/85 text-lg">
            Guides d&apos;achat, comparatifs techniques, astuces de maintenance — par nos techniciens certifiés.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Aucun article pour l&apos;instant.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => {
                const tags = safeParse<string[]>(p.tags, []);
                return (
                  <Card key={p.id} className="overflow-hidden hover:shadow-brand transition-all">
                    <Link href={`/blog/${p.slug}`} className="block aspect-video bg-brand-gradient relative">
                      <div className="absolute inset-0 flex items-center justify-center text-white/80">
                        <span className="text-xs uppercase tracking-widest">Article</span>
                      </div>
                    </Link>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(p.createdAt)}
                      </div>
                      <Link href={`/blog/${p.slug}`}>
                        <h2 className="font-display font-bold leading-snug hover:text-brand transition">
                          {p.title}
                        </h2>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-1.5">
                          {tags.slice(0, 3).map((t) => (
                            <Badge key={t} variant="outline" className="text-[10px]">#{t}</Badge>
                          ))}
                        </div>
                        <Link href={`/blog/${p.slug}`} className="text-xs font-semibold text-brand inline-flex items-center hover:underline">
                          Lire <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
