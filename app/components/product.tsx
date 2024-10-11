import React, { useState, useEffect, Fragment } from "react";
import Batch from "./batch";

export default function Product({ product, batches, demand, createBatch, updateBatch }) {
  const [amount, setAmount] = useState("");

  const onAmountChange = (e) => {
    const re = /^([1-9][0-9\b]*)?$/;
      if (e.target.value === '' || re.test(e.target.value)) {
         setAmount(e.target.value)
      }
  }

  const batchComponents = batches.map(b => {
    return <Fragment key={b.id}>
      <Batch batch={b} updateBatch={updateBatch}/>
    </Fragment>
  });

  return (
    <div className="flex flex-col items-center">
      {product.name}
      <div className="flex flex-col gap-8" style={{padding: 8, paddingBottom: 30}}>
        <div className="flex gap-8" style={{padding: 8}}>
          <button 
            className=" border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={() => createBatch(product.id, amount)}
          >
            Schedule batch
          </button>
          <input 
            style={{ color: 'black' }} 
            value={amount} 
            onChange={onAmountChange}/>
        </div>
        <ul>
          {batchComponents}
        </ul>
      </div>
    </div>
  );
}
