import React, { useState } from "react";
import Scanner from "react-webcam-qr-scanner";
import { Link } from "react-router-dom";

import "./Browse.css";

const Browse = () => {
  const [QRCodeValue, setQRCodeValue] = useState("");
  const [QRURL, setQRURL] = useState("");
  const handleDecode = (result) => {
    var final = result.data.substr(result.data.lastIndexOf("/") + 1);
    setQRURL(result.data);
    setQRCodeValue(final);

    console.log(result);
  };

  const handleScannerLoad = (mode) => {
    //console.log(mode);
  };

  return (
    <>
      <div className="scanner">
        <h2>Scan a QR code to browse the menu of the restaurant</h2>
        <Scanner
          className="scann"
          onDecode={handleDecode}
          onScannerLoad={handleScannerLoad}
          constraints={{
            audio: false,
            video: {
              facingMode: "environment",
            },
          }}
        />
        <p>{QRURL}</p>
        {QRURL ? (
          <button>
            <Link to={`/browse/${QRCodeValue}`}>Browse</Link>
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Browse;
