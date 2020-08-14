const http = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = require('../starter/modules/replaceTemplate');


const overviewTemplate = fs.readFileSync(
  '../starter/templates/overview.html',
  'utf-8'
);
const productTemplate = fs.readFileSync(
  '../starter/templates/product.html',
  'utf-8'
);
const cardTemplate = fs.readFileSync(
  '../starter/templates/cards.html',
  'utf-8'
);
const data = fs.readFileSync('../starter/dev-data/data.json', 'utf-8');
const dataJson = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardContent = dataJson
      .map((el) => replaceTemplate(cardTemplate, el))
      .join('');
    const overview = overviewTemplate.replace(/{%CARDS%}/g, cardContent);
    res.end(overview);


  } else if (pathname === '/product') {
    const content = replaceTemplate(productTemplate, dataJson[query.id]);
    res.end(content);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.end('Hello brother');
  }
});

server.listen(8000, () => {
  console.log('Server is running');
});

///////////////////////////////////////
////FILES
// const fs = require('fs');

// //blocking code
// const content = fs.readFileSync('../starter/txt/input.txt', 'utf-8');
// const newContent = `What we know about abocato is: ${content} \n Create on ${Date.now()}`;
// fs.writeFileSync('../starter/txt/outputSync.txt', newContent);
// console.log('Archivo escrito');

// fs.readFile('../starter/txt/start.txt', 'utf-8', (err, data1) => {
//   fs.readFile(`../starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     fs.readFile('../starter/txt/append.txt', 'utf-8', (err, data3) => {
//       fs.writeFile(
//         '../starter/txt/finalAsync.txt',
//         `${data2}\n${data3}`,
//         'utf-8',
//         (err) => {
//           console.log('The document has been written');
//         }
//       );
//     });
//   });
// });
