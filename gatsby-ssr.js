import React from "react"

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      key="emoji-favicon"
      rel="icon"
      type="image/svg+xml"
      href="/favicon.svg"
    />,
  ])
}
