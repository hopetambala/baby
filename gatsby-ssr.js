import React from "react"

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  setHtmlAttributes({ lang: "en" })
  setHeadComponents([
    <link
      key="emoji-favicon"
      rel="icon"
      type="image/svg+xml"
      href="/favicon.svg"
    />,
  ])
}
