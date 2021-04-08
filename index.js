const core = require('@actions/core');
const glob = require('@actions/glob');
const FastlyPurge = require('fastly-purge');

(async () => {
  try {
    const FASTLY_TOKEN = core.getInput('fastly-token');
    const FASTLY_URL = core.getInput('fastly-url');
    
    const purge = new FastlyPurge(FASTLY_TOKEN);
    const patterns = ['public/**/*.json', 'public/**/*.html'];
    const globber = await glob.create(patterns.join('\n'));
    
    // Wrap purge.url() into a Promise
    const purgeURL = (url) => {
      return new Promise((res, rej) => {
        purge.url(url, (err, result) => {
          if (result) res(result);
          if (err) rej(err);
        });
      });
    };
    
    // Build complete url and purge
    const process = async (filePath = '') => {
      const fastlyURL = `${FASTLY_URL.endsWith('/') ? FASTLY_URL : `${FASTLY_URL}/`}${filePath}`;
      const {origin, pathname} = new URL(fastlyURL);
      console.log(`Purging: ${origin}/‎${pathname.slice(1)}`);
      console.log(await purgeURL(fastlyURL));
    };
    
    // Process base path
    await process();
  
    // Process HTML and JSON file paths
    for await (const file of globber.globGenerator()) {
      await process(file.substr(file.indexOf('/public/') + 8));
    }
  } catch (err) {
    core.setFailed(err);
  }
})();
