import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PremiumDetail from '../components/PremiumDetail';
import { adminService } from '../lib/adminService';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await adminService.getServiceById(id);
                setService(data);
            } catch (error) {
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="premium-spinner"></div>
        </div>
    );

    if (!service) return (
        <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
            <h2>Service not found</h2>
            <Link to="/" className="btn btn-outline" style={{ marginTop: '2rem' }}>Back to Home</Link>
        </div>
    );

    return (
        <PremiumDetail
            category={
                service.category === 'it-solutions' ? 'IT Infrastructure' :
                    service.category === 'wellness' ? 'Wellness Program' : 'Platform Enablement'
            }
            title={service.title}
            subtitle={service.subtitle}
            description={service.description}
            ctaText="Request Consultation"
            ctaAction={() => {
                let sType = 'it';
                if (service.category === 'wellness') {
                    sType = 'wellness';
                } else if (service.category === 'platform-enablement' || service.category === 'platform') {
                    sType = 'platform';
                }
                navigate('/service-form', { state: { serviceType: sType, serviceTitle: service.title } });
            }}
            imagePrimary={service.image_url}
            imageSecondary={service.image_url}
            benefits={service.benefits} // Pass benefits array
        />
    );
};

export default ServiceDetail;
