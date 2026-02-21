import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PremiumDetail from '../components/PremiumDetail';
import { adminService } from '../lib/adminService';

const CareerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await adminService.getJobOpeningById(id);
                setJob(data);
            } catch (error) {
                console.error('Error fetching job:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="premium-spinner"></div>
        </div>
    );

    if (!job) return (
        <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
            <h2>Position not found</h2>
            <Link to="/careers" className="btn btn-outline" style={{ marginTop: '2rem' }}>Back to Careers</Link>
        </div>
    );

    return (
        <PremiumDetail
            category={`${job.department} • ${job.location}`}
            title={job.title}
            subtitle={job.type}
            description={job.description}
            ctaText="Apply for Position"
            ctaAction={() => navigate(`/careers/${job.id}/apply`)}
            imagePrimary="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" // Fallback or specific default for careers
            imageSecondary="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
        />
    );
};

export default CareerDetail;
