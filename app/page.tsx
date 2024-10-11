"use client";
import Image from "next/image";
import React, { useState, useEffect, Fragment } from "react";
import Product from "./components/product";

function getProductComponents(
  products, demand, batches, createBatch, updateBatch
) {
  if (!products || !demand || !batches) {
    return null;
  }

  const batchesByChemical = {}
  for (const p of products) {
    batchesByChemical[p.id] = [];
  }

  for (const b of batches) {
    batchesByChemical[b.product_id].push(b);
  }

  const statusMap = {
    scheduled: 0,
    'in-progress': 1,
    completed: 2
  }

  const dateToNum = date => new Date(date).getTime();

  const batchCompare = (a,b) => {
    const statusDiff = statusMap[a.status] - statusMap[b.status];
    if (statusDiff == 0){
      switch(a.status) {
        case 'scheduled':
          return dateToNum(a.date_scheduled) - dateToNum(b.date_scheduled);
        case 'in-progress':
          return dateToNum(a.date_in_progress) - dateToNum(b.date_in_progress);
        case 'completed':
          return dateToNum(a.date_completed) - dateToNum(b.date_completed);
      }
    } else {
      return statusDiff;
    }
  }

  for (const k in batchesByChemical) {
    batchesByChemical[k].sort(batchCompare);
  }
  const productComponents = products.map(product => {
    const productDemand = demand.find(d => d.product_id === product.id);
    return <Fragment key={product.id}>
      <Product 
        product={product} 
        demand={productDemand}
        batches={batchesByChemical[product.id]}
        createBatch={createBatch}
        updateBatch={updateBatch}
      />
    </Fragment>
  })
  return productComponents
}

export default function Home() {
  const [products, setProducts] = useState(null);
  const [demand, setDemand] = useState(null);
  const [batches, setBatches] = useState(null);

  const getProducts = async () =>
    fetch("/api/products/list")
      .then(function (response) { return response.json(); })
      .then(function (result) { setProducts(result.products.rows); });

  const getDemand = async () =>
    fetch("/api/demand/list")
      .then(function (response) { return response.json(); })
      .then(function (result) { setDemand(result.demand.rows); });

  const getBatches = async () =>
    fetch("/api/batches/list")
      .then(function (response) { return response.json(); })
      .then(function (result) { setBatches(result.batches.rows); });

  useEffect(() => {
    getProducts();
    getDemand();
    getBatches();
  }, []);

  const createBatch = async (productID, amount) => {
    const requestAmount = amount === "" ? null : parseInt(amount)
    const request = {
      method: "POST",
      body: JSON.stringify({ productID: productID, amount: requestAmount })
    }
    fetch("/api/batches/create", request)
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        setBatches([...batches, result]);
      })
  };

  const resetBatches = async () =>
    fetch("/api/batches/reset")
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        setBatches(result.batches.rows);
      });


  const updateBatch = async (batchID, status) => {
    const request = {
      method: "POST",
      body: JSON.stringify({ batchID: batchID, status: status })
    }
    fetch("/api/batches/update", request)
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        const newBatches = [...batches]
        const i = newBatches.findIndex(b => b.id === result.id)
        newBatches[i] = result;
        setBatches(newBatches);
      })
  };

  const productComponents = getProductComponents(
    products, demand, batches, createBatch, updateBatch
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={resetBatches}
            style={{background: "orange"}}
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            RESET BATCHES
          </button>
        </div>
        <ul style={{ width: 800 }}>
          {productComponents}
        </ul>
      </main>
    </div>
  )
}
