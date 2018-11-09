# Problem A

In this exercise, you will practice using ES6 `class` syntax and _arrow functions_ to re-implement the Task List application from the previous problem set using a _component_-based architecture.

To complete the exercise, follow the instructions below to edit the **`js/index.js`** file and add in the required code. Note that you should ___NOT___ edit the HTML file!

You can see the results of your work by opening up the included `index.html` file in a browser. Remember to refresh the page after you update your code, and to check for any errors in the Developer console. (_Warning_: because you're using ES6 syntax, this exercise will not work in Internet Explorer or other older browsers).


1. Define a class **`Task`** that represents a single task in a to-do list. Include:

    - a constructor that takes two arguments: a string description of the task, and a boolean for whether or not the task is completed. The constructor should initialize a **`description`** attribute (field) for the task's description and a **`complete`** attribute for whether the task is finished.
  
    - a **`render()`** method that _returns_ a DOM element representing the object. This element should be a `<li>` whose content is the `description` of the `Task`, and has the `font-strike` CSS class if it is `complete` (to cross it out).

    You can test your class by _temporarily_ instantiating it (with the `new` keyword, passing it a description string and completion status) and calling its `render()` method, then appending the returned element to the DOM (e.g., to `#app`).

2. Modify the `Task` class to give it the ability to "cross off" an uncompleted task. Add a **`toggleFinished()`** method to the class that "toggles" the object's `complete` attribute (from `false` to `true` and vice versa).

    Second, modify the Task's `render()` method to add a click listener to the `<li>` that is created. When the element is clicked, call the `toggleFinished()` method (on `this` object) and ALSO toggle the presence of the `font-strike` class on the element. _Note_: you **must** use an arrow function for the anonymous callback function!

    (Note that `toggleFinished()`'s logic is kept separate from the event listener so that other classes can modify this object's attributes, but the `render()` method still needs to handle the appearance change).

    You can test your modification by clicking on the rendered Task.

3. Define a class **`TaskList`** that represents a list of Tasks. Include:

    - a constructor that takes in an _array_ of `Task` objects and uses that to initialize an attribute called **`tasks`**.
    
    - an **`addTask()`** method that takes in a _string_ description of a task, and uses that to instantiate a _new_ `Task` object (which is _not_ complete) and adds it to the list. You will need to call the `Task` constructor!

    - a **`render()`** method that _returns_ an `<ol>` DOM element containing a rendering of each `Task` in the list. Use a `forEach()` loop (with an arrow function callback!) to render each individual `Task` and append the resulting element to the `<ol>`.

    You can test your class by _temporarily_ instantiating it (with the `new` keyword, passing it an array of `Task` objects) and calling its `render()` method, then appending the returned element to the DOM (e.g., to `#app`).

4. Define a class **`NewTaskForm`** that represents a form for adding tasks to the list. Your class should include a **`render()`** method that returns a `<form>` DOM element. The `<form>` should include as children:

    - an `<input>` element with CSS classes `form-control` and `mb-3`. The `<input>` should have a `placeholder` attribute of `"What else do you have to do?"` (use the `setAttribute()` method, since the `placeholder` attribute isn't build into the DOM spec!)

    - a `<button>` element with CSS classes `btn` and `btn-primary`. The button should read `"Add task to list"`.

    Again, you can test your class by instantiating it and appending it to the DOM.

5. Define a class **`App`** that will represent the entire application. Include:

    - an attribute **`parentElement`** representing the DOM element containing this app, and an attribute **`taskList`** representing the `TaskList` to render. _Both attributes should be passed in as constructor parameters (in order)._

    - a **`render()`** method that appends the rendered `taskList` attribute to the `parentElement`. It should instantiate a new `NewTaskForm` object, `render()` it, and append that element to the `parentElement` as well.

        Optionally, to make the form match the previous exercise, you can also append a subheading:
        `<p class="lead">Things I have to do</p>`

6. Instantiate a new `App` object, passing it a reference to the `#app` DOM element as the parent and a new `TaskList` containing two tasks: `"Make some classes"` (marked as complete), and `"Arrow some functions"` (not marked as complete).

    Then call the `render()` method on your `App` object to make it appear! This is _not_ temporary, and is your full app being shown.

7. Add the ability for the app to add new tasks to the list (e.g., through the form). Modify the `App` class to give it an additional method **`addTaskToList()`**. This method should take as a parameter a string description of a task, and should call the `taskList` attribute's `addTask()` method to add a new task with that description (and incomplete status).

    Once a new task is added, this method should clear the contents of the `parentElement` and then call `render()` on the `App` (i.e., `this`), allowing the `App` to be "re-rendered" with the new item included.

    (You can test this by _temporarily_ calling `addTaskToList()` on your instantiated `App`, passing it a sample string).

8. Finally, you need to make it so that the when the form is submitted, it is able to call the `addTaskToList()` method on the `App`. However, the `NewTaskForm` is a **self-contained component**; it has no knowledge of the `App` class that created it. Thus it will need to be _told_ about the `addTaskToList()` method so that it can call it. Luckily, since functions are values, you can pass that function as a _parameter_ to the `NewTaskForm` constructor!

    Add a constructor to the `NewTaskForm` class that takes as a parameter a _callback function_ that will be the function to execute when the form is submitted. Assign this parameter to a **`submitCallback`** attribute.

    In the form's `render()` method, add a listener to the `<button>` so that when the button is clicked, you call the object's `submitCallback` attribute (as a function), passing it the `value` of the `<input>`.

    - Remember to also call `preventDefault()` on the callback's `event` parameter to avoid submitting the form!

    - You will _need_ to use an arrow function for the callback so that you have the correct `this` reference (but you should be doing that anyway).
    
    Since the `NewTaskForm` constructor now takes a parameter, you will need to modify the `App` class so that you pass it the `this.addTaskToList` method as a callback when you instantiate the form in the `render()` method.
    
    - **HOWEVER**, the `addTaskToList()` method needs to be called on the `App` so that it has the correct `this`; when you call the `submitCallback` from inside the form, it is being called _on the form_. Thus you will need to use _another_ arrow function to "bind" the `App` as the `this` variable to the `addTaskToList()` function: 
    
        When you instantiate the `NewTaskApp` (in the `App.render()` function), instead of passing the `this.addTaskToList` function directly, instead use a _concise_ arrow function to create an anonymous callback function. This anonymous callback should take in a string description and then call the `this.addTaskToList()` method itself (passing in that description). Thus you will be passing to the `NewTaskForm` constructor an anonymous callback function which has a bound `this` variable.

    You should now be able to add new tasks to the list by entering them in the form and clicking the button! 
