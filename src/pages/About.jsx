import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiTarget, FiEye, FiHeart, FiUsers,
  FiZap, FiGlobe, FiArrowRight, FiSmartphone,
} from 'react-icons/fi'
import Button from '../components/Button'
import ScrollReveal from '../components/ScrollReveal'

const values = [
  { icon: <FiHeart />, title: 'Customer First', desc: 'Every decision we make starts with the customer in mind.' },
  { icon: <FiZap />, title: 'Innovation', desc: 'We stay ahead of trends to bring you cutting-edge technology.' },
  { icon: <FiUsers />, title: 'Community', desc: 'Building lasting relationships with customers and partners.' },
  { icon: <FiGlobe />, title: 'Accessibility', desc: 'Making premium technology accessible to everyone.' },
]

export default function About() {
  return (
    <>
      {/* ─── Hero Banner ─── */}
      <section className="bg-gradient-to-br from-primary-dark to-primary py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">About Us</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Learn about our journey, mission, and the values that drive us to deliver the best mobile experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Our Story ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                {/* <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-primary to-primary-dark rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20">
                </div> */}
                  {/* <FiSmartphone className="text-white/20 text-[100px]" /> */}
                  <img src="https://www.bestmobile.pk/shop_images/friends-mobile-pakistan---saddar-rawalpindi-m1vm.webp" alt="" className='rounded-2xl'  />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-2xl flex items-center justify-center shadow-xl rotate-6">
                  <p className="text-white font-extrabold text-2xl">8+</p>
                  <p className="text-white/80 text-xs ml-1">Years</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-3 mb-6">
                From a Small Shop to Your Trusted Mobile Partner
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Mohsin Mobiles started in 2016 as a small mobile accessories shop with a big dream — to make
                  quality technology accessible to everyone. Founded with a passion for cutting-edge mobile
                  technology, we began serving our local community with genuine products and honest pricing.
                </p>
                <p>
                  Over the years, we have grown into a trusted name in the mobile retail industry, serving
                  thousands of satisfied customers across multiple cities. Our commitment to authenticity,
                  customer satisfaction, and competitive pricing has been the cornerstone of our success.
                </p>
                <p>
                  Today, we carry the latest smartphones, tablets, wearables, and accessories from all major
                  brands, backed by genuine warranties and our dedicated after-sales support team.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Mission & Vision ─── */}
      {/* <section className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0}>
              <div className="bg-background border border-border rounded-2xl p-8 lg:p-10 h-full">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <FiTarget className="text-primary text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted leading-relaxed">
                  To provide every customer with the best mobile technology experience by offering genuine
                  products at competitive prices, backed by exceptional service and support. We strive to be
                  more than just a retailer — we want to be your technology partner.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="bg-background border border-border rounded-2xl p-8 lg:p-10 h-full">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <FiEye className="text-accent text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted leading-relaxed">
                  To become pakistan's most trusted mobile retail brand, known for quality, transparency,
                  and customer-first approach. We envision a future where everyone can access premium
                  technology without compromise, and where our name is synonymous with reliability.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section> */}

      {/* ─── Values ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Values</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-3">What Drives Us</h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-surface border border-border rounded-2xl p-7 text-center hover:border-primary/30 hover:shadow-xl transition-all h-full"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <span className="text-primary text-2xl">{v.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
                Want to Know More?
              </h2>
              <p className="text-muted mb-8 max-w-xl mx-auto">
                We'd love to hear from you. Reach out to us for any questions or visit our store.
              </p>
              <Link to="/contact">
                <Button size="lg" iconRight={<FiArrowRight />}>
                  Contact Us
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}