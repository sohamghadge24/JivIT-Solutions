import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PremiumDetail from '../components/PremiumDetail';
import { adminService } from '../lib/adminService';

const StudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const data = await adminService.getStudentProgramById(id);
                setProgram(data);
            } catch (error) {
                console.error('Error fetching program:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProgram();
    }, [id]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="premium-spinner"></div>
        </div>
    );

    if (!program) return (
        <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
            <h2>Program not found</h2>
            <Link to="/students" className="btn btn-outline" style={{ marginTop: '2rem' }}>Back to Programs</Link>
        </div>
    );

    return (
        <PremiumDetail
            category={program.category === 'research' ? 'Research Initiative' : 'Career Program'}
            title={program.title}
            subtitle={program.subtitle}
            description={program.description}
            ctaText="Apply Now"
            ctaAction={() => navigate(`/students/${id}/apply`)}
            imagePrimary={program.image_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"}
            // Use same image or a fallback/secondary one if available for the cutout
            imageSecondary={program.image_url || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"}
        />
    );
};

export default StudentDetail;
