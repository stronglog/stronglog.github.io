

function displayWorkoutHistory() {
    let workoutHistory = JSON.parse(localStorage.getItem("workoutHistory"));
    console.log(workoutHistory);

    if (workoutHistory !== null) {      
        let historyPage = document.getElementById("page_3");

        while (historyPage.firstChild) {
           historyPage.removeChild(historyPage.firstChild);
        }

        console.log(workoutHistory.length);
        for (let i=0; i<workoutHistory.length; i++) {
            console.log(workoutHistory[i]);
            let startTime = workoutHistory[i].startTime;
            let durationSeconds = workoutHistory[i].durationSeconds;
            let exerciseList = createList(workoutHistory[i].workout);

            let title = createTitle(startTime);
            
            let newDiv = document.createElement("DIV");
            let newTitle = document.createElement("H2");
            let titleString = document.createTextNode(title);

            newTitle.appendChild(titleString);

            newDiv.appendChild(newTitle);
            newDiv.appendChild(exerciseList);
            
            historyPage.appendChild(newDiv);
            console.log("hello "+i);
        }
    }
}

function createTitle(startTime) {
    let localDateTime = createLocalDateTimeString(startTime);
    return "Workout (" + localDateTime + ")";
}

function createList(workout) {
    newList = document.createElement("OL");    
        
    for (let i=0; i<workout.length; i++) {
        newItem = document.createElement("LI");

        if (workout[i].Reps > 1) {
            if (workout[i].Weight > 0) {
                newItem.innerText = workout[i].Exercise + " " + workout[i].Reps + " reps at " + workout[i].Weight + "kg ";
            } else {
                newItem.innerText = workout[i].Exercise + " " + workout[i].Reps + " reps ";
            }
        } else {
            if (workout[i].Weight > 0) {
                newItem.innerText = workout[i].Exercise + " " + workout[i].Reps + " rep at " + workout[i].Weight + "kg ";
            } else {
                newItem.innerText = workout[i].Exercise + " " + workout[i].Reps + " rep ";
            }
        }
        newList.appendChild(newItem);
    }
    return newList;
}




function localSaveWorkoutHistory(workout, startTime, durationSeconds) {
    let workoutHistory = JSON.parse(localStorage.getItem("workoutHistory"));

    let historyObject = {};
    historyObject["startTime"] = startTime;
    historyObject["durationSeconds"] = durationSeconds;
    historyObject["workout"] = workout;

    
    if (workoutHistory !== null) {
        workoutHistory.push(historyObject);
    } else {
        workoutHistory=[];
        workoutHistory[0] = historyObject;
    }
    localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
}