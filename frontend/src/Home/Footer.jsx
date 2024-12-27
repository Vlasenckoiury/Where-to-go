import React from "react";
import "./Footer.css"; 

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>&copy; 2024 Where to go. All rights reserved.</p>
        <p>
          Свяжитесь с нами: <a href="mailto:support@wheretogo.com">support@wheretogo.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
