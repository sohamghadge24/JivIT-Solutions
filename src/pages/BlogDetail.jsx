import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Tag, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ScrollReveal from '../animations/ScrollReveal';

const BlogDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;
                setPost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#09090b]">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 dark:text-zinc-400 font-mono text-sm tracking-widest uppercase">Decoding Perspectives...</p>
            </div>
        </div>
    );

    if (!post) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#09090b]">
            <div className="text-center">
                <h2 className="text-3xl font-medium tracking-tight text-slate-900 dark:text-white mb-6">Story missing in the archive.</h2>
                <Link to="/blog" className="inline-flex items-center px-6 py-3 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white transition-all text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Editorial
                </Link>
            </div>
        </div>
    );

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = post.content ? post.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
    const readingTime = Math.ceil(wordCount / 200) || 1;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#09090b] selection:bg-emerald-500/30">
            {/* Reading Progress Bar (Optional UI enhancement - keeping but via pure CSS/Native if wanted, but removing Framer Motion. So I'll remove it entirely for cleaner root.) */}
            <article className="pt-48 pb-24">
                {/* Header Section */}
                <header className="px-6 lg:px-8 max-w-4xl mx-auto mb-16 relative z-10">
                    <div className="flex flex-col gap-6">
                        <ScrollReveal className="flex items-center text-sm font-medium text-slate-500 dark:text-zinc-400 mb-8">
                            <Link to="/blog" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Insights
                            </Link>
                            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
                            <span className="text-slate-800 dark:text-zinc-300 truncate">{post.title}</span>
                        </ScrollReveal>

                        <ScrollReveal className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {post.category && (
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                                    <Tag className="w-3.5 h-3.5" />
                                    {post.category}
                                </span>
                            )}
                        </ScrollReveal>

                        <ScrollReveal>
                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                {post.title}
                            </h1>
                        </ScrollReveal>

                        {post.excerpt && (
                            <ScrollReveal>
                                <p className="text-xl md:text-2xl text-slate-600 dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
                                    {post.excerpt}
                                </p>
                            </ScrollReveal>
                        )}

                        <ScrollReveal className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-white/10 text-sm text-slate-500 dark:text-zinc-500">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={post.published_at}>
                                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                        month: 'long', day: 'numeric', year: 'numeric'
                                    })}
                                </time>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{readingTime} min read</span>
                            </div>
                        </ScrollReveal>
                    </div>
                </header>

                {/* Hero Image */}
                <ScrollReveal className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="aspect-[21/9] md:aspect-[2.5/1] rounded-3xl overflow-hidden bg-slate-200 dark:bg-white/5 relative border border-slate-200 dark:border-white/10 shadow-2xl">
                        <img
                            src={post.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
                    </div>
                </ScrollReveal>

                {/* Article Body */}
                <div className="px-6 lg:px-8 max-w-3xl mx-auto">
                    <ScrollReveal className="post-content-container text-lg md:text-xl text-slate-700 dark:text-zinc-300 leading-[1.8]">
                        <style>{`
                            .post-content-container h2 {
                                font-size: 2.25rem;
                                font-weight: 500;
                                margin-top: 3rem;
                                margin-bottom: 1.5rem;
                                color: var(--text-primary);
                                font-family: var(--font-heading);
                                letter-spacing: -0.02em;
                            }
                            .post-content-container h3 {
                                font-size: 1.75rem;
                                margin-top: 2rem;
                                margin-bottom: 1rem;
                                font-family: var(--font-heading);
                            }
                            .post-content-container p {
                                margin-bottom: 2rem;
                            }
                            .post-content-container a {
                                color: #10b981;
                                text-decoration: underline;
                                text-decoration-color: rgba(16, 185, 129, 0.4);
                                text-underline-offset: 4px;
                                transition: color 0.2s ease;
                            }
                            .post-content-container a:hover {
                                color: #059669;
                            }
                            .post-content-container ul, .post-content-container ol {
                                margin-bottom: 2rem;
                                padding-left: 2rem;
                            }
                            .post-content-container li {
                                margin-bottom: 0.5rem;
                            }
                            .post-content-container blockquote {
                                border-left: 4px solid #10b981;
                                padding: 1rem 1.5rem;
                                margin-bottom: 2rem;
                                background-color: rgba(16, 185, 129, 0.05);
                                font-style: italic;
                                border-radius: 0 8px 8px 0;
                            }
                            .post-content-container img {
                                border-radius: 16px;
                                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                                border: 1px solid rgba(0,0,0,0.05);
                                margin: 3rem 0;
                            }
                        `}</style>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </ScrollReveal>

                    {/* Footer Actions */}
                    <ScrollReveal className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Share Perspective</span>
                            <div className="flex gap-2">
                                <button className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 transition-colors" title="Share via Twitter">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                                </button>
                                <button className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 transition-colors" title="Share via LinkedIn">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
                                </button>
                                <button className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 transition-colors" title="Copy Link" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <Link to="/blog" className="px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-sm font-medium transition-colors text-slate-900 dark:text-white flex items-center gap-2">
                            Explore More Narratives <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                    </ScrollReveal>
                </div>
            </article>
        </main>
    );
};

export default BlogDetail;
