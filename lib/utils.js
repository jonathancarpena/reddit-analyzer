import Sentiment from 'sentiment'
export function textAnalysis(text) {
    const sentiment = new Sentiment()
    const { score, calculation, tokens } = sentiment.analyze(text)
    const allScores = calculation.map((item) => {
        const key = Object.values(item)[0]
        return key
    })
    let total = 0
    let positive = 0
    allScores.forEach((item) => {
        if (item < 0) {
            let num = item * -1
            total += num
        } else {
            positive += item
            total += item
        }
    })

    const filterShortWords = tokens.filter((item) => item.length > 2)
    return {
        neutralScore: total,
        positiveScore: positive,
        score,
        words: filterShortWords
    }
}
export function syllableCount(word) {
    word = word.toLowerCase();
    var t_some = 0;
    if (word.length > 3) {
        if (word.substring(0, 4) === "some") {
            word = word.replace("some", "");
            t_some++;
        }
    }
    word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    var syl = word.match(/[aeiouy]{1,2}/g);
    if (syl) {
        return syl.length + t_some;
    } else {
        return 1
    }
}

function removeChars(text) {
    const regexChars = /[_][(]|[)]|[^][0-9]([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g
    const replaceWith = ' '
    const result = text.replace(regexChars, replaceWith);
    return result
}

export function fleschFormula(sentences) {
    // Results: 
    // 90-100: 5th grade reading level Very Easy
    // 80-90: 6th grade reading level Easy
    // 70-80: 7th grade reading level Fairly Easy
    // 60-70: 8th and 9th grade reading level Standard
    // 50-60: High school reading level Fairly Difficult
    // 30-50: College student reading level Difficult
    // 10-30: College graduate reading level Very Difficult
    // 10 or lower: Professional or reader with an advanced university degree

    // Steps //
    // 1. Count the Total Syllables, Words, and Sentences
    // 2. Divide Total Words by Total Sentences -> Multiply by 1.015 (Round to 0.001)
    // 3. Divide Total Syllables by Total Words -> Multiply by 84.6
    // 4. 206.835 - (Step 2) -> (ANSWER) - (Step 3)
    const total_Sentences = sentences.length
    let total_Words = 0
    let total_Syllables = 0
    // let total_Characters = 0

    sentences.forEach((item) => {
        // const sentence = removeChars(item)
        const words = item.split(' ').filter((item) => item !== '')
        words.forEach((word) => {
            total_Syllables += syllableCount(word)
            // total_Characters += word.length
        })
        total_Words += words.length

    })

    const wordsBySentences = (total_Words / total_Sentences) * 1.015
    const syllablesByWords = (total_Syllables / total_Words) * 84.6
    let results = Math.round((206.835 - wordsBySentences) - syllablesByWords)

    if (results < 0) {
        results *= -1
    }

    return results
}

export function calcFrequency(array, limit) {
    const freq = array.reduce((accumulator, current) => {
        if (accumulator[current]) {
            return {
                ...accumulator,
                [current]: accumulator[current] + 1
            }
        } else {
            return {
                ...accumulator,
                [current]: 1
            }
        }
    }, {})


    const commonWords = ['a', 'i', 'of', 'to', 'in', 'it', 'is', 'be', "i'm", 'as', 'at', 'so', 'we', 'he', 'by', 'or', 'on', 'do', 'if', 'me', 'my', 'up', 'an', 'go', 'us', 'am', "it's", 'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'much', 'some', 'part', "that's", 'really', 'https', 'www', 'com', 'net', 'gov', 'edu', "again", "anyway", "besides", "certainly", "consequently", "elsewhere", "finally", "furthermore", "however", "instead", "likewise", "meanwhile", "nevertheless", "nonetheless", "otherwise", "rather", "similarly", "subsequently", "still", "then", "therefore", "thus", "afterward", "already", "almost", "back", "even", "far", "fast", "hard", "here", "how", "late", "long", "low", "more", "near", "never", "next", "now", "often", "quick", "rather", "slow", "so", "soon", "still", "then", "today", "tomorrow", "too", "very", "well", "where", "yesterday", "about", "above", "across\tafter", "ago", "below\tby", "during", "for", "from", "into", "off", "over", "past", "since", "through", "under", "until", "can", "could", "must", "have", "may", "might", "would", "shall", "ought", "could", "i'm", "I'll", "i'll", "them", "got", "just", "thing", "also", "though", "other", "were", "he's", "she's", "using", "which", "does", "there"]



    const _ = Object.entries(freq)
        .filter((item) => !commonWords.includes(item[0]))
        .map((item) => ({ word: item[0], value: item[1], percent: Math.round((item[1] / array.length) * 100) }))
        .sort((a, b) => b.value - a.value)

    let result = [..._]

    if (limit) {
        return result.slice(0, limit)
    } else {
        return result
    }


}


export function unix(timestamp) {
    return new Date(timestamp * 1000)
}

export function toTitleCase(str) {

    const newStr = str.split(' ')
        .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');
    return newStr
}
