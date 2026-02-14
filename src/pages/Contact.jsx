import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiPhone, FiMail, FiMapPin, FiClock, FiSend,
} from 'react-icons/fi'
import Button from '../components/Button'
import ScrollReveal from '../components/ScrollReveal'

const contactInfo = [
  { icon: <FiMapPin />, title: 'Visit Us', lines: ['123 Mobile Street', 'Tech City, pakistan 400001'] },
  { icon: <FiPhone />, title: 'Call Us', lines: ['+92 987 43210', '+92 965 43211'] },
  { icon: <FiMail />, title: 'Email Us', lines: ['hello@mothsinmobiles.com', 'support@mothsinmobiles.com'] },
  { icon: <FiClock />, title: 'Working Hours', lines: ['Mon – Sat: 10 AM – 9 PM', 'Sunday: 11 AM – 7 PM'] },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Will connect to backend API later
  }

  const inputClasses =
    'w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Contact Us</h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Have a question or need help? We'd love to hear from you. Reach out through any channel below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact Info Cards ─── */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-surface border border-border rounded-2xl p-6 text-center hover:border-primary/30 hover:shadow-lg transition-all h-full"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary text-xl">{info.icon}</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{info.title}</h3>
                  {info.lines.map((line, j) => (
                    <p key={j} className="text-sm text-muted">{line}</p>
                  ))}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Form + Map ─── */}
      <section className="py-12 lg:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <ScrollReveal className="lg:col-span-3">
              <div className="bg-background border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Send us a Message</h2>
                <p className="text-sm text-muted mb-8">
                  Fill in the form below and we'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="Product enquiry"
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      className={`${inputClasses} resize-none`}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" icon={<FiSend />}>
                    Send Message
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            {/* Map placeholder */}
            <ScrollReveal className="lg:col-span-2" direction="right">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-2xl h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center p-6">
                  <FiMapPin className="text-5xl text-primary/30 mx-auto mb-4" />
                  <h3 className="font-bold text-foreground mb-2">Find Us Here</h3>
                  <p className="text-sm text-muted">
                    123 Mobile Street, Tech City, pakistan 400001
                  </p>
                  <p className="text-xs text-muted mt-4">
                    Map integration will be added here
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}