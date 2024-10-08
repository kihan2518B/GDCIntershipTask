// console.log("Hello, World!");

const fs = require("fs");
const path = require("path");

// Define the path to the task.txt file
const TasksFilePath = path.join(__dirname, "task.txt");
const CompletedTasksFilePath = path.join(__dirname, "completed.txt");


//Adding task to file
function HandleAddTask(args) {
    const [priority, task] = args;
    if (!priority || !task) {
        console.log("Error: Missing tasks string. Nothing added!");
        return;
    }
    if (priority < 0) {
        console.log("Error: Cant add a task with priority less then 0");
        return;
    }

    let tasks = [];//Empty array of task from task.txt file

    try {

        if (fs.existsSync(TasksFilePath)) {//Check for the file if it exists or not
            const fileContent = fs.readFileSync(TasksFilePath, 'utf-8');
            tasks = fileContent
                .split("\n")
                .filter(line => line.trim() != '')
                .map(line => {
                    const [p, ...t] = line.split(" ") //Spliting Priority and task by space
                    return { priority: parseInt(p, 10), task: t.join(' ') };
                });
        }
    } catch (error) {
        console.log("Error while Reading task.txt: ", error);
    }

    // Converting the priority to integer
    const PriorityInt = parseInt(priority, 10);

    // Insert the new task at the correct position
    let added = false;
    for (let i = 0; i < tasks.length; i++) {
        if (PriorityInt < tasks[i].priority) {
            tasks.splice(i, 0, { priority: PriorityInt, task });
            added = true;
            break;
        }
    }

    // If the task wasn't added, add it at the end
    if (!added) {
        tasks.push({ priority: PriorityInt, task });
    }

    // Convert the tasks array back to the formate of task to be added in file
    const UpdatedTasksContent = tasks
        .map(t => `${t.priority} ${t.task}`)
        .join('\n');

    try {
        //Overwritting the file with updated content
        fs.writeFileSync(TasksFilePath, UpdatedTasksContent);

        console.log(`Added task: "${task}" with priority ${priority}`);
    } catch (error) {
        console.log("Error while adding task to file: ", error);
    }

}

//Function to list the tasks order wise
function handleListTask() {
    let tasks = [];//Empty array of task from task.txt file

    try {

        if (fs.existsSync(TasksFilePath)) {//Check for the file if it exists or not
            const fileContent = fs.readFileSync(TasksFilePath, 'utf-8');
            tasks = fileContent
                .split("\n")
                .filter(line => line.trim() != '')
                .map(line => {
                    const [p, ...t] = line.split(" ") //Spliting Priority and task by space
                    return { priority: parseInt(p, 10), task: t.join(' ') };
                });
        }
    } catch (error) {
        console.log("Error while Reading task.txt: ", error);
    }

    if (tasks.length === 0) {//if the file is empty or no task is added or all tasks are completed
        console.log('There are no pending tasks!');
        return;
    }

    //logging the tasks in formated manner
    for (let i = 0; i < tasks.length; i++) {
        console.log(`${i + 1}. ${tasks[i].task} [${tasks[i].priority}]`);
    }
}

//function to Handle Delete a task
function handleDeleteTask(args) {
    const index = parseInt(args[0], 10)
    // console.log("index: ", index);

    if (!args[0]) {
        console.log("Error: Missing NUMBER for deleting tasks.");
        return;
    }

    //First reading the file
    let tasks = [];
    try {

        if (fs.existsSync(TasksFilePath)) {//Check for the file if it exists or not
            const fileContent = fs.readFileSync(TasksFilePath, 'utf-8');
            tasks = fileContent
                .split("\n")
                .filter(line => line.trim() != '')
                .map(line => {
                    const [p, ...t] = line.split(" ") //Spliting Priority and task by space
                    return { priority: parseInt(p, 10), task: t.join(' ') };
                });
        }
    } catch (error) {
        console.log("Error while Reading task.txt: ", error);
    }

    //Checks for non existing tasks
    if (index == 0 || index > tasks.length) {
        console.log(`Error: task with index #${index} does not exist. Nothing deleted.`);
        return;
    }

    //Filtering task and removing the task with required index
    const newTasks = tasks.filter((task, idx) => idx != index - 1);

    //Converting newtasks array to the formate of task to write in the file
    const UpdatedTasksContent = newTasks
        .map(t => `${t.priority} ${t.task}`)
        .join('\n');

    try {
        //Overwritting the file with updated content
        fs.writeFileSync(TasksFilePath, UpdatedTasksContent);
        console.log(`Deleted task #${index}`)
    } catch (error) {
        console.log("Error while adding task to file: ", error);
    }
}

