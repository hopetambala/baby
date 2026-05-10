import "../css/_main.css";
import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section } from "../components/section/section";
import { SectionDivider } from "../components/section/section-divider/section-divider";
import { Grid } from "../components/grid/grid";
import { GridItem } from "../components/grid/grid-item/grid-item";
import { FloatingElements } from "../components/floating-elements/floating-elements";
import { Countdown } from "../components/countdown/countdown";
import { Card } from "../components/card/card";
import { Guestbook } from "../components/guestbook/guestbook";

import * as styles from "./index.module.css";
import { Menu } from "../components/navigation/menu/menu";
import romeoPhoto from "../assets/photos/romeo.jpg";

const TypewriterHeading = ({ text, startDelay = 0 }) => {
  const words = text.split(" ");
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15, delayChildren: startDelay } },
      }}
    >
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </motion.h1>
  );
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 1.1 } },
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

  const { scrollYProgress } = useScroll();
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    ["#fdf8f0", "#f5ddd9", "#f7eecc"]
  );

  return (
    <motion.div style={{ backgroundColor: bgColor }}>
      <FloatingElements />

      <Section title="Landing" isNoTitle className={styles.landing}>
        <motion.div
          className={styles.landingText}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TypewriterHeading text="It's a baby girl!" startDelay={0.35} />
          <motion.h2 variants={fadeUp}>October 9, 2026</motion.h2>
          <motion.div variants={fadeUp}>
            <Countdown />
          </motion.div>
        </motion.div>
        <motion.div
          className={styles.landingCta}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
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
              <img
                src={romeoPhoto}
                alt="Hope, Carly, and Romeo at the gender reveal"
                style={{ width: "auto", maxWidth: "100%", maxHeight: 400, borderRadius: 20, display: "block", margin: "0 auto" }}
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

      <SectionDivider isTop />

      <Section title="How to Help">
        <motion.div {...scrollReveal}>
          <Grid>
            <Card className={styles.helpCard}>
              <h3>Meal Train</h3>
              <p>
                One of the best gifts you can give is a home-cooked meal. Sign
                up to bring us dinner after she arrives.
              </p>
              <a
                href="https://mealtrain.com/0r3nw4"
                target="_blank"
                rel="noreferrer"
              >
                Sign Up
              </a>
            </Card>
            <Card className={styles.helpCard}>
              <h3>Other Ways to Help</h3>
              <p>
                Grocery delivery gift cards (Instacart or Whole Foods), a
                professional house cleaning session, or contributing toward
                postpartum support all go a long way.
              </p>
            </Card>
          </Grid>
        </motion.div>
      </Section>

      <SectionDivider />

      <Section title="Leave a Note" isAltBG>
        <motion.div {...scrollReveal}>
          <Grid position="center">
            <GridItem>
<p>Your words mean the world to us!</p>
<p>
  Whether you&rsquo;ve known us for years or are just hearing the news,
  we&rsquo;d love a note from you. Advice, encouragement, or just a good
  old-fashioned pep talk as we step into this new chapter!
</p>
              <Guestbook />
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
          { href: "#howtohelp", text: "How to Help" },
          { href: "#leaveanote", text: "Leave a Note" },
        ]}
      />
    </motion.div>
  );
}
