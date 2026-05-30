import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, ShieldCheck, Activity, Users, ArrowRight, ExternalLink, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const specialities = [
    "Critical Care & Emergency Services", "Cardiology", "Cardiac Surgery", "Orthopaedics and Spine Surgery", 
    "Paediatric Surgery", "Bone Marrow Transplant", "Ophthalmology", "Dermatology", "Neurosurgery", 
    "Neurology", "ENT", "Neonatology", "Neonatal Surgery", "Gastroenterology & Hepatology", 
    "Clinical Haematology & Haemato Oncology", "Maxillofacial surgery", "Thoracic & Vascular Surgery", 
    "Paediatric Medicine", "Endocrinology", "Nephrology", "Liver Transplant", "Kidney Transplant", 
    "Medical Genetics", "Psychiatry", "Psychology", "Developmental Paediatrics", "Rheumatology", 
    "Plastic Surgery", "Onco Surgery", "Obstetrics and Gynaecology", "Pulmonology"
  ];

  const therapies = [
    "Vision Therapy", "Behavioural Therapy", "Audio Therapy", "Prosthetics & Orthotics",
    "Occupational Therapy", "Speech & Language Therapy", "Physiotherapy", "Sp. Education Dept.",
    "Psychological Assessments", "Special & Remedial Education Therapy"
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Top Pre-Header Contact Info */}
      <div style={{ 
        backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem 2rem', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' 
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> +91 8655998568/69 | +91 8655998570</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> info@srcc.org.in</span>
        </div>
        <div style={{ display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
          <em>"Health, Hope and Happiness"</em>
        </div>
      </div>

      {/* Main Header */}
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <HeartPulse size={28} color="var(--primary)" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', lineHeight: 1.2 }}>SRCC</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Society for Rehabilitation of Crippled Children</span>
          </div>
        </div>
        
        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', gap: '1.5rem', alignItems: 'center', '@media (min-width: 1024px)': { display: 'flex' } }}>
          {['About', 'Services', 'Facilities', 'Events', 'Gallery', 'Contact'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }} className="hover-opacity">
              {link}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline" onClick={() => navigate('/role-selection')}>Sign In</Button>
          <Button variant="primary" onClick={() => navigate('/role-selection')}>Book Appointment</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 2rem 5rem', 
        background: 'linear-gradient(135deg, var(--secondary) 0%, var(--bg-main) 100%)',
        textAlign: 'center', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '900px', margin: '0 auto' }}
        >
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            Welcome to SRCC Centre for Child Development
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            Health, Hope and <span style={{ color: 'var(--primary)' }}>Happiness</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            The first institution of its kind in India where a pediatric hospital and a therapy centre work together for the benefit of children. We have helped more than a hundred thousand children.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button variant="primary" size="lg" onClick={() => navigate('/role-selection')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Schedule a Visit <ArrowRight size={20} />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* History & Philosophy Section */}
      <section id="about" style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', '@media (min-width: 900px)': { gridTemplateColumns: '1fr 1fr' } }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Welcome to SRCC</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              In 1947, a group of dedicated volunteers started a small clinic in a doctor’s waiting room for the treatment of children afflicted with poliomyelitis. The continued efforts of these few persons resulted in the birth of this Society.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Pandit Jawaharlal Nehru became a patron, and was instrumental in the grant of land to Society for Rehabilitation of Crippled Children (SRCC) at Haji Ali. Since then it has been a society serving the needs of Children, from all sections of society.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.7 }}>
              The aim of SRCC is to organize hospitals and clinics for the diagnosis, care, and treatment of children; and children in need of alternate support. All services have to be child friendly, giving Health Hope and Happiness.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ padding: '2rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Our Main Philosophy</h3>
              <p style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontStyle: 'italic' }}>"No child should be refused treatment for want of money."</p>
            </div>
            <div style={{ padding: '2rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reinventing the Wheel Constantly</h3>
              <p style={{ color: 'var(--text-secondary)' }}>At SRCC, we reinvent the wheel constantly, thereby achieving exemplary quality levels.</p>
            </div>
            <div style={{ padding: '2rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>First of its Kind in India</h3>
              <p style={{ color: 'var(--text-secondary)' }}>SRCC is the first institution of its kind where a pediatric hospital and a therapy centre are working together for the benefit of children.</p>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Centre for Child Development */}
      <section id="facilities" style={{ padding: '6rem 2rem', backgroundColor: 'var(--primary)', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>SRCC Centre for Child Development</h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
              The Society has expanded its facilities to treat various ailments affecting children by establishing this Centre. It aims to be a one-stop-shop for children from different backgrounds and from across India by housing various physical and mental therapies and treatment solutions under one roof.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {therapies.map((therapy, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={20} color="var(--secondary)" style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>{therapy}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a 
              href="https://www.srcc.org.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 2rem', backgroundColor: 'white', color: 'var(--primary)', 
                borderRadius: 'var(--radius-full)', fontWeight: 600, transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
            >
              Know More About The Centre <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={{ backgroundColor: '#1E293B', color: '#94A3B8', padding: '5rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Organization Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'white' }}>
              <HeartPulse size={28} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.2 }}>SRCC</span>
              </div>
            </div>
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Society for Rehabilitation of Crippled Children. The first institution of its kind where a pediatric hospital and a therapy centre are working together.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Social placeholders */}
              <a href="#" style={{ color: '#94A3B8' }} className="hover-opacity">Facebook</a>
              <a href="#" style={{ color: '#94A3B8' }} className="hover-opacity">Youtube</a>
              <a href="#" style={{ color: '#94A3B8' }} className="hover-opacity">Instagram</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="#about" style={{ color: '#94A3B8', textDecoration: 'none' }} className="hover-opacity">About Us</a>
              <a href="#services" style={{ color: '#94A3B8', textDecoration: 'none' }} className="hover-opacity">Services & Facilities</a>
              <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }} className="hover-opacity">Words of Encouragement</a>
              <a href="https://www.srcc.org.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', textDecoration: 'none' }} className="hover-opacity">SRCC Children’s Hospital Website</a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <MapPin size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <span>1A Haji Ali Park, K. Khadye Marg, Mahalaxmi, Mumbai – 400034</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Phone size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>+91 8655998568/69 <br/> +91 8655998570</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Mail size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>info@srcc.org.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div style={{ 
          maxWidth: '1200px', margin: '0 auto', paddingTop: '2rem', 
          borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', 
          flexDirection: 'column', gap: '1rem', '@media (min-width: 768px)': { flexDirection: 'row', justifyContent: 'space-between' } 
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
            <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Disclaimer</a>
            <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Refund Policy</a>
            <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</a>
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            All Right Reserved © 2018 SRCC | Website by Media Fusion
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
