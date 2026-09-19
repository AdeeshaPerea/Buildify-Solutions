import React, { useState } from 'react';
import { Info, ShieldCheck, FileCode, GraduationCap, Wrench, Mail, Phone, MapPin, Clock, Send, Globe } from 'lucide-react';

export default function AboutSection({ company, contactSubject, setContactSubject, contactMessage, setContactMessage, onSubmitContact }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitContact({ name, email, subject: contactSubject, message: contactMessage });
    setName('');
    setEmail('');
    setContactSubject('');
    setContactMessage('');
  };

  return (
    <section className="view-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-eyebrow">
            <Info size={14} /> Who We Are
          </div>
          <h2 className="section-title">About Buildify Solutions</h2>
          <p className="section-desc">
            "WE BUILD. YOU GROW." — Bridging hardware electronics, IoT engineering, and real-world innovation in Sri Lanka and globally.
          </p>
        </div>
      </div>

      {/* Story & Values Hero */}
      <div className="about-hero-grid">
        <div className="about-story-card">
          <div className="story-lead">
            "We believe hands-on hardware engineering and digital systems should empower creators, students, and businesses to build without boundaries."
          </div>
          <p className="story-text">{company.story}</p>
          <div className="about-values-grid">
            <div className="value-item">
              <div className="value-icon"><ShieldCheck size={26} /></div>
              <div className="value-title">100% Tested Hardware</div>
              <div className="value-desc">Every microcontroller and sensor is QA bench-tested before dispatch.</div>
            </div>
            <div className="value-item">
              <div className="value-icon"><FileCode size={26} /></div>
              <div className="value-title">Open Documentation</div>
              <div className="value-desc">Complete schematics, BOM lists, and verified firmware libraries.</div>
            </div>
            <div className="value-item">
              <div className="value-icon"><GraduationCap size={26} /></div>
              <div className="value-title">STEM & Student First</div>
              <div className="value-desc">Discounted educational bundles and capstone engineering mentorship.</div>
            </div>
            <div className="value-item">
              <div className="value-icon"><Wrench size={26} /></div>
              <div className="value-title">Custom Builds</div>
              <div className="value-desc">PCB layout, enclosure 3D printing, and turn-key device assembly.</div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <img 
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" 
            alt="Buildify Engineering Lab" 
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glow)', boxShadow: 'var(--shadow-orange-glow)' }} 
          />
        </div>
      </div>

      {/* Team Members */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="section-eyebrow">
          <GraduationCap size={14} /> Leadership & Innovators
        </div>
        <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Meet the Buildify Engineering Team</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Driven by Buildify Solutions embedded hardware architects and robotics specialists.
        </p>
        <div className="team-grid">
          {company.team.map((member, idx) => (
            <div key={idx} className="team-card">
              <img src={member.avatar} alt={member.name} className="team-avatar" />
              <h3 className="team-name">{member.name}</h3>
              <div className="team-role">{member.role}</div>
              <p className="team-bio">{member.bio}</p>
              <div style={{ marginTop: '1rem' }}>
                <span className="tag-badge" style={{ color: 'var(--accent-orange)', borderColor: 'var(--border-glow)' }}>
                  {member.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Custom Inquiries matching business card */}
      <div id="contactFormWrap" className="contact-section-grid">
        <div className="contact-info-card">
          <div>
            <div className="section-eyebrow"><Mail size={14} /> Let's Connect</div>
            <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>Have a Project or Custom Order?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Reach out to the Buildify Solutions engineering team for component sourcing, bulk student kits, custom IoT builds, or technical support.
            </p>
          </div>

          <div className="contact-detail-row">
            <div className="contact-icon-box"><Phone size={20} /></div>
            <div>
              <div className="contact-label">Direct Hotline</div>
              <div className="contact-val">{company.phone} / {company.internationalPhone}</div>
            </div>
          </div>

          <div className="contact-detail-row">
            <div className="contact-icon-box"><Mail size={20} /></div>
            <div>
              <div className="contact-label">Official Email</div>
              <div className="contact-val">{company.email}</div>
            </div>
          </div>

          <div className="contact-detail-row">
            <div className="contact-icon-box"><Globe size={20} /></div>
            <div>
              <div className="contact-label">Website</div>
              <div className="contact-val">{company.website}</div>
            </div>
          </div>

          <div className="contact-detail-row">
            <div className="contact-icon-box"><MapPin size={20} /></div>
            <div>
              <div className="contact-label">Headquarters</div>
              <div className="contact-val">{company.location}</div>
            </div>
          </div>

          <div className="contact-detail-row">
            <div className="contact-icon-box"><Clock size={20} /></div>
            <div>
              <div className="contact-label">Working Hours</div>
              <div className="contact-val">{company.workingHours}</div>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Send a Message / Custom Build Inquiry</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="contactName">Full Name *</label>
                <input 
                  type="text" 
                  id="contactName" 
                  className="form-control" 
                  placeholder="e.g. Sarah Connor" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contactEmail">Email Address *</label>
                <input 
                  type="email" 
                  id="contactEmail" 
                  className="form-control" 
                  placeholder="sarah@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactSubject">Inquiry Topic</label>
              <input 
                type="text" 
                id="contactSubject" 
                className="form-control" 
                placeholder="e.g. Custom IoT Farming Prototype / Bulk Starter Kits" 
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactMessage">Project Details & Requirements *</label>
              <textarea 
                id="contactMessage" 
                className="form-control" 
                placeholder="Describe your required sensors, controllers, quantities, or deadlines..." 
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} /> Send Inquiry to Engineering Team
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
