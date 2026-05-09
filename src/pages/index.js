import "../css/_main.css";
import React, { useState } from "react";
import { Section } from "../components/section/section";
import { SectionDivider } from "../components/section/section-divider/section-divider";
import { Grid } from "../components/grid/grid";
import { GridItem } from "../components/grid/grid-item/grid-item";
import { FloatingElements } from "../components/floating-elements/floating-elements";

import * as styles from "./index.module.css";
import { Menu } from "../components/navigation/menu/menu";

export default function Home() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  return (
    <div>
      <FloatingElements />

      <Section title="Landing" isNoTitle className={styles.landing}>
        <div className={styles.landingText}>
          <h1>It's a baby girl!</h1>
          <h2>October 9, 2026</h2>
        </div>
        <div className={styles.landingCta}>
          <a
            href="https://poppylist.com/registry/41126"
            target="_blank"
            rel="noreferrer"
          >
            Registry
          </a>
        </div>
      </Section>

      <Section title="Welcome">
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
      </Section>

      <SectionDivider />

      <Section title="Registry" isAltBG>
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
              href="https://poppylist.com/registry/41126"
              target="_blank"
              rel="noreferrer"
              className={styles.registryButton}
            >
              View Our Registry
            </a>
          </GridItem>
        </Grid>
      </Section>

      <Menu
        open={open}
        setOpen={toggleMenu}
        links={[
          {
            href: "https://poppylist.com/registry/41126",
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
