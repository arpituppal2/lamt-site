'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Tier } from '../page';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const TIER_CONFIG: Record<Tier, {
  label: string;
  labelSize: string;
  imgW: number;
  imgH: number;
}> = {
  gold:    { label: 'Gold',            labelSize: 'text-xl md:text-2xl',  imgW: 480, imgH: 240 },
  silver:  { label: 'Silver',          labelSize: 'text-lg md:text-xl',   imgW: 360, imgH: 180 },
  bronze:  { label: 'Bronze',          labelSize: 'text-base md:text-lg', imgW: 280, imgH: 140 },
  friends: { label: 'Friends of LAMT', labelSize: 'text-sm md:text-base', imgW: 200, imgH: 100 },
};

const TIER_ORDER: Tier[] = ['gold', 'silver', 'bronze', 'friends'];

export default function SponsorsSection({
  sponsorsByTier,
}: {
  sponsorsByTier: Record<Tier, string[]>;
}) {
  const activeTiers = TIER_ORDER.filter(t => sponsorsByTier[t].length > 0);
  const hasAny = activeTiers.length > 0;

  return (
    <section
      id="sponsors"
      className="py-20 px-6 md:px-16 bg-[#2774AE] dark:bg-black border-t border-white/10 transition-colors"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {/* Heading */}
          <motion.div variants={fadeUp} className="mb-14 text-center">
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

          {hasAny ? (
            <div className="flex flex-col gap-16">
              {activeTiers.map((tier) => {
                const { label, labelSize, imgW, imgH } = TIER_CONFIG[tier];
                const images = sponsorsByTier[tier];
                return (
                  <motion.div key={tier} variants={fadeUp}>
                    <p className={`text-center font-bold uppercase tracking-[0.2em] text-white mb-8 ${labelSize}`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {label}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
                      {images.map((src) => (
                        <div key={src} className="flex items-center justify-center">
                          <Image
                            src={src}
                            alt="Sponsor"
                            width={imgW}
                            height={imgH}
                            className="object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div variants={fadeUp} className="text-center">
              <p className="text-[#8BB8E8] text-sm tracking-wide uppercase">
                Sponsor announcements coming soon.
              </p>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-16 text-center">
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