//Function to mark a task as completed
function handleMarkAsDone(args) {
    const index = parseInt(args[0], 10)
    // console.log("index: ", index);

    if (!args[0]) {
        console.log("Error: Missing NUMBER for marking tasks as done.");
        return;
    }

    //First reading the file
    let pendingTasks = [];
    let completedTasks = [];
    try {

        if (fs.existsSync(TasksFilePath)) {//Check for the file if it exists or not
            const fileContent = fs.readFileSync(TasksFilePath, 'utf-8');
            pendingTasks = fileContent
                .split("\n")
                .filter(line => line.trim() != '')
                .map(line => {
                    const [p, ...t] = line.split(" ") //Spliting Priority and task by space
                    return { priority: parseInt(p, 10), task: t.join(' ') };
                });
        }
        if (fs.existsSync(CompletedTasksFilePath)) {
            const fileContent = fs.readFileSync(CompletedTasksFilePath, 'utf-8');
            completedTasks = fileContent
                .split("\n")
                .filter(line => line.trim() != '')
                .map(line => {
                    const [p, ...t] = line.split(" ") //Spliting Priority and task by space
                    return { priority: parseInt(p, 10), task: t.join(' ') };
                });
        }
    } catch (error) {
        console.log("Error while Reading File: ", error);
    }

    //Checks for non existing tasks
    if (index == 0 || index > pendingTasks.length) {
        console.log(`Error: no incomplete item with index #${index} exists.`);
        return;
    }


    //Adding required task to completed.txt file
    // Insert the new task at the correct position
    let added = false;
    const currentTask = pendingTasks[index - 1];

    for (let i = 0; i < completedTasks.length; i++) {
        if (currentTask.priority < completedTasks[i].priority) {
            completedTasks.splice(i, 0, { priority: currentTask.priority, task: currentTask.task });
            added = true;
            break;
        }
    }

    // If the task wasn't added, add it at the end
    if (!added) {
        completedTasks.push({ priority: currentTask.priority, task: currentTask.task });
    }

    try {
        const UpdatedCompletedTasksContent = completedTasks
            .map(t => `${t.priority} ${t.task}`)
            .join('\n');

        //overwritting the completed.txt file with updated content
        fs.writeFileSync(CompletedTasksFilePath, UpdatedCompletedTasksContent);
        console.log(`Marked item as done.`)
    } catch (error) {
        console.log("Error while adding task to file: ", error);
    }

    //Filtering task and removing the task from task.txt with required index
    const newTasks = pendingTasks.filter((task, idx) => idx != index - 1);

    //Converting newtasks array to the formate of task to write in the file
    const UpdatedPendingTasksContent = newTasks
        .map(t => `${t.priority} ${t.task}`)
        .join('\n');

    try {
        //Overwritting the file with updated content
        fs.writeFileSync(TasksFilePath, UpdatedPendingTasksContent);
    } catch (error) {
        console.log("Error while adding task to file: ", error);
    }
}

//Function to show report of tasks
function handleReport() {

    // reading both files to get pending and completed tasks
    let pendingTasks = [];
    let completedTasks = [];
    try {

        if (fs.existsSync(TasksFilePath)) {//Check for the file if it exists or not
            const fileContent = fs.readFileSync(TasksFilePath, 'utf-8');
            pendingTasks = fileContent
                .split("\n")
                .filter(line => line.trim() != '')
                .map(line => {
                    const [p, ...t] = line.split(" ") //Spliting Priority and task by space
                    return { priority: parseInt(p, 10), task: t.join(' ') };
                });
        }
        if (fs.existsSync(CompletedTasksFilePath)) {
            const fileContent = fs.readFileSync(CompletedTasksFilePath, 'utf-8');
            completedTasks = fileContent
                .split("\n")
                .filter(line => line.trim() != '')
                .map(line => {
                    const [p, ...t] = line.split(" ") //Spliting Priority and task by space
                    return { priority: parseInt(p, 10), task: t.join(' ') };
                });
        }
    } catch (error) {
        console.log("Error while Reading File: ", error);
    }

    //Logging results
    console.log(`Pending : ${pendingTasks.length}`);
    for (let i = 0; i < pendingTasks.length; i++) {
        console.log(`${i + 1}. ${pendingTasks[i].task} [${pendingTasks[i].priority}]`)
    }

    console.log(`\nCompleted : ${completedTasks.length}`);
    for (let i = 0; i < completedTasks.length; i++) {
        console.log(`${i + 1}. ${completedTasks[i].task}`)
    }
}

//This function will handle the input from the CLI
function handleCLICommands(command, args) {
    // console.log("command: ", command);
    // console.log("args: ", args);

    switch (command) {
        case "add":
            //calling add task method
            HandleAddTask(args);
            break;
        case "help":
            console.log('Usage :-\n$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list\n$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order\n$ ./task del INDEX            # Delete the incomplete item with the given index\n$ ./task done INDEX           # Mark the incomplete item with the given index as complete\n$ ./task help                 # Show usage\n$ ./task report               # Statistics`');
            break;
        case "ls":
            handleListTask();
            break;
        case "del":
            handleDeleteTask(args);
            break;
        case "done":
            handleMarkAsDone(args);
            break;
        case "report":
            handleReport();
            break;
        default:
            console.log('Usage :-\n$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list\n$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order\n$ ./task del INDEX            # Delete the incomplete item with the given index\n$ ./task done INDEX           # Mark the incomplete item with the given index as complete\n$ ./task help                 # Show usage\n$ ./task report               # Statistics`');
            break;
    }
}
//Calling this function to handle cli arguments
handleCLICommands(process.argv[2], process.argv.slice(3))
