import React, { useState } from "react";

export const Preloader = ({ isLoading }) => {
  const [showPreloaderMount, setShowPreloaderMount] = useState(isLoading);
  const preloaderHTML = (
    <div
      className={
        showPreloaderMount && showPreloaderMount
          ? "preloader-outer active"
          : "preloader-outer"
      }
    >
      <div className="preloader-wrap">
        <div className="preloader-inner">
          <div className="box1"></div>
          <div className="box2"></div>
          <div className="box3"></div>
        </div>
      </div>
    </div>
  );
  return preloaderHTML;
};
