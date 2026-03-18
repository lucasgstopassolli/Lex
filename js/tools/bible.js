export function fetchAndDisplayVerse() {
    fetch("https://bible-api.com/data/almeida/random/PRO,PSA,ECC")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data || !data.random_verse) {
            console.error("Invalid data structure from Bible API");
            return;
        }
        const { chapter, verse, book, text, book_id } = data.random_verse;
        const verseNumber = `${chapter}:${verse}`;
        const verseContent = text.trim();
        
        const verseContainer = document.querySelector('.verse-container');
        if (verseContainer) {
            verseContainer.dataset.book = book;
            verseContainer.dataset.verse = verseNumber;
            verseContainer.dataset.content = verseContent;
            verseContainer.dataset.bookId = book_id;
            verseContainer.dataset.chapter = chapter;
        }

        const bookVerseEl = document.getElementById('bookVerse');
        const numberVerseEl = document.getElementById('numberVerse');
        const contentVerseEl = document.getElementById('contentVerse');
        const contentToCopyEl = document.getElementById('contentToCopy');
        const bibleChapterURLEl = document.getElementById('bibleChapterURL');

        if (bookVerseEl) {
            bookVerseEl.classList.remove('placeholder-glow');
            bookVerseEl.innerHTML = book;
        }
        if (numberVerseEl) {
            numberVerseEl.classList.remove('placeholder-glow');
            numberVerseEl.innerHTML = verseNumber;
        }
        if (contentVerseEl) {
            contentVerseEl.classList.remove('placeholder-glow');
            contentVerseEl.innerHTML = verseContent;
        }
        if (bibleChapterURLEl) {
            bibleChapterURLEl.textContent = `https://www.bibliaonline.com.br/ara/${book_id}/${chapter}/`;
        }
        if (contentToCopyEl) {
            contentToCopyEl.textContent = `${verseContent} (${book} ${verseNumber})`;
        }
      })
      .catch(error => {
          console.error("Error fetching Bible verse:", error);
          // Optionally update the UI to show an error message
          const contentVerseEl = document.getElementById('contentVerse');
          if(contentVerseEl) {
            contentVerseEl.classList.remove('placeholder-glow');
            contentVerseEl.innerHTML = "Não foi possível carregar o versículo. Tente novamente mais tarde.";
          }
      });
}