import React from "react";

function FinancialSummary() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4">
      <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-[#4CAF50]">
        <p className="text-[#131711] text-base font-medium leading-normal">Saldo Total</p>
        <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">R$ 582,00</p>
      </div>
    </div>
  );
}

export default FinancialSummary;