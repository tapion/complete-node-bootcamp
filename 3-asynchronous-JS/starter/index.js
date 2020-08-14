const fs = require('fs');
const superagent = require('superagent');

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) reject(`Can't read the file ${file}`);
      resolve(data);
    });
  });
};

const writeFile = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err1) => {
      if (err1) reject(`Can't write the file ${file} whith the value: ${data}`);
      resolve('The image was saved');
    });
  });
};

const getDogImage = async (file) => {
  try {
    const data = await readFile(file);
    console.log(data);
    const res1 =  superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2 =  superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3 =  superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const allPromes = await Promise.all([res1,res2,res3]);
    const images = allPromes.map(el => el.body.message);
    console.log(images.join('\n'));
    await writeFile('dog-image.txt', images.join('\n'));
    console.log('Url image saved');
  } catch (err) {
    console.log(err);
    throw err;
  }
  console.log('2: En el proceso');
  return '2: En el proceso';
};

// (async () => {
//   try {
//     console.log('1: Inicia');
//     const value = await getDogImage('dog.txt');
//     console.log(value);
//     console.log('3: Termino!!!!');
//   } catch (error) {
//     console.log('Error!!!!');
//   }
// })();


    console.log('1: Inicia');
    getDogImage('dog.txt');
// console.log(value);
    console.log('3: Termino!!!!');

/////////////////////////////
// readFile('dog.txt')
//   .then((data) => {
//     console.log(data);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body);
//     return writeFile('dog-image.txt', res.body.message);
//   })
//   .then(() => console.log('Url image saved'))
//   .catch((err) => console.log(err.message));
