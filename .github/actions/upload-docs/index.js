// A local JavaScript action receives the GitHub Actions runtime credentials
// that shell steps do not. No artifacts are committed to the Git repository.
const fs = require('node:fs')
const path = require('node:path')

async function main () {
  const root = path.join(process.env.GITHUB_WORKSPACE, 'tex')
  const list = path.join(process.env.GITHUB_WORKSPACE, '.documentation-targets')
  const sources = fs.readFileSync(list, 'utf8').split(/\r?\n/).filter(Boolean)
  if (sources.length === 0) {
    console.log('No affected documentation PDFs to upload')
    return
  }

  const files = sources.map(source => {
    const pdf = path.join(root, path.basename(source, '.tex') + '.pdf')
    if (!fs.existsSync(pdf)) throw new Error('Missing compiled PDF: ' + pdf)
    return pdf
  })

  const clientPath = path.join(process.env.RUNNER_TEMP,
    'pxdoc-artifacts/node_modules/@actions/artifact')
  const { DefaultArtifactClient } = require(clientPath)
  const { id } = await new DefaultArtifactClient().uploadArtifact(
    'documentation-pdfs', files, root, { retentionDays: 14 }
  )
  console.log('Uploaded ' + files.length + ' selected PDF(s) as artifact ' + id)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
