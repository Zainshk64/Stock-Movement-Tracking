import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight, FiShield, FiTruck, FiHeadphones,
  FiAward, FiSmartphone, FiStar,
} from 'react-icons/fi'
import Button from '../components/Button'
import ProductCard from '../components/ProductCard'
import ScrollReveal from '../components/ScrollReveal'
import { products } from '../data'

const features = [
  { icon: <FiShield />, title: 'Genuine Products', desc: '100% authentic devices sourced from authorized distributors with full warranty.' },
  { icon: <FiTruck />, title: 'Fast Delivery', desc: 'Same-day delivery across the city. Quick and safe packaging guaranteed.' },
  { icon: <FiHeadphones />, title: 'Expert Support', desc: 'Our tech experts are available to help you choose the perfect device.' },
  { icon: <FiAward />, title: 'Best Prices', desc: 'Competitive pricing with exciting offers and easy EMI options.' },
]

const stats = [
  { value: '500+', label: 'Products' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '8+', label: 'Years Experience' },
  { value: '15+', label: 'Cities Served' },
]

export default function Home() {
  const featured = products.filter((p) => p.featured)

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-surface">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-80 h-80 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                <FiSmartphone className="text-base" />
                Welcome to Mothsin Mobiles
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                Your Trusted
                <span className="text-primary block">Mobile Partner</span>
              </h1>
              <p className="text-lg text-muted leading-relaxed mb-8 max-w-lg">
                Discover the latest smartphones, tablets, and accessories at unbeatable prices.
                Premium quality with genuine warranty — all under one roof.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" iconRight={<FiArrowRight />}>
                    Browse Products
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* <div className="w-80 h-80 bg-gradient-to-br from-primary to-primary-dark rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3">
                  <FiSmartphone className="text-white/30 text-[120px]" />
                </div> */}
                <img src="https://hips.hearstapps.com/hmg-prod/images/apple-iphone-17-group-001-68cacd4eb0920.jpg?crop=1xw:0.7499528420523138xh;center,top&resize=1200:*" alt="" className='rounded-3xl' />
                <div className="absolute -top-6 -right-6 w-40 rounded-xl bg-gradint-to-br from-accent to-accent-light rounded-2xl flex items-center justify-center shadow-xl shadow-accent/30 -rotate-6">
                  {/* <FiStar className="text-white/40 text-6xl" /> */}
                  <img className='rounded-xl' src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDw8PEBAQDw8ODw8ODg8NEA8NDg0NFREWFhURFRUYHSggGBolHRUVLT0hJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAPFysfICEtLS0wLS0tKzAtLS0tLS0rLS01LS0tNystLS0tLS01LSstLS0tLS0tLTUrKy0tKy0rLf/AABEIAMIBAwMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xAA/EAACAgEBBQYEAgcHBAMAAAABAgADEQQFEiExQQYTUWFxkSIyQlIUgQcWI6Gx4fAVM3KCwcLRJGKy8UNTkv/EABgBAQADAQAAAAAAAAAAAAAAAAACAwQB/8QAHhEBAQEBAAMAAwEAAAAAAAAAAAECEQMhMRJBUTL/2gAMAwEAAhEDEQA/ALzYW11sXubcEEYGZnu1GwjQxdBmpjnh9B/4lfRcUOZtdhXHWVmplyMY3j18oHN2qiBWRNH2g2M2kswfkb5T4eUqmUQBoNW1bBgcFTkTp+ydeusoH3gYPrOUlQJb9n9rHT2A5+E8GH+sDe05QkGNa2nqIdmrVwHHWLGtR13ccYEGp8GXWz7pQar4TJGg1mMQNPvRdbSJVaGGY4j8YFlUYjbemFumtrPHeRh+6FS0mc1I8RA8xW07jMp5qxU+oOI5WJa9rNH3Ou1CY4Fyw9DxkGlYCq5f7At3bE9RKdVkvRWbjA+EDVaxt/U58gJuNgV/CJgdmNvvvek6Dsp91AT4QL9D0HOU3a+806O588kb3kzZN3eMzdOUzv6U9VjTLUOdtij/ACjif4QOV6Cgk+s1ezaMYlZs3TgYzL7T4gafYNIY+nEyj7c6hrbl04PwrhnA8ekVou0SadmQ8SeWJXLabbXtbm7Z9B0ECXsnQhQOE0WmrldoaycYB/IS70ulc9D+cCRpayTwk00Yj2lo3R59ZE2zrRUmBxY8FHiYGa7QXPbYKKycH5yOiyz2Psta1AAiNlaA5LHizHLN5zQ11bogQjpzBJ2IIHEU2dkgTZbE3aEVV59ZQp8Gc8G5YltsihnYE8oE3tLsVtdVhTgjiDz4zlm1NmXaWw12dOR44YTu2lwoAEhbY2HRqeNig+vSBwreMUrGdbPYnRH6R+TGJPYLR9AR6MYGC2HtOzeFZ4g8ptdNsm98Mq8D54hN2LpqYPWzAjzzNZs/VBECnGQMQMrtnZdtde+VyAOOOOBMr+NKmdX1dwtRlxzBE5VtzZrVWkYOCfh8/KBdbG2sW+GaCm2UHZns7Y2LHyo6DqfWXV1PdtjOQIFvp7ZYVWCUdFvICW2nTAyYHJv0mab/AKwOB86YPqD/ADmapqnTO1+yxe4Y/TKjR7ErzxgZSugnkCfyk6jYt9ny1t7YnRNm7KpXHwj2mj0lCKOCjlA5rsfStWd1xhhzmi1Gu3QEB5wtpVf9Q5AwMCUrsWt9DA6D2Z/uyT1MxH6RtaLNTXWDkVqSfJif5TTaPXCqg8cHB95jtNsC3U2tY2QrNks3zGBW6TJwAM+Qmq2VsKyzG/8AAD7y42bsanTgcAT4niZJu1278vCBV1diKRYXZnbPQnAlxp9jaerkq8PHjIJ2gx6wxqCesC5V615Y/IR+m8HkJT0ZMTtfbNejr3nOP4k+AgX9+pCKWJxgTN1sdRYbD8o4ID4eMgaPXW634mBSrmFPNvWXlACjAgWmkAUASVwlfU+Bkyu123lB7uv4n8unrAu2vUHGYczPdu3EvxPEwQM9bshzazN8pORLfRjc4DpLWxQZGtpAEB0ajEgbS15C4EbsfHWRbhvdYFY2ttzwJkijWXHqY9Xplz0kympB4QG6jY3MmT6Kj1jlKr4iSkKjqICqsLxMrNoLXY4JAO6ciTNRqF8RKyy5PGA7qNpbi4XhK9dSbT5xw1K55yx0ehrTjkQHdm6fAyectGPCM1uniIdmoUDmIFHtuUlLYMuNq6hD1EqUsrzzEC50NvKXdFvD8pm9PqKxj4hLejVV4+YQIuvqJZiBkmV+j2FYzbx4TQi6rnkRS7UqHDeECImzwvz8ceMW+rC8EEZ1m06z9Q95XttKrPzD3gT+9J5xi9pEfa9Q+oe8jttqrPzCBNVeMlUqTKn+2qfuElUbeoH1CBeKd0ZlLtWtNSRvjIU5GfGDW9oqQvzD3lKe0FOeYgabTEKAq8AJYUzK6TtDT9wltTt6j7x7wLPX2/AVzjIlDp9ynOOLHiSeeZF2x2kpHJh7yht7RVnqPeBqzr4JmE2/TgcRBAL9YtU3JDFDa2sb6DNpTstPtElrs5R9Igc9a7Vn6TDDav7Z0X8Ig+kQfh08BA52BrPCLFesPT+M3/cp4CGorHhAw1dOu/rMcNGv8f4zciyseEJr6/KBz+3Sa48z/GR/wGr8f4zoL31+UQtlflAxFWg1fiZLTRa37ptKrK/KPrYnlAw/4LWj6pHu0etP1ToeVPhGbahjpA5ZrNm6vqxkE7O1I+ozpmoqVuXHzHL35RpNInMgGBzuvZur6Fz6ZlppdhbRYfPXX5WWEE+mAZtM44KMefWK5QMh/Yeuwc2EHy4j3kI9n9Zn+8adF2fbklT15ev/AK/hJL1jwgcwfs5qetjRA7L3n62nSblEZOIHOn7LXfe3vG/1UtP1t7zodnGKpqgYCvsZafrb3jj9i7APnb3nSa0AEj6qyByzVdlbR9be8aTsjYfqb3nQrBvGS9NQPCBzuvsXcfrb3iL+yeoXk7e86ylYAkTVKDA45d2duzxZjEr2YtPUzo+pqGY/pdMPCBzI9mLvuMKdOepcnhDgWGh2oSolgmvzMhoLsAS2pvgXn4rMI2ZlelseWyA6xzGmSLDQmMBhkjTiSGMj2GBEtEbBMdsMbEB+pjJlVhkJDH6zAlXavu0ZzyUEzLdrO2a6Duw1baiywtw3wiqF3cnkcfMMDHjxmh1mnF1NtRO6LK3Te+3IxvflMdtjY9epoW/VAIalZ7e8317plXFjAqQcEKD1BGDjlA02ytsLqqadRUuUtzvb5CtUBvBs+JDLjh45lg4z+cw/YjtLotSPwWn72pql361tRVWxFbJK4YnrnBOeuSczb14VQPADHSAeMREXz5xJMAVvusD4GWrtkZ8eMqDK/tF2jbRJUdwMthZd5s8GAzj8xn2nLeTqWc3V5F5cZGJkXYm2k1tRsQYKndcdAcZ4SaFiXs65qWXlJRZKrXEKtItjidcJtsxK7UWEyTa0isMwG6V4yxoWR6kk1BgQFO2BIOoeP2NIlxgVd3FpNp4CMFOMkNwEBhm4wRpjxggVGlfgJZUWykofgJOqsgXVdskJZKmu2SEugWgtg7yQVuixbAkM8YseIa2MvZADtEho0WhqYElDJFZkRGlT2i7SLo9ysDNtqsy55Io4bxHX+U5bx2Tt5DvaLa2LF06PggB7N3mOoHtx/MSJRrDq2fSWYzZSXr3wSjhfhetvEFWHDwzMouo7ywPvAs5LsWOGY548ZfppO60ia6vea3T3/iTnm2nQtXbWMdNwufXEql7rrTrMz4+HeyfYZNDqGvVW3t0ou/aLQinnu4Rcfnnh+c2wHjFVWBlVlOVYBlI5FSMgwzLmUgxJiiIWIBASDt7Yy67Tvp2YpvFWSwDeNbg/MB14ZlgBDL44+EEvEHsxptHRQtGkffVfiZmz3tjci7ZA/hgcpbqk5/V2rGn1NtdihgtrlCeBVSSeH5GdB01q2Ili8VsVXX/CRkSGNd9LfJiz3/S+UasaLcyO5k1Rt4kLF4ilWAupY6xhLEOYDdjSNaY85kZzxgJVYdx4RYEYvaBEY8YI2x4wQM1Tbykyq6U6WSQlsC6S6PpdKZLpIW+BbLdFi+VS3xwXQJraiJW6Q2shB4E/fhiyQhbD7yBPFsxn6RaCz6S4dO9qbxOd1l/g80wslP2uTf0wP/121v75X/dI6+JYvNRS7O2bkB8Cyt+NlTgMu8PrAPI/zm/2WVGnrrAG4qd2VHEYHAjj/XGZrYO7uhTw5EeRl3b3laE1pv5OVGQADjjn/iVYvK0+XP5ZnE/slYBXbpN7J0VhpXjk9wRvVZ9FO76oZeETnHZfVWabaQW0EJq1Kb2AFNmd4dTxyeviZ03dlub2M+83N9o5E5b2k/SAy6gtpUbeo76j9uSaHBdd5+7Uglv2eASeAJ4ceHVmWYLbH6N1u1TXV291Vcxe5Cm8yueLGs8uJ6Hlk8xwkkGy0OqrurWyt1sRhlXQgq39eEdsWQ9gbGr0WnTT1lmVCx3nxvMzMWJOOHWT3EDnna/s2LNRp7Fs3GZyti8Pjr5/uP8A5GdA2SzipVcDgo3CvIqOGPIjh7iYD9IL2byMmcpnGJYfo1v1Li19Q2F3VWpGsVmJPEtu5yvDHPxlXza/1fH9+Nu5jUWxhYlqgQEWqwARYgBoy5i3MYcwEOY1FOYSwDJ4SFqGky08JW3mAwTCiCYcDGK8dV5DDxYsgTltjguleLI4LIFgl0dW6VosjgsgWIug76QRZDNkCeLoYtkAWRQsgWC2SFt8F9LcBzC74xz+Ahv9sAsiu9gjN7F2rndGT+U3mztUxUDPE8MkZGPOcq1tJ0mrcKMVse8rHQK3NR6HP7ptezu184BHPzxM9nK2Z12Ndr9n131bmN11O/VZ9Vdg+Vgf64cJf7L1BuprsYbr43bV+21eDD3B/LEzqWhgMEgjrLbYms+I1tw3uIPQsB/wP3TuLyuebPc9/i0YREdYRBEvZCTGrY6Y20Ck2lsxbeYyJgu0Ju0eq/Y1ue+3e7WpWcl1AGAB15fvnU3WMpSAwfHxLk58sYI9pHWfyieN3F7DewFvGmq/EDFxUl1JDFckkKSOoGJZAQQxJScRt7egBDJgMQxhwhzGWMWxjTGA20UsTFiA1eZW3mT7mlbcYDBMESTBAwQeKDSIHjgaBJVo4GkUGLDQJIeLDyMGi8wJIshiyRd6LDQJIeLDSMGit+BJDwb8jh4e/Aq+1VO9Wlg51tjP/a38wIxsWwjHEHw6SR2hfOnfrgoeH+ITMaXWGtvLnzwJXue1vjrqmh1LboB/LGZbaXVEFehBBU+Y5TnOh29ugDPpyM0mytpd5zON7r4eEqrVmupVWb6q45MAfTyhyp7LaovQVb5qnKn0PEEeXOWxM0S9jFqcvCSIhxFxLzqJhokcItoxqdSlY3nZVGcZYgZJ5AeJ8oEqk8Mfbw/LpHBIug3iC7ArvkbqsCrBAOG8DyJ48PTPGSiYCXMaYw3aNkwCYxpjFMY2TAMQ2MIRNhgR7zK+4yZcZAuMBgmHGyYIHM7dPepxukxOL/tM6+2wUJ+UQx2fr+0QOQb1/wBpg3tR9hnXz2er+0e0L9Xq/tEDkW/qPsMPvNR9pnXP1er+0Rf6vV/aPaByDf1H2mDvNT9hnX/1fr+0e0L+wK/tEDkPe6n7TAbdT9pnXDsCv7RG22Cn2iByXvdV9piWu1PgZ1hthJ4CQNpbMqqrZ2Awo9z0A8zA5qptdTvnHHgPTqYxbs8MOoPlj93THr7zR/g88TjjxOOkgaoDOBy8QcH3lF12tOcciiGgdT8Lr6MChPuMH3lzsuy5CA6sPA5XBj1Gkcg/GQo55VSv+ZTwMQoIbczuk8tz5D6A5CnynOpz06D2P2kyW1hjhLf2J4/WRlD7qR/nE3mZx7T1u2ncLZ+0wGrYc1tQhlPuBNn2R7TarWUtvaT9pURW9gtVKXsxnqMjpnAPMSzx39KvNjl61paQtTtBFbc4vZz7qoGyzB5EgfKPM4HnEDRW2f39uFP/AMWmLVr+dvzt6jc9JL02nSpdytFRck4QBQWPMnHM+csUIQq1FvMrpk8F3bbz/sQ//uSNLs6qpt8KWsPA22MbLceAZuQ8hgeUkwQDiHMMmNO0BLGNkwyYgmAljEQMYQgLEatMcke0wI9xkG4yXcZCugRyYIgwQNwFiwkTFiAYWGEECmKzAIViHuQwYC0BJSJKRRMLegNskZZI8zRpmgMusxHafaHe3LQpBRMO2OrY4f16TS9odqjT1MfqYEKPPxmC0alnLtxZiWJ8SZXu8nFnjz29GyZGJCfQg5yP/culrESUGSTyT4vLhKWpUa4CpVqX5mGX/wC1ZntbrSuakBPLivJCJZ669rWLcjYeHknSS9k7EN7pp6/hL5ay0AHuqx8zeZ5D1Ikohap+zbam+5aKPjsc8V6Vr1dj0UeP+vCd12Ns5dLQlK8d0ZZuRssPFnPqf9BIWwtj6fQ1d1QgXPF3ODba33O3U/uHQCWgsl2c8Ub8l0ehxsPFBpJWVBCzCZoCWMbYw2aNM0AmjZMMmNs0AGGInMPegG0i2x53ka1oDFkjWCPu0ZYwIxWCOmCBrAY4DGcxQMB0NFZjWYA0B3MBaNFoktAdLRJaNFoktAWzSLqtQEUsxwBFXWgAknAHjMJ2o2x3j92p4Dmeijw9Zy3jsnag7U2h+KvPH4EY7vmfGSaqwolXoahn05YlzWOA9Jn1eteJycEVzK/bF5RNwc7P3DrLVfPlM7rrTZYx6Z3V8lHOcjtQjxI6dfQDlOjdk9n9xTvsMW3YZvEJ9C+xz6mY/s7ou/vAI+AfG/gVB4L+Zx++dCDS7E/bP5NfpLDxSvIqtHlaWKkgNFh4ypigYD29Es8bLRBeAp2jbPEu0aLwFs8QXiC0TvQHN6GDGwYZaAGMYcw2eMu0BDxljFsY0xgFmCIggayKWCCAqAwoIAhGCCAgwjBBAq9tH4PecxsPx2f4z/GCCV+T4s8X1a6Lkvp/rLEchBBKa0ZFef2b/wCGZtuQ/wAJggiO6aPsSOFx8qx+XxTVCCCaM/GTf+i1jywoJJE+sUsEEAPGGgggJMbMEEBBiYIICoTQQQGGjbQQQGzGjBBAQYIIIH//2Q==" alt="" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 bg-gradien-to-br from-success to-emerald-400 rounded-2xl flex items-center justify-center shadow-xl shadow-success/30 rotate-6">
                  <img className='rounded-xl' src="data:image/jpeg;base64,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" alt="" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-3">
                The Mothsin Mobiles Advantage
              </h2>
              <p className="text-muted mt-4 max-w-2xl mx-auto">
                We go above and beyond to bring you the best mobile experience
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-surface border border-border rounded-2xl p-7 text-center hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <span className="text-primary text-2xl">{f.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Featured</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-3">
                  Popular Products
                </h2>
              </div>
              <Link
                to="/products"
                className="text-primary font-semibold text-sm flex items-center gap-1.5 hover:gap-3 transition-all"
              >
                View All Products <FiArrowRight />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-primary-dark to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-4xl sm:text-5xl font-extrabold text-white mb-2">{stat.value}</p>
                  <p className="text-sm font-medium text-white/70">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-secondary rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 relative">
                Ready to Get Your Dream Device?
              </h2>
              <p className="text-white/60 mb-8 max-w-xl mx-auto relative">
                Visit our store or browse online. Get the best deals on the latest mobiles, tablets, and accessories.
              </p>
              <div className="flex flex-wrap justify-center gap-4 relative">
                <Link to="/products">
                  <Button variant="accent" size="lg" iconRight={<FiArrowRight />}>
                    Shop Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}