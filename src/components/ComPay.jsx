import React, { useEffect } from "react";

const ComPay = () => {
  useEffect(() => {
    document.title = "Thanh toán thành công";
  }, []);

  return (
    <div className="boPay">
      <div className="pay-infor">
        <div className="pay-content">
          <i className="fa-solid fa-circle-check"></i>
          <div className="pay-success">THANH TOÁN THÀNH CÔNG</div>
        </div>
      </div>
    </div>
  );
};

export default ComPay;
