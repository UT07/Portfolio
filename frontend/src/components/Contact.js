import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Github, Linkedin, Music, Video, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProfessionalData, useDJData } from '../contexts/ContentContext';

const Contact = () => {
  const { isProfessional } = useTheme();
  const { data: professionalData } = useProfessionalData();
  const { data: djData } = useDJData();
  const contactData = (isProfessional ? professionalData?.contact : djData?.contact) || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const mailtoLink = `mailto:${contactData.email}?subject=Contact from Portfolio&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;

    // Show toast notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const inputErrorClass = isProfessional
    ? 'border-red-400 focus:border-red-500'
    : 'border-red-500 focus:border-red-400';

  return (
    <section
      id="contact"
      className={`py-24 md:py-32 relative overflow-hidden scroll-mt-24 ${isProfessional ? 'bg-white' : 'bg-transparent'}`}
    >
      {!isProfessional && <div className="absolute inset-0 bg-black/70 pointer-events-none" />}

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              isProfessional
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-neutral-900 border border-green-500/50 text-green-400'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Email client should open</p>
              <p className={`text-sm ${isProfessional ? 'text-green-600' : 'text-green-500/80'}`}>
                If not, email directly at {contactData.email}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight mb-4 ${
            isProfessional
              ? 'text-black'
              : 'text-white font-unbounded uppercase text-4xl md:text-6xl font-bold tracking-wide md:tracking-widest'
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
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                  className={`w-full px-4 py-3 ${
                    isProfessional
                      ? `bg-neutral-50 border rounded-xl focus:outline-none text-black ${errors.name ? inputErrorClass : 'border-neutral-200 focus:border-neutral-400'}`
                      : `bg-neutral-900 border focus:outline-none text-white font-space-mono ${errors.name ? inputErrorClass : 'border-white/10 focus:border-red-500'}`
                  } transition-colors`}
                  data-testid="contact-name-input"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
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
                  className={`w-full px-4 py-3 ${
                    isProfessional
                      ? `bg-neutral-50 border rounded-xl focus:outline-none text-black ${errors.email ? inputErrorClass : 'border-neutral-200 focus:border-neutral-400'}`
                      : `bg-neutral-900 border focus:outline-none text-white font-space-mono ${errors.email ? inputErrorClass : 'border-white/10 focus:border-red-500'}`
                  } transition-colors`}
                  data-testid="contact-email-input"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
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
                  rows="6"
                  className={`w-full px-4 py-3 ${
                    isProfessional
                      ? `bg-neutral-50 border rounded-xl focus:outline-none text-black ${errors.message ? inputErrorClass : 'border-neutral-200 focus:border-neutral-400'}`
                      : `bg-neutral-900 border focus:outline-none text-white font-space-mono ${errors.message ? inputErrorClass : 'border-white/10 focus:border-red-500'}`
                  } transition-colors resize-none`}
                  data-testid="contact-message-input"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-8 py-3 font-medium transition-all duration-300 ${
                  isProfessional
                    ? 'bg-black text-white rounded-full hover:bg-neutral-800'
                    : 'border border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-bold uppercase tracking-widest font-space-mono'
                }`}
                style={!isProfessional ? {
                  boxShadow: '0 0 15px rgba(255,26,64,0.3)'
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
                    : 'text-red-400 hover:text-red-300 font-space-mono'
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
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-5 h-5 text-black" />
                  </a>
                  <a
                    href={contactData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                    data-testid="contact-linkedin-link"
                    aria-label="LinkedIn Profile"
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
                    className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors font-space-mono text-sm uppercase tracking-wider"
                    data-testid="contact-soundcloud-link"
                    aria-label="SoundCloud Profile"
                  >
                    <Music className="w-4 h-4" />
                    SoundCloud
                  </a>
                  <a
                    href={contactData.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors font-space-mono text-sm uppercase tracking-wider"
                    data-testid="contact-youtube-link"
                    aria-label="YouTube Channel"
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
