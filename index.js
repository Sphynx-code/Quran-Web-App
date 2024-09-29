import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static("public"));

// Axios configuration for fetching a random verse
const config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.quran.com/api/v4/verses/random?translations=131',
  headers: {
    'Accept': 'application/json'
  }
};


// Function to sanitize text
function sanitizeText(text) {
  return text
    .replace(/<sup[^>]*>.*?<\/sup>/g, '')      // Remove superscript tags
    .replace(/<footnote[^>]*>.*?<\/footnote>/g, '') // Remove footnotes
    .replace(/<[^>]+>/g, '');                   // Remove any other HTML-like tags
}

// Function to fetch the verse
async function fetchVerse() {
  try {
    const response = await axios(config);
    const verse_Translation = sanitizeText(response.data.verse.translations[0]["text"]); // Sanitize translation
    const verse__key = sanitizeText(response.data.verse.verse_key); // Sanitize verse key
    return { verse_TRANSLATION: verse_Translation, verse_KEY: verse__key }; // Return sanitized values
  } catch (error) {
    console.log(error);
    return { verse_TRANSLATION: "Error fetching verse.", verse_KEY: "" }; // Handle error
  }
}
async function getTasfir(verseKey){
    const config2 = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://api.quran.com/api/v4/tafsirs/169/by_ayah/${verseKey}`,
  headers: {
    'Accept': 'application/json'
  }
}
try{
    const reponse = await axios(config2);
    const tafsir = sanitizeText(reponse.data.tafsir.text);
    return{Tafsir:tafsir}
}
catch(error){
  console.error(error)
  return{Tafsir:"Error fetching tafsir."}
}
}

// Main route to render the EJS template
app.get("/", async (req, res) => {
  const { verse_TRANSLATION, verse_KEY } = await fetchVerse(); // Await the fetchVerse call
  res.render("index.ejs", {
    verse: verse_TRANSLATION,
    verseKey: verse_KEY
  });
});
app.get("/tafsir/:verseKey",async(req,res)=>{
  const verseKey = req.params.verseKey
  const {Tafsir} = await getTasfir(verseKey);
  res.render("tafsir.ejs",{
    tafsir:Tafsir
  })
 
})
app.get("/versesSaver",(req,res)=>{
  res.render("versesSaver.ejs")
})
app.get("/versebykey",(req,res)=>{
  res.render("versebykey.ejs")
})
async function getVerseByKey(versekey){
  let config3 = {
    method: 'get',
  maxBodyLength: Infinity,
    url: `https://api.quran.com/api/v4/verses/by_key/${versekey}?translations=131`,
    headers: { 
      'Accept': 'application/json'
    }
  };
  try{
    const response = await axios(config3);
    const verse_Translation = sanitizeText(response.data.verse.translations[0]["text"]);
    const verse__key = sanitizeText(response.data.verse.verse_key);
    return { verse_TRANSLATION: verse_Translation, verse_KEY: verse__key };
  }
  catch(error){
    console.error(error)
    return { verse_TRANSLATION: "Error fetching verse.", verse_KEY: "" };
  }

}
app.use(bodyParser.urlencoded({ extended: true}));
app.post("/submit",async (req,res)=>{
      const versekey = req.body["chapter"]+":"+req.body["verse"];
      const {verse_TRANSLATION,verse_KEY} = await getVerseByKey(versekey);
      const {Tafsir} = await getTasfir(versekey)
      res.render("submit.ejs",{
        verse: verse_TRANSLATION,
        verseKey: verse_KEY,
        tafsir: Tafsir
      })
      
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
