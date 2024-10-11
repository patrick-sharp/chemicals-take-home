import React, { useState, useEffect } from "react";
import moment from 'moment';

export default function Batch({ batch, updateBatch }) {

  let dateUpdated;
  let nextStatus;
  let displayStatus;
  let buttonClassName = "border border-transparent hover:bg-[#a0a0a0] flex items-center justify-center bg-foreground text-background gap-2";
  let buttonDisabled = false;
  let buttonColor = null;
  let statusEmoji;
  switch(batch.status) {
    case 'scheduled':
      dateUpdated = batch.date_scheduled;
      nextStatus = 'in-progress'
      displayStatus = 'Mark in-progress';
      statusEmoji = '📆';
      break;
    case 'in-progress':
      dateUpdated = batch.date_in_progress;
      nextStatus = 'completed'
      displayStatus = 'Mark completed';
      statusEmoji = '➡️';
      break;
    case 'completed':
      dateUpdated = batch.date_completed;
      nextStatus = null;
      displayStatus = 'Completed';
      statusEmoji = '✅';
      buttonClassName =  "border border-transparent flex items-center justify-center bg-foreground text-background gap-2";
      buttonDisabled = true;
      buttonColor = "green"
      break;
  }

  const formattedDate = moment(dateUpdated).format('MMMM Do YYYY');

  return <div className="flex gap-8 items-center" style={{paddingBottom: 10}}>
    <span style={{width: 100}}>{batch.amount} gallons</span>
    <span style={{width: 130}}><span style={{paddingRight: 15}}>{statusEmoji}</span>{batch.status}</span>
    <span style={{width: 180}}>{formattedDate}</span>
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
