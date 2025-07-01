fetch("https://bible-api.com/data/almeida/random/PRO,PSA")
  .then(res => res.json())
  .then(data => {
    console.log(data.translation.name)
    console.log(data.random_verse.book);
    console.log(data.random_verse.text)
  })
  .catch(console.error);
