import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

// 🔥🔥 FILL THIS OUT FIRST! 🔥🔥
// Get your Gemini API key by:
// - Selecting "Add Gemini API" in the "Project IDX" panel in the sidebar
// - Or by visiting https://g.co/ai/idxGetGeminiKey
let API_KEY = 'AIzaSyA7RN301sGwHvz77yQdRV7A5Z6KmRb0_cI';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  try {
    // Load the image as a base64 string
    // let imageUrl = form.elements.namedItem('chosen-image').value;
    // let imageBase64 = await fetch(imageUrl)
    //   .then(r => r.arrayBuffer())
    //   .then(a => Base64.fromByteArray(new Uint8Array(a)));

    // Assemble the prompt by combining the text with the chosen image
    let contents = [
      {
        role: 'user',
        parts: [
          // { inline_data: { mime_type: 'image/jpeg', data: imageBase64, } },
          { text: 'apa 2 kata konyol yang menggambarkan' + promptInput.value + 'jawab langsung dengan 2 kata lucunya tanpa angka dan simbol' }
        ]
      }
    ];

    // Call the multimodal model, and get a stream of results
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // or gemini-1.5-pro
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const result = await model.generateContentStream({ contents });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }

//   let buffer = [];
// let md = new MarkdownIt();
// for await (let response of result.stream) {
//   buffer.push(response.text());
//   let fullResponse = buffer.join(''); 
//   let twoWords = fullResponse.split(' ').slice(0, 2).join(' '); // Extract first two words
//   output.innerHTML = md.render(twoWords); 
// }
// } catch (e) {
//   output.innerHTML += '<hr>' + e;
// }
};

// You can delete this once you've filled out an API key
maybeShowApiKeyBanner(API_KEY);