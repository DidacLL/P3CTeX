'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {DefaultArtifactClient} = require('@actions/artifact');

async function main() {
  const dir = path.join(process.env.GITHUB_WORKSPACE, '.visual-review');
  const files = fs.readdirSync(dir)
    .filter(name => name.endsWith('.pdf'))
    .map(name => path.join(dir, name));
  if (files.length !== 6) {
    throw new Error('Expected six review PDFs; found ' + files.length);
  }
  const client = new DefaultArtifactClient();
  const result = await client.uploadArtifact(
    'p3ctex-visual-review', files, dir, {retentionDays: 7}
  );
  console.log('Uploaded ' + files.length + ' PDFs. Artifact ID: ' + result.id);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
