import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Github, Linkedin, Music, Video } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import professionalData from '../data/professionalData.json';
import djData from '../data/djData.json';

const Contact = () => {
  const { isProfessional } = useTheme();
  const contactData = isProfessional ? professionalData.contact : djData.contact;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:${contactData.email}?subject=Contact from Portfolio&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <section 
      id="contact" 
      className={`py-24 md:py-32 ${isProfessional ? 'bg-white' : 'bg-black'}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight mb-4 ${
            isProfessional 
              ? 'text-black' 
              : 'text-white font-unbounded uppercase text-4xl md:text-6xl font-bold tracking-widest'
          }`}>
            {isProfessional ? 'Contact' : (djData.contact.booking_title || 'Contact')}
          </h2>
          <p className={`text-base md:text-lg ${
            isProfessional 
              ? 'text-neutral-600' 
              : 'text-neutral-400 font-space-mono text-sm md:text-base font-medium tracking-wide'
          }`}>
            {isProfessional 
              ? 'Get in touch for opportunities and collaborations' 
              : djData.contact.booking_description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="name" 
                  className={`block text-sm font-medium mb-2 ${
                    isProfessional ? 'text-neutral-700' : 'text-neutral-400 font-space-mono uppercase tracking-wider'
                  }`}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 ${
                    isProfessional
                      ? 'bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-400 focus:outline-none text-black'
                      : 'bg-neutral-900 border border-white/10 focus:border-fuchsia-500 focus:outline-none text-white font-space-mono'
                  } transition-colors`}
                  data-testid="contact-name-input"
                />
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className={`block text-sm font-medium mb-2 ${
                    isProfessional ? 'text-neutral-700' : 'text-neutral-400 font-space-mono uppercase tracking-wider'
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 ${
                    isProfessional
                      ? 'bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-400 focus:outline-none text-black'
                      : 'bg-neutral-900 border border-white/10 focus:border-fuchsia-500 focus:outline-none text-white font-space-mono'
                  } transition-colors`}
                  data-testid="contact-email-input"
                />
              </div>

              <div>
                <label 
                  htmlFor="message" 
                  className={`block text-sm font-medium mb-2 ${
                    isProfessional ? 'text-neutral-700' : 'text-neutral-400 font-space-mono uppercase tracking-wider'
                  }`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className={`w-full px-4 py-3 ${
                    isProfessional
                      ? 'bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-400 focus:outline-none text-black'
                      : 'bg-neutral-900 border border-white/10 focus:border-fuchsia-500 focus:outline-none text-white font-space-mono'
                  } transition-colors resize-none`}
                  data-testid="contact-message-input"
                />
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-8 py-3 font-medium transition-all duration-300 ${
                  isProfessional
                    ? 'bg-black text-white rounded-full hover:bg-neutral-800'
                    : 'border border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black font-bold uppercase tracking-widest font-space-mono'
                }`}
                style={!isProfessional ? {
                  boxShadow: '0 0 15px rgba(217,70,239,0.3)'
                } : {}}
                data-testid="contact-submit-button"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${
                isProfessional 
                  ? 'text-black' 
                  : 'text-white font-unbounded uppercase tracking-widest'
              }`}>
                Direct Contact
              </h3>
              <a
                href={`mailto:${contactData.email}`}
                className={`flex items-center gap-3 text-lg ${
                  isProfessional 
                    ? 'text-neutral-700 hover:text-black' 
                    : 'text-cyan-400 hover:text-cyan-300 font-space-mono'
                } transition-colors`}
              >
                <Mail className="w-5 h-5" />
                {contactData.email}
              </a>
            </div>

            {isProfessional ? (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-black">Connect</h3>
                <div className="flex gap-4">
                  <a
                    href={contactData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                    data-testid="contact-github-link"
                  >
                    <Github className="w-5 h-5 text-black" />
                  </a>
                  <a
                    href={contactData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                    data-testid="contact-linkedin-link"
                  >
                    <Linkedin className="w-5 h-5 text-black" />
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-4 text-white font-unbounded uppercase tracking-widest">
                  Listen & Watch
                </h3>
                <div className="flex gap-4">
                  <a
                    href={contactData.social.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors font-space-mono text-sm uppercase tracking-wider"
                    data-testid="contact-soundcloud-link"
                  >
                    <Music className="w-4 h-4" />
                    SoundCloud
                  </a>
                  <a
                    href={contactData.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/10 transition-colors font-space-mono text-sm uppercase tracking-wider"
                    data-testid="contact-youtube-link"
                  >
                    <Video className="w-4 h-4" />
                    YouTube
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
