import "../css/_main.css";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "../components/section/section";
import { SectionDivider } from "../components/section/section-divider/section-divider";
import { Grid } from "../components/grid/grid";
import { GridItem } from "../components/grid/grid-item/grid-item";
import { FloatingElements } from "../components/floating-elements/floating-elements";

import * as styles from "./index.module.css";
import { Menu } from "../components/navigation/menu/menu";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.35 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const scrollReveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: "easeOut" },
};

export const Head = () => <title>Baby T</title>;

export default function Home() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  return (
    <div>
      <FloatingElements />

      <Section title="Landing" isNoTitle className={styles.landing}>
        <motion.div
          className={styles.landingText}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={fadeUp}>It's a baby girl!</motion.h1>
          <motion.h2 variants={fadeUp}>October 9, 2026</motion.h2>
        </motion.div>
        <motion.div
          className={styles.landingCta}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
        >
          <a
            href="https://poppylist.com/registry/hopeandcarly"
            target="_blank"
            rel="noreferrer"
          >
            Registry
          </a>
        </motion.div>
      </Section>

      <Section title="Welcome">
        <motion.div {...scrollReveal}>
          <Grid>
            <GridItem>
              <p>We&rsquo;re so grateful you&rsquo;re here.</p>
              <p>
                We&rsquo;re expecting our first baby girl and couldn&rsquo;t be more
                excited to share this news with the people we love most. This
                journey has already been filled with so much joy, and that joy is
                only possible because of the incredible community around us.
              </p>
              <p>
                Thank you for your love, your encouragement, and your support.
                We feel so lucky to be surrounded by you as we step into this
                new chapter.
              </p>
              <em>Love, Hope &amp; Carly</em>
            </GridItem>
            <GridItem>
              {/* Swap this Spotify playlist URL with your baby prep playlist */}
              <iframe
                title="our music playlist"
                allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                frameBorder="0"
                width="100%"
                height="460"
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                src="https://open.spotify.com/embed/playlist/2joaNZkXiDCjn4KC7rYEOg?utm_source=generator&theme=1"
                style={{ borderRadius: 20, background: "transparent" }}
              />
            </GridItem>
          </Grid>
        </motion.div>
      </Section>

      <SectionDivider />

      <Section title="Registry" isAltBG>
        <motion.div {...scrollReveal}>
          <Grid position="center">
            <GridItem>
              <p>
                Your presence and love mean everything to us. If you&rsquo;d like
                to celebrate baby&rsquo;s arrival with a gift, we&rsquo;ve set up
                a registry on Poppylist &mdash; a platform that lets you
                contribute to both physical items and experiences.
              </p>
              <p>
                No gift is ever expected, but if you&rsquo;d like to take a look,
                we&rsquo;d be so touched.
              </p>
              <a
                href="https://poppylist.com/registry/hopeandcarly"
                target="_blank"
                rel="noreferrer"
                className={styles.registryButton}
              >
                View Our Registry
              </a>
            </GridItem>
          </Grid>
        </motion.div>
      </Section>

      <Menu
        open={open}
        setOpen={toggleMenu}
        links={[
          {
            href: "https://poppylist.com/registry/hopeandcarly",
            text: "Registry",
            newTab: true,
          },
          { href: "#welcome", text: "Welcome" },
          { href: "#registry", text: "Registry" },
        ]}
      />
    </div>
  );
}
