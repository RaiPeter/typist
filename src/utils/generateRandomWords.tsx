export const generateRandomWords = (count: number, includeNumber: boolean, includePunctuation: boolean) => {
const wordsList = ["the", "quick", "brown", "fox", "jump", "over", "lazy", "dog", "happy", "sun", "moon", "star","have", "with", "this", "from", "they", "will", "would", "there", "their", "what", "about", "which"];
const punctuationList = [",",".",'!','@','#','$','?',':',';','&','*'];

let generatedWords: string[] = [];

for (let i = 0; i < count; i++) {
    let word = wordsList[Math.floor(Math.random() * wordsList.length)];

    // if numbers is added
    if(includeNumber && Math.random() < 0.3){
        let number = Math.floor(0 + Math.random() * 900);
        if(Math.random() < 0.5){
            word += " ";
        }
        word += number.toString();
    }

    // if punctuatioon included
    if(includePunctuation && Math.random() < 0.3){
        const punctuation = punctuationList[Math.floor(Math.random() * punctuationList.length)];
        word += punctuation;
    }

    // Check for full stop and capitalize the next word
    if (word.endsWith('.')) {
        if (i + 1 < count) {
            let nextWord = wordsList[Math.floor(Math.random() * wordsList.length)];
            nextWord = nextWord.charAt(0).toUpperCase() + nextWord.slice(1);
            generatedWords.push(word);
            generatedWords.push(nextWord);
            i++; 
            continue;
        }
    }
    generatedWords.push(word);
}

return generatedWords.join(" ");
}
