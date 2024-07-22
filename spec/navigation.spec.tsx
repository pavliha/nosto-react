import React from "react"
import { NostoCategory, NostoHome, NostoPlacement, NostoProduct, NostoProvider } from "../src"
import RecommendationComponent from "./renderer"
import { Link, BrowserRouter, Route, Routes, useParams } from "react-router-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { WAIT_FOR_TIMEOUT } from "./utils"
import { categoryEvent, frontEvent, productEvent } from "./events"

function HomePage() {
  return <>
    <NostoPlacement id="frontpage-nosto-1" />
    <NostoPlacement id="frontpage-nosto-3" />
    <NostoPlacement id="frontpage-nosto-4" />
    <NostoHome />
    <Link to="/collections/hoodies">Hoodies</Link>
  </>    
}

function CategoryPage() {
  const { category } = useParams()
  return <>
    <NostoPlacement id="categorypage-nosto-1" />
    <NostoPlacement id="categorypage-nosto-2" />
    <NostoCategory category={category!} />
    <Link to="/products/123">Product 123</Link>
    <Link to="/products/234">Product 234</Link>
    <Link to="/">Home</Link>
  </>
}

function ProductPage() {
  const { product } = useParams()
  return <>
    <NostoPlacement id="productpage-nosto-1" />
    <NostoPlacement id="productpage-nosto-2" />
    <NostoPlacement id="productpage-nosto-3" />
    <NostoProduct product={product!} />
    <Link to="/products/234">Product 234</Link>
    <Link to="/collections/hoodies">Hoodies</Link>
    <Link to="/">Home</Link>
  </>
}

function Main() {
  return <NostoProvider
    account="shopify-11368366139"
    recommendationComponent={<RecommendationComponent />}> 
    <BrowserRouter>
      <Routes>
        <Route path="/collections/:category" element={<CategoryPage />} />
        <Route path="/products/:product" element={<ProductPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>    
    </BrowserRouter>
  </NostoProvider>  
}

test("navigation events", async () => {
  render(<Main />)

  await waitFor(() => {
    expect(screen.getAllByTestId("recommendation")).toHaveLength(3)
  }, { timeout: WAIT_FOR_TIMEOUT })

  const requests: unknown[] = []
  window.nostojs(api => api.listen("prerequest", req => requests.push(req)))
  
  // home -> category
  fireEvent.click(screen.getByText("Hoodies"))
  expect(requests).toEqual([ frontEvent(), categoryEvent("hoodies")])
  requests.length = 0

  // category -> product
  fireEvent.click(screen.getByText("Product 123"))
  expect(requests).toEqual([ productEvent("123") ])
  requests.length = 0

  // product -> product
  fireEvent.click(screen.getByText("Product 234"))
  expect(requests).toEqual([ productEvent("234") ])
  requests.length = 0

  // product -> category
  fireEvent.click(screen.getByText("Hoodies"))
  expect(requests).toEqual([ categoryEvent("hoodies") ])
  requests.length = 0

  // category -> home
  fireEvent.click(screen.getByText("Home"))
  expect(requests).toEqual([ frontEvent() ])
  requests.length = 0
})