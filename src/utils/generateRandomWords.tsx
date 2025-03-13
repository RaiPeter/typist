export const generateRandomWords = (count: number, includeNumber: boolean, includePunctuation: boolean) => {
const wordsList = ["the", "quick", "brown", "fox", "jump", "over", "lazy", "dog", "happy", "sun", "moon", "star","have", "with", "this", "from", "they", "will", "would", "there", "their", "what", "about", "which"];
const numbersList = ["123",'234','23','234','345','345','678','4566','531','572','195','539'];
const punctuationList = [",",".",'!','@','#','$','?',':',';','&','*'];

let generatedWords: string[] = [];

for (let i = 0; i < count; i++) {
    let word = wordsList[Math.floor(Math.random() * wordsList.length)];

    // if numbers is added
    if(includeNumber && Math.random() < 0.3){
        word =  numbersList[Math.floor(Math.random() * numbersList.length)]
    }

    // if punctuatioon included
    if(includePunctuation && Math.random() < 0.3){
        const punctuation = punctuationList[Math.floor(Math.random() * punctuationList.length)];
        word += punctuation;
    }
    generatedWords.push(word);
}

return generatedWords.join(" ");
}
