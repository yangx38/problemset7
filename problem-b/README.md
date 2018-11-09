# Problem B

In this exercise, you will practice working with ES6 modules. In particular, you will implement a simple command line application to view some Tweets messages sent by the[`UW_iSchool` Twitter account](https://twitter.com/uw_ischool):

```
Here are some tweets by @UW_iSchool
- ""Poison Arrows and Other 'Killer Apps'": great topic for Thursday's @TechPolicyLab Distinguished Lecture. Be there:… https://t.co/k0qCKJyrR3" (10/31/2017, 6:30:00 PM)
- "RT @amcauce: What a glorious fall we're having! https://t.co/FqSn19SkvH" (10/31/2017, 3:47:09 PM)
- "RT @taschagroup: Interested in access to information &amp; SDGs? Digital inclusion &amp; literacy? Data analysis and development? Let's talk! https…" (10/31/2017, 2:30:28 PM)
- "RT @SPLBuzz: Seattle is officially named an international @UNESCO City of Literature! Congratulations to all who helped make it happen! @se…" (10/31/2017, 2:00:49 PM)
- "A memorial for MSIM alumnus Del Hazeley is set for Monday in the Don James Center at Husky Stadium. https://t.co/tTLoCVtxy7" (10/31/2017, 1:45:13 PM)
Search tweets, or EXIT to quit: halloween
- "RT @carolinethegeek: It's Halloween at @UW_iSchool! https://t.co/Vh7xX99308" (10/31/2017, 1:33:56 PM)
- "Wishing you all a spooktacular Halloween! https://t.co/EaVawLGlb6" (10/31/2017, 9:10:12 AM)
```

In particular, you will use ES6 modules to organize this program based on the [**Model, View, Controller (MVC)**](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) architecture. This is an incredibly common structure used when developing interactive applications (such as web apps)!

## Running the Program
Because we're using ES6 modules, you will need to use the [Babel compiler](https://babeljs.io/) to convert the code into JavaScript that can be interpretted by the Node.js runtime. You can do this easily using the `babel-node` package that is included in the exercise dependencies:

```bash
# make sure you've installed dependencies!
npm install

# make sure npm is version 5.2.0 or later
npm --version

# run the `js/index.js` script, transpiled via Babel
# call from INSIDE the problem folder!
npx babel-node js/index.js  # inside problem folder!
```
- The [`npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) command allows you to run a command line program that has been installed locally in `node_modules/` as if it were installed globally.


## Exercise Instructions
To complete the exercise, you will need to create a number of different **`.js`** files following the below instructions, each acting as a different module.

1. Begin by creating a module script **`js/Model.js`** to manage the Model. The **Model** in an MVC program represents the "data" or "information" in the program. It handles access to the underlying data structure (e.g., the array or object). In this exercise, your Model will take care of all operations involving the Twitter data to display.

    - Start by declaring that the script should be run in _strict mode_. You should do this for _every_ JavaScript file you create!

    - The Model module should begin by _importing_ the Twitter data from the included `./uw_ischool_tweets.js` file. Import the data as a **default import**, assigning it a local variable (e.g., `allTweets`).

        This data is an array of objects, each object representing a single Tweet. You can try logging it out to see what it looks like.

    - The Twitter data is quite complex, with a lot of extra information that you are not interested in. Use the **`.map()`** method to map these tweets to a new local variable that is an array of objects (one object per Tweet), but where each object has only two properties: the `text` of the tweet, and the `timestamp` for that tweet (measured as number of milliseconds since [epoch](https://en.wikipedia.org/wiki/Unix_time)).
    
        The `text` can be accessed from the original data's `text` property. The `timestamp` can be accessed from the original data's `created_at` property. You should convert this value to a number using the [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) function.

        _Do not export this local variable!_, though you will utilize it in all of the module's functions.

    - Define and `export` a function **`getRecentTweets()`** that returns an array of the **5** most recent tweets in the data set _in descending order_ (most recent first).

        You can get the most recent by [sorting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) the array, comparing the `timestamp` of each object. Note that you will need to pass in a _comparator function_ (which can be an anonymous callback function) that takes in two values and returns a negative value if the first param is "earlier" and a positive value if the second param is "earlier". Try subtracting the time stamps to produce this value!

    - Define and `export` a function **`searchTweets`** that takes in a string to search for and returns an array of tweets that contain that string anywhere in their `text` property (_Hint_: use the `.filter()` method!) You should ignore case when searching tweets (e.g., make everything lower case before comparing).

    You can test these functions by _temporarily_ calling them from inside the `Model.js` module, and executing that Module script via:

    ```bash
    npx babel-node js/Model.js
    ```

2. Next, create a module script **`View.js`** to manage the View. The **View** is a (visual) presentation of the Model; it is what the user perceives. Note that an application can have multiple Views of a single Model (e.g., you can show a Model as both a data table and as a chart). In this exercise, your View will be responsible for logging out Twitter data in a clean way.

    Define and `export` a function **`printTweets()`** that takes in an array of tweet objects (with `text` and `timestamp` properties) and logs out each tweet on its own line with the format:

    ```
    - "I am the tweet text" (10/31/2017, 3:40:01 AM)
    ```

    (Each tweet starts with a `-`, then the tweet text in `""` quotes, then a human-readable date and time in parentheses `()`).

    - You can convert the millisecond timestamp _back_ into a human-readable data by constructing a `new Date()` object (passing the timestamp as a parameter to the constructor), and then calling the `toLocalString("en-US")` method on it.

    - If the array of tweets is empty, the method should instead log `"No tweets found"`.

    You can test this function by _temporarily_ importing the `Model` module to get a list of tweets and calling the function, running the `View.js` module script via:

    ```bash
    npx babel-node js/View.js
    ```

3. Next, create a module script **`Controller.js`** to act as the Controller. The **Controller** facilitates communication between the Model and the View and traditionally handles user interaction. The Controller tells the Model to change the data in response to user input, and then tells the View to "update" itself to reflect the changed Model. In this exercise, your control will handle getting the search query from the user.

    - In order to easily get user input on the command-line, you should use the external [`readline-sync`](https://github.com/anseki/readline-sync) library (which allows you to "read" user input synchronously, one line at a time). This library has already been installed as part of the package dependencies, but you will still need to `import` it. Import the package as a **default import** (name the variable `readline`) from the `readline-sync` module.

        - Note that you do **not** place a `./` in front of the module name, as you're not specifying a path but a package in `node_modules` to load!

    - You will also need to `import` the functions from both the `Model` and the `View` modules. Use `import *` syntax to import all the functions from the Model (so you will refer to them as e.g., `model.getRecentTweets()`), and a _named import_ to import the `printTweets` function from the View.

    - Define and `export` a function **`runSearch()`**. This function should first log out a welcome message (`"Here are some tweets by @UW_iSchool"`), followed by printing the most recent tweets using the function from the other modules.

        It should then prompt the user for a search. You can use the [`readline.question()`](https://github.com/anseki/readline-sync#question) function, passing in the "prompt" (e.g., `"Search tweets, or EXIT to quit: "`. This function will return as a string whatever the user typed in response.

        Your function should then search the tweets for the user-supplied search term (again, use the functions from the other modules!), and print out the results (formatted, using functions from other modules!).

        (If the user types in `EXIT`, the function should end without searching or printing).

    You can test this function by _temporarily_ calling it in the Controller module, and then running that module script via:

    ```bash
    npx babel-node js/Controller.js
    ```

4. Finally, create a module script **`index.js`** to be the "entry (starting) point" for your application (e.g., the thing the user actually runs).

    This module just needs to import the `runSearch` function from the Controller, and then call that function!

    You will then be able to run and test your app using:

    ```
    npx babel-node js/index.js
    ```
