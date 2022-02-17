import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import plantuml from 'node-plantuml';

/**
 * Converts the plantuml diagrams of this directory to pngs in png/
 * Plantuml docs: https://plantuml.com/sitemap-language-specification
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.readdir(__dirname, (error, files) => {
  if (error) {
    return console.log('Unable to scan directory: ' + error);
  } 
  files.forEach((file) => {
    if (file.match(/.puml/i)) {
      let inPath = 'plantuml/' + file;
      fs.readFile(inPath, 'utf8', (err, data) => {
        if (err) {
          console.log('Unable to read file: ' + err);
        } else {
          let gen = plantuml.generate(data);
          let outPath = 'plantuml/png/' + file.split('.')[0] + '.png'
          gen.out.pipe(fs.createWriteStream(outPath));
        }
      });
    }
  });
});
