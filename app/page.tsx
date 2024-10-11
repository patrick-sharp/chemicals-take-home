"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Product from "./components/product";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [demand, setDemand] = useState([]);
  const [batches, setBatches] = useState([]);

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

  const batchesByChemical = {}
  for (let p of products) {
    batchesByChemical[p.id] = [];
  }

  for (let b of batches) {
    batchesByChemical[b.product_id].push(b);
  }

  const statusMap = {
    scheduled: 0,
    'in-progress': 1,
    completed: 2
  }
  const batchCompare = (a,b) => {
    const statusDiff = statusMap[a.status] - statusMap[b.status];
    if (statusDiff == 0){
      switch(a.status) {
        case 'scheduled':
          return Date(a.date_scheduled) - Date(b.date_scheduled);
        case 'in-progress':
          return Date(a.date_in_progress) - Date(b.date_in_progress);
        case 'completed':
          return Date(a.date_completed) - Date(b.date_completed);
      }
    } else {
      return statusDiff;
    }
  }

  for (let k in batchesByChemical) {
    batchesByChemical[k].sort(batchCompare);
  }

  const productComponents = products.map(product => {
    const productDemand = demand.find(d => d.product_id === product.id);
    return <Product 
      product={product} 
      demand={productDemand}
      batches={batchesByChemical[product.id]}
      createBatch={createBatch}
    />
  })

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={resetBatches}
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
        <ul>
          {productComponents}
        </ul>
      </main>
    </div>
  )
}
