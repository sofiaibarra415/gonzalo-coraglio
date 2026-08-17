import { chromium } from 'playwright'

const url = 'http://localhost:5183'
const outDir =
  'C:/Users/sofia/AppData/Local/Temp/claude/c--Users-sofia-Desktop-Facultad-Gonzalo-Coraglio-gonzalo-coraglio/02ed373f-538f-4893-98d8-aa2ff5cae201/scratchpad'

async function run(viewport, label) {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport })
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector('article.project-block', { timeout: 15000 })

  const block = page.locator('article.project-block', { hasText: 'Centro vacunatorio' })
  await block.scrollIntoViewIfNeeded()
  await page.waitForTimeout(6000)

  const heroBtn = block.locator('button.project-hero').first()
  await heroBtn.waitFor({ state: 'visible', timeout: 45000 })
  await heroBtn.click({ timeout: 15000 })

  await block.locator('.project-detail-outer').waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(1200)

  const target = block.locator('.slide-text-inner--beside', { hasText: 'Secuencia constructiva' })

  const swiperEl = block.locator('.project-detail-swiper').first()
  await swiperEl.focus()

  let visible = false
  for (let i = 0; i < 16; i++) {
    if ((await target.count()) > 0 && (await target.isVisible())) {
      const box = await target.boundingBox()
      if (box && box.x >= 0 && box.x < viewport.width) {
        visible = true
        break
      }
    }
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(350)
  }
  console.log(label, 'target visible in view:', visible, 'count:', await target.count())

  await page.waitForTimeout(500)
  await page.screenshot({ path: `${outDir}/secuencia-${label}.png`, fullPage: true })

  console.log(label, 'console errors:', errors)
  await browser.close()
}

try {
  await run({ width: 390, height: 844 }, 'mobile')
} catch (err) {
  console.error('mobile FAILED:', err.message)
}
