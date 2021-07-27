import React from "react";
import "./Modal.css";

export const Modal = ({ children }) => {
  return (
    <div className="modal">
      <div className="modal-container-styles">{children}</div>
    </div>
  );
};
