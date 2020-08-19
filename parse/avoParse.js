const path = require('path');
const fs = require('fs');

class avoParse {
  constructor() {
    this.paths = {
      sidebar: path.resolve("../website/sidebars.json"),
      versionedSideberDir: path.resolve("../website/versioned_sidebars"),
      versions: path.resolve("../website/versions.json"),
      versionedDocsDir: path.resolve("../website/versioned_docs"),
      outputDir: path.resolve("./output"),
      docsDir: path.resolve("../docs"),
      staticDir: path.resolve(`../website/static`),
      buildDir: path.resolve('../website/build/AvoDocs'),
    }
  
    this.regex = {
      // matches Yaml block with title
      yamlBlockTitle: /^---(?:[\n]|.)*title: *([\w ]*)(?:[\n]|.(?!--))*---/mgi,
  
      // matches all links which are to local .md files
      linksLocalMd: /(?<![\\!])\[([^\]]*)(?<!\\)\]\((?!https?:\/\/)(?!\/\/)(?!#)([a-zA-Z0-9-\.\/]*\.md)([^)]*)\)/mgi,
  
      // matches all images with local sources
      imagesLocal: /!\[([^\]]*)\]\(\/(?!\/)([^\)]*)\)/mg,
  
      // matches all images without a space before
      imagesSpaceBefore: /(?<!\n\n) *!\[[^\]]*\]\([^\)]*\)/gm,
  
      // matches all images without a space after
      imagesSpaceAfter: /!\[[^\]]*\]\([^\)]*\) *(?!\n\n)/gm,
  
      // matches og:url tag
      metaOgUrl: /<meta property="og:url" content="(https?:\/\/.*?)\/.*?"\/>/mi,
  
      // matches og:image tag
      metaOgImage: /<meta property="og:image" content="(https?:\/\/.*?)\/.*?"\/>/mi,
  
      // matches twitter:image tag
      metaTwitterImage: /<meta name="twitter:image" content="(https?:\/\/.*?)\/.*?"\/>/mi,
  
      // matches first image in <article>
      firstHTMLImage: /<article>[\s\S]*?<img.*?src="(\/[^"]*?(?:\.png|\.jpe?g))"[^>]*?>[\s\S]*?<footer/mi,
    }
  }

  
  getVersions() {
    var versionsFile = JSON.parse(fs.readFileSync(this.paths.versions))
  
    let versions = [
      {
        dir: this.paths.docsDir,
        number: 'next',
      }
    ]
  
    versionsFile.forEach((version) => {
      versions.push(
        {
          dir: path.join(this.paths.versionedDocsDir, `version-${version}`),
          number: version
        }
      )
    })

    versions.forEach((version) => {
      version.indexPath = path.join(this.paths.staticDir, `index-${version.number}.json`)
    })
  
    return versions
  }
}

module.exports = new avoParse()