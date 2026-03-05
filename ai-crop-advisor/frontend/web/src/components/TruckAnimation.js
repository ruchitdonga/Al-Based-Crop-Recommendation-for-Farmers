import React from "react";

function TruckAnimation() {
  return (
    <div
      className="truckAnim"
      aria-hidden="true"
      role="presentation"
    >
      <div className="truckAnim__track">
        <div className="truckAnim__truck">
          <span className="truckAnim__truckBody">🚜</span>
          <span className="truckAnim__cargo">🌾</span>
        </div>
      </div>
    </div>
  );
}

export default TruckAnimation;
