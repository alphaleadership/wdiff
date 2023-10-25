const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

async function generateWaifuImage(inputText) {
  // Lancez le navigateur Puppeteer
  const browser = await puppeteer.launch(
    {
        headless:false
    }
  );

  // Ouvrez une nouvelle page
  const page = await browser.newPage();

  // Naviguez vers le site Hugging Face
  await page.goto('https://huggingface.co/hakurei/waifu-diffusion');

  // Sélectionnez l'élément d'entrée de texte pour saisir le texte
  await page.click('.form-input-alt.min-w-0.flex-1.rounded-r-none');

  // Saisissez le texte d'entrée
  await page.type('.form-input-alt.min-w-0.flex-1.rounded-r-none ', inputText);

  // Appuyez sur le bouton pour exécuter la diffusion
  await page.click('button[type="submit"]');

  // Attendez que le résultat soit généré (ajustez le sélecteur si nécessaire)
  await page.waitForSelector('.max-w-sm');

  // Récupérez l'URL de l'image générée
  const imageUrl = await page.$eval('.max-w-sm', (img) => img.src);

  // Générez un horodatage
  const timestamp = new Date().toISOString().replace(/[-T:]/g, '').split('.')[0];

  // Créez le nom du fichier avec l'horodatage
  const filename = `./result/waifu_image_${timestamp}.png`;

  // Téléchargez l'image avec le nom de fichier généré
  const response = await axios.get(imageUrl, { responseType: 'stream' });
  const writer = fs.createWriteStream(filename);
  response.data.pipe(writer);

  writer.on('finish', () => {
    console.log(`Image sauvegardée avec succès sous le nom : ${filename}`);
  });

  // Fermez le navigateur Puppeteer
  await browser.close();
}

// Utilisez la fonction avec un texte d'entrée
const inputText = '';
for (let index = 0; index < 10; index++) {
  //  const element = array[index];
    generateWaifuImage(inputText);
    
}

