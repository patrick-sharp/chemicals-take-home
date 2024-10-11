import React, { useState, useEffect } from "react";
import moment from 'moment';

export default function Batch({ batch, updateBatch }) {

  let dateUpdated;
  let nextStatus;
  let displayStatus;
  let buttonClassName = "border border-transparent hover:bg-[#686868] flex items-center justify-center bg-foreground text-background gap-2";
  let buttonDisabled = false;
  let buttonColor = null;
  switch(batch.status) {
    case 'scheduled':
      dateUpdated = Date(batch.date_scheduled);
      nextStatus = 'in-progress'
      displayStatus = 'Mark in-progress';
      break;
    case 'in-progress':
      dateUpdated = Date(batch.date_in_progress);
      nextStatus = 'completed'
      displayStatus = 'Mark completed';
      break;
    case 'completed':
      dateUpdated = Date(batch.date_completed);
      nextStatus = null;
      displayStatus = 'Completed';
      buttonClassName =  "border border-transparent flex items-center justify-center bg-foreground text-background gap-2";
      buttonDisabled = true;
      buttonColor = "green"
      break;
  }

  const formattedDate = moment().format('MMMM Do YYYY');

  return <div className="flex gap-8 items-center" style={{paddingBottom: 10}}>
    <span style={{width: 40}}>{batch.amount}</span>
    <span style={{width: 100}}>{batch.status}</span>
    <span style={{width: 160}}>{formattedDate}</span>
    <button 
      className={buttonClassName} 
      disabled={buttonDisabled}
      style={{ width: 150, background: buttonColor, padding: 3 }}
      onClick={() => updateBatch(batch.id, nextStatus)}
    >
      {displayStatus}
    </button>
  </div>
}
