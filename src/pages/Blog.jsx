import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../lib/adminService';
import ScrollReveal from '../animations/ScrollReveal';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await adminService.getBlogs();
                if (data) setBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) return (
        <div className="container" style={{ padding: '150px 0', textAlign: 'center' }}>
            <p>Loading narratives...</p>
        </div>
    );

    return (
        <main className="blog-page">
            <section className="page-header">
                <ScrollReveal className="container">
                    <h1>Narratives</h1>
                    <p className="page-lead">Insights on technology, wellness, and the future of transformation.</p>
                </ScrollReveal>
            </section>

            <div className="container">
                <div className="blog-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '40px',
                    padding: '60px 0'
                }}>
                    {blogs.map((post) => (
                        <ScrollReveal key={post.id} className="blog-card">
                            <Link to={`/blog/${post.slug}`}>
                                <div className="blog-img" style={{
                                    height: '240px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    marginBottom: '1.5rem'
                                }}>
                                    <img
                                        src={post.image_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800"}
                                        alt={post.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="blog-info">
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                        {new Date(post.published_at).toLocaleDateString()}
                                    </span>
                                    <h3 style={{ margin: '0.5rem 0', fontSize: '1.5rem' }}>{post.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Blog;
