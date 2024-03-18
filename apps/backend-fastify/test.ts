// Setup the handler.
await page.addLocatorHandler(
  page.getByRole("heading", { name: "Hej! You are in control of your cookies." }),
  async () => {
    await page.getByRole("button", { name: "Accept all" }).click()
  },
)
// Write the test as usual.
await page.goto("https://www.ikea.com/")
await page.getByRole("link", { name: "Collection of blue and white" }).click()
await expect(page.getByRole("heading", { name: "Light and easy" })).toBeVisible()
