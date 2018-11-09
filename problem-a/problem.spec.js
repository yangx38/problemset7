const fs = require('fs');

//include custom matchers
const styleMatchers = require('jest-style-matchers');
expect.extend(styleMatchers);

const htmlPath = __dirname + '/index.html';
const html = fs.readFileSync(htmlPath, 'utf-8'); //load the HTML file once
const jsPath = __dirname + '/js/index.js';

describe('Source code is valid', () => {
  test('JavaScript lints without errors', async () => {
    expect([jsPath]).toHaveNoEsLintErrors({
      rules:{
        'prefer-arrow-callback': ['error'] //requires arrow functions!
      }
    });
  })
});

//load the HTML into the tester
document.documentElement.innerHTML = html;

//load JavaScript libraries separately
const $ = require('jquery'); //jQuery for convenience
window.jQuery = window.$ = $; //make available to solution
let solution = require(jsPath); //load the solution

describe('the `Task` class', () => {
  let sampleTask, sampleIncomplete, taskRendered;

  test('has correct attributes', () => {
    sampleTask = new solution.Task('sampleTask', true);
    sampleIncomplete = new solution.Task('sampleIncomplete', false);        

    expect(sampleTask.description).toEqual('sampleTask'); //has correct description attr
    expect(sampleTask.complete).toBeTruthy(); //has correct complete attribute
    expect(sampleIncomplete.complete).toBeFalsy(); //has correct complete attribute
  })

  test('renders correctly', () => {
    taskRendered = $(sampleTask.render()); //render as element
    expect(taskRendered.is('li')); //is right type        
    expect(taskRendered.text()).toEqual('sampleTask'); //has correct text
    expect(taskRendered.hasClass('font-strike')).toBe(true); //has correct class
    expect($(sampleIncomplete).hasClass('font-strike')).toBe(false); //has correct class
  })

  test('can toggle finished', () => {
    sampleTask.toggleFinished();
    expect(sampleTask.complete).toBe(false); //changes with direct input after toggle
    sampleTask.toggleFinished(); //swap back for next test
    expect(sampleTask.complete).toBe(true); //changes with direct input after toggle
    
    taskRendered.click(); //click DOM
    expect(sampleTask.complete).toBe(false); //should be false (not done) after click
    expect(taskRendered.hasClass('font-strike')).toBe(false); //should not be crossed out after click
  })
});

describe('The `TaskList` class', () => {
  let sampleTaskList;

  test('has correct attributes', () => {
    sampleTaskList = new solution.TaskList([ //instantiate with test tasks
      new solution.Task('sampleTask', true),
      new solution.Task('sampleSecond', false)
    ])

    expect(sampleTaskList.tasks.length).toBe(2); //sample has 2 items
    expect(sampleTaskList.tasks[0] instanceof solution.Task).toBe(true); //first is a Task
  })

  test('can add a new task', () => {
    sampleTaskList.addTask('new task');
    expect(sampleTaskList.tasks.length).toBe(3);
    expect(sampleTaskList.tasks[2] instanceof solution.Task).toBe(true); //new item is a task
    expect(sampleTaskList.tasks[2].description).toEqual('new task'); //what we added
    expect(sampleTaskList.tasks[2].complete).toBeFalsy(); //what we added
    expect(sampleTaskList.tasks[0].description).toEqual('sampleTask'); //didn't change old
  })

  test('renders correctly', () => {
    let taskListRendered = $(sampleTaskList.render()); //render as element
    expect(taskListRendered.is('ol')); //right type
    expect(taskListRendered.children('li').length).toBe(3); //has correct children elements
    expect(taskListRendered.children('li').eq(0).text()).toEqual('sampleTask'); //children elements have right data
  })
})

describe('The `NewTaskForm` class', () => {
  let sampleForm;

  test('renders correctly', () => {
    sampleForm = new solution.NewTaskForm();
    let formRendered = $(sampleForm.render());
    expect(formRendered.is('form')); //rendered as correct elements

    expect(formRendered.children('input').length).toBe(1); //rendered contains input
    expect(formRendered.children('input').attr('placeholder')).toEqual("What else do you have to do?");

    expect(formRendered.children('button').length).toBeGreaterThanOrEqual(1); //rendered contains button
    expect(formRendered.children('button').text()).toEqual('Add task to list'); //has button
  })

  test('executes give callback function on submit', () => {
    const callback = jest.fn((d) => d); //mock

    sampleForm = new solution.NewTaskForm(callback); //make version with callback
    expect(sampleForm.submitCallback).toBe(callback); //handles constructor

    let formRendered = $(sampleForm.render());
    formRendered.children('input').val('test input');
    formRendered.children('button').click(); //click the button
    expect(callback).toHaveBeenCalledWith('test input'); //callback executed with typed value on click
  });
})

describe('The `App` class', () => {
  let sampleApp, container;

  test('renders correctly', () => {
    let sampleTaskList = new solution.TaskList([ //instantiate with test tasks
      new solution.Task('sampleTask', true),
      new solution.Task('sampleSecond', false)
    ]);

    container = document.createElement('div');
    sampleApp = new solution.App(container, sampleTaskList);
    sampleApp.render(); //and render!

    expect($(container).find('ol').length).toBe(1); //rendered app contains list
    expect($(container).find('li').length).toBe(2); //rendered app contains items
    expect($(container).find('form').length).toBe(1); //rendered app contains form
  })

  test('is rendered on the web page', () => {
    let domApp = $('#app')
    expect(domApp.find('ol').length).toBe(1); //dom contains ol
    expect(domApp.find('form').length).toBe(1); //dom contains form
  })

  test('can add a new Task directly', () => {
    sampleApp.addTaskToList('app added task');
    expect(sampleApp.taskList.tasks.length).toBe(3); //has 3 tasks after adding
    expect(sampleApp.taskList.tasks[2].description).toEqual('app added task'); //spot-check description
    
    expect($(container).find('li').length).toBe(3); //has 3 items after adding
  });

  test('can add new Tasks through the form', () => {
    $('input').val('form-added task');
    $('button').click(); //submit
    expect($('#app li').length).toBe(3); //has 3 items after clicking button
    expect($('#app li:last').text()).toEqual('form-added task'); //last item is new task
  });      
});
