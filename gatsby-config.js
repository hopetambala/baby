const site = require("./src/data/site");

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: site.title,
    siteUrl: site.siteUrl,
    description: site.description,
  },
  plugins: [
    /**
     * Generates the sitemap at build time from the pages Gatsby knows about,
     * replacing the hand-written static/sitemap.xml whose lastmod had already
     * gone stale. Reads siteUrl from siteMetadata above.
     *
     * Defaults are what we want here: `output: "/"` writes /sitemap-index.xml
     * plus /sitemap-0.xml, and the 404s are excluded already. Note the plugin
     * emits no `lastmod` — deliberate, since stamping every build with the
     * current date is the same lie the static file told, and Google discounts
     * the signal when it can't be trusted.
     */
    "gatsby-plugin-sitemap",
  ],
};
