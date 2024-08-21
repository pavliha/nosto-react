import { JSDOM } from "jsdom"
import { afterEach } from "vitest"

const { window } = new JSDOM("<html></html>", { 
    url: "http://localhost", 
    resources: "usable", 
    runScripts: "dangerously" })
global.window = window    
global.location = window.location
global.document = window.document
global.localStorage = window.localStorage
global.navigator = window.navigator

// test mode flag
global.window.nostoReactTest = true

afterEach(() => {
    // clearing Nosto iframe window handle
    window.nosto = undefined
    // clearing nostojs stub
    window.nostojs = undefined
    // clearing Shopify specific Nosto namespace
    window.Nosto = undefined
    document.head.innerHTML = ""
    document.body.innerHTML = ""
})