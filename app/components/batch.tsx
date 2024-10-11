import React, { useState, useEffect } from "react";
import moment from 'moment';

export default function Batch({ batch, updateBatch }) {

  let dateUpdated;
  let nextStatus;
  switch(batch.status) {
    case 'scheduled':
      dateUpdated = Date(batch.date_scheduled);
      nextStatus = 'in-progress';
      break;
    case 'in-progress':
      dateUpdated = Date(batch.date_in_progress);
      nextStatus = 'completed';
      break;
    case 'completed':
      dateUpdated = Date(batch.date_completed);
      nextStatus = null;
      break;
  }

  const formattedDate = moment().format('MMMM Do YYYY');

  return <div className="flex gap-8">
    <span>{batch.amount}</span>
    <span>{batch.status}</span>
    <span>{formattedDate}</span>
    <button>{nextStatus && "Mark"} {nextStatus || batch.status}</button>
  </div>
}
