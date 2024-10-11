import React, { useState, Fragment } from "react";
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

  let scheduledDemand = 0;
  let inProgressDemand = 0;
  let completedDemand = 0;
  for (const b of batches) {
    switch(b.status) {
      case 'scheduled':
        scheduledDemand += b.amount;
        break;
      case 'in-progress':
        inProgressDemand += b.amount;
        break;
      case 'completed':
        completedDemand += b.amount;
        break;
    }
  }

  const demandWidth = 400

  let productStatus;
  if (demand.amount - completedDemand <= 0) {
    productStatus = <span style={{color: "green"}}>complete</span>
  } else {
    productStatus = <span style={{color: "red"}}>incomplete</span>
  }

  const completedWidth =  Math.min(completedDemand  / demand.amount * demandWidth, demandWidth);
  const inProgressWidth = Math.min(inProgressDemand / demand.amount * demandWidth, demandWidth - completedWidth);
  const scheduledWidth =  Math.min(scheduledDemand  / demand.amount * demandWidth, demandWidth - completedWidth - inProgressWidth);

  return (
    <div className="flex flex-col items-center">
      <span style = {{fontSize: 26}}>
        {product.name} ({productStatus})
      </span>
      <div className="flex flex-col gap-4 items-center" style={{padding: 8, paddingBottom: 30}}>
        <div className="flex gap-4">
          <div style={{}}>
            {scheduledDemand + inProgressDemand + completedDemand} / {demand.amount}
            <span> gallons</span>
          </div>
          <div className="flex justify-items-center" style={{ width: demandWidth, height: 20, border: "1px solid white"}}>
            <div style={{
              background: "green", 
              width: completedWidth
            }}/>
            <div style={{
              background: "#666666", 
              width: inProgressWidth
            }}/>
            <div style={{
              backgroundColor: "#aaaaaa", 
              width: scheduledWidth
            }}/>
          </div>
        </div>
        <div className="flex gap-8">
          <button 
            className="border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            style={{ width: 200 }}
            onClick={() => createBatch(product.id, amount)}
          >
            Schedule batch
          </button>
          <input 
            style={{ color: 'black', width: 200, paddingLeft: 20 }} 
            placeholder="Amount"
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
