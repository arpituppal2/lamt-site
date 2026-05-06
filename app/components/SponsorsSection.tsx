'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function SponsorsSection({ images }: { images: string[] }) {
  return (
    <section
      id="sponsors"
      className="py-20 px-6 md:px-16 bg-[#2774AE] dark:bg-black border-t border-white/10 transition-colors"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <h2
              className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Our Sponsors
            </h2>
            <p className="text-[#DAEBFE] text-sm md:text-base max-w-md mx-auto">
              LAMT 2026 is made possible by the generous support of our sponsors.
            </p>
          </motion.div>

          {images.length > 0 ? (
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
            >
              {images.map((src) => (
                <motion.div
                  key={src}
                  variants={fadeUp}
                  className="relative h-16 md:h-20 w-40 md:w-52 flex items-center justify-center"
                >
                  <Image
                    src={src}
                    alt="Sponsor"
                    fill
                    className="object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-200"
                    sizes="(max-width: 768px) 160px, 208px"
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} className="text-center">
              <p className="text-[#8BB8E8] text-sm tracking-wide uppercase">
                Sponsor announcements coming soon.
              </p>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mt-14 text-center">
            <p className="text-[#DAEBFE] text-sm mb-4">Interested in sponsoring LAMT?</p>
            <a href="mailto:team@lamt.net" className="btn-outline">
              CONTACT US
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
