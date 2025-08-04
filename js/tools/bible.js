// Fetch and update the bible verse
fetch("https://bible-api.com/data/almeida/random/PRO,PSA,ECC")
  .then(res => res.json())
  .then(data => {
    const verseNumber = data.random_verse.chapter + ': ' + data.random_verse.verse;
    const verseBook = data.random_verse.book;
    const verseContent = (data.random_verse.text).trim();

    const bookVerse = document.getElementById('bookVerse');
    const numberVerse = document.getElementById('numberVerse');
    const contentVerse = document.getElementById('contentVerse');

    const contentToCopy = document.getElementById('contentToCopy');
    const bibleChapterURL = document.getElementById('bibleChapterURL');

    bookVerse.classList.remove('placeholder-glow');
    numberVerse.classList.remove('placeholder-glow');
    contentVerse.classList.remove('placeholder-glow');

    bookVerse.innerHTML = verseBook;
    numberVerse.innerHTML = verseNumber;
    contentVerse.innerHTML = verseContent;
    bibleChapterURL.innerHTML = 'https://www.bibliaonline.com.br/ara/' + data.random_verse.book_id + '/' + data.random_verse.chapter + '/';
    contentToCopy.innerHTML = verseContent + ' (' + verseBook + ' ' + verseNumber + ')';
  })
  .catch(console.error);
