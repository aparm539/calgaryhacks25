import React from "react";
import VideoControl from "../../features/replaying/components/video-control";

export default function layout({ children }) {
  return (
    <>
      <main> {children}</main>
    </>
  );
}
