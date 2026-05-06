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
  imgHeight: string;
  imgWidth: string;
}> = {
  gold:    { label: 'Gold',    imgHeight: 'h-20 md:h-24', imgWidth: 'w-48 md:w-60' },
  silver:  { label: 'Silver',  imgHeight: 'h-16 md:h-20', imgWidth: 'w-40 md:w-52' },
  bronze:  { label: 'Bronze',  imgHeight: 'h-12 md:h-16', imgWidth: 'w-32 md:w-44' },
  friends: { label: 'Friends of LAMT', imgHeight: 'h-10 md:h-12', imgWidth: 'w-28 md:w-36' },
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
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {/* Heading */}
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

          {hasAny ? (
            <div className="flex flex-col gap-14">
              {activeTiers.map((tier) => {
                const { label, imgHeight, imgWidth } = TIER_CONFIG[tier];
                const images = sponsorsByTier[tier];
                return (
                  <motion.div key={tier} variants={fadeUp}>
                    <p className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8BB8E8] mb-6">
                      {label}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                      {images.map((src) => (
                        <div
                          key={src}
                          className={`relative ${imgHeight} ${imgWidth} flex items-center justify-center`}
                        >
                          <Image
                            src={src}
                            alt="Sponsor"
                            fill
                            className="object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-200"
                            sizes="(max-width: 768px) 160px, 240px"
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
