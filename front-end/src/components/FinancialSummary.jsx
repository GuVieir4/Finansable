import React from "react";

function FinancialSummary() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4">
      <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-green-400/30 to-green-600/30 backdrop-blur-md border border-green-400/50 shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 cursor-pointer">
        <p className="text-[#131711] text-base font-medium leading-normal">Saldo Total</p>
        <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">R$ 582,00</p>
      </div>
    </div>
  );
}

export default FinancialSummary;