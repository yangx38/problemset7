const fs = require('fs');

//load readline for later mocking
const readline = require('readline-sync'); //load readline

//include custom matchers
const styleMatchers = require('jest-style-matchers');
expect.extend(styleMatchers);

//console spy!
const LOG = []; //global to store the logged output
let storeLogFunction = (...inputs) => {
  LOG.push(inputs.reduce((out, arg) => {
    return out+' '+(typeof arg === 'string' ? arg : JSON.stringify(arg));
  },'').trim()); //add it to the log
}
console['log'] = jest.fn(storeLogFunction) //store results of console.log


describe('Source code is valid', () => {
  test('JavaScript lints without errors', async () => {

    const sources = ['index.js','Model.js','View.js','Controller.js'].map((src) => __dirname + '/js/' + src);
    const linterOptions = {
      parserOptions: { sourceType: "module" },
      rules:{
        'prefer-arrow-callback': ['error'] //requires arrow functions!
      }
    }

    sources.forEach((source) => {
      // console.info(source); //blobs don't work it seems...
      expect([source]).toHaveNoEsLintErrors(linterOptions);
    })
  })
});

describe('Model.js module', () => {
  let model = require(__dirname + '/js/Model')
 
  test('getRecentTweets() function', () => {
    let results = model.getRecentTweets();
    expect(results.length).toBe(5); //5 tweets

    const example1 = { text: 'RT @amcauce: What a glorious fall we\'re having! https://t.co/FqSn19SkvH',
    timestamp: 1509490029000 };

    expect(results[1]).toEqual(example1); //has correct format/content

    expect(results[0].timestamp).toEqual(1509499800000); //first is most recent
    expect(results[4].timestamp).toEqual(1509482713000); //last is right (ordered)
  });

  test('searchTweets() function', () => {
    let results = model.searchTweets('hall');
    expect(results.length).toBe(3); //gets right number

    let halloween1 = { text: 'RT @carolinethegeek: It\'s Halloween at @UW_iSchool! https://t.co/Vh7xX99308',
    timestamp: 1509482036000 };
    let challenge = { text: 'Congrats to our Informatics and MSIM students who competed in @Concur’s inaugural Coding Challenge at the iSchool! https://t.co/prQCpytn21',
    timestamp: 1509381961000 };
    expect(results).toContainEqual(halloween1);
    expect(results).toContainEqual(challenge);

    results = model.searchTweets(''); //empty should should get everything
    expect(results.length).toBe(50);

    results = model.searchTweets('QWERTY'); //not real search!
    expect(results.length).toBe(0);
  });
})

describe('View.js module', () => {
  let view = require(__dirname + '/js/View');
  
  test('printTweets() function', () => {

    const tweets = [{text:'sample tweet', timestamp:Date.parse(new Date(2017,9,31,23,59))},
                    {text:'second sample', timestamp:Date.parse(new Date(2017,8,20,3,43))}];

    view.printTweets(tweets);
    expect(LOG[LOG.length-2]).toEqual('- "sample tweet" (10/31/2017, 11:59:00 PM)'); //check latest entries
    expect(LOG[LOG.length-1]).toEqual('- "second sample" (9/20/2017, 3:43:00 AM)');
    
    view.printTweets([]); //empty
    expect(LOG[LOG.length-1]).toMatch('No tweets found');
  });

})

describe('Controller.js module', () => {
  let controller = require(__dirname + '/js/Controller');

  test('runSearch() function', () => {
    expect(typeof controller.runSearch).toEqual('function'); //exists
    readline['question'] = jest.fn(() => 'hall'); //mock to return "hall"      
    controller.runSearch();

    let tail = LOG.slice(-3);
    expect(tail).toContain('- "Wishing you all a spooktacular Halloween! https://t.co/EaVawLGlb6" (10/31/2017, 9:10:12 AM)')
  })
})

describe('index.js entry script', () => {
  test('runs the program', () => {
    readline['question'] = jest.fn(() => 'fall'); //mock to return "fall"            
    require(__dirname + '/js/index.js'); //run it!

    let tail = LOG.slice(-2);
    expect(tail).toContain('- "RT @amcauce: What a glorious fall we\'re having! https://t.co/FqSn19SkvH" (10/31/2017, 3:47:09 PM)');
  })
})


