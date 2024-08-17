import React from "react";

const Footer = () => {
  return (
    <footer className="px-4 sm:px-6 py-6 mt-10">
      <div className="text-center text-sm text-gray-500">
        <span className="text-gray-900 text-sm mr-2">
          Chas Bank Web
        </span>
      </div>
      <div className="text-center text-xs text-gray-500">
        © {new Date().getFullYear()} All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;