
displayExerciseHistory();

function displayExerciseHistory() {
    let workoutHistory = JSON.parse(localStorage.getItem("workoutHistory"));
    console.log(workoutHistory);

    let exerciseList = {};

    if (workoutHistory !== null) {
        for (let i=0; i<workoutHistory.length; i++) {
            for (let j=0; j<workoutHistory[i].workout.length; j++) {
                let exerciseName = workoutHistory[i].workout[j].Exercise;
                let keyPresent = findKey(exerciseList, exerciseName);
                if (keyPresent === false) {
                    exerciseList[exerciseName] = [];
                    console.log(exerciseList);
                }
                let k = exerciseList[exerciseName].length;
                console.log(k);
                exerciseList[exerciseName][k] = {};
                exerciseList[exerciseName][k]["dateTime"] = workoutHistory[i].startTime;
                exerciseList[exerciseName][k]["Reps"] = workoutHistory[i].workout[j].Reps;
                exerciseList[exerciseName][k]["Weight"] = workoutHistory[i].workout[j].Weight;
                
            }            
        }
    }
    console.log(exerciseList);
}

function findKey(inputObject, item) {
    for (key in inputObject) {
        if (key === item) {
            return true
        }
    }
    return false;
}

function displayWorkoutHistory() {
    let workoutHistory = JSON.parse(localStorage.getItem("workoutHistory"));
    //console.log(workoutHistory);

    if (workoutHistory !== null) {      
        let historyPage = document.getElementById("page_3");

        while (historyPage.firstChild) {
           historyPage.removeChild(historyPage.firstChild);
        }

        //console.log(workoutHistory.length);
        for (let i=0; i<workoutHistory.length; i++) {
            //console.log(workoutHistory[i]);
            let startTime = workoutHistory[i].startTime;
            let durationSeconds = workoutHistory[i].durationSeconds;

            let newDiv = document.createElement("DIV");
            
            let titleString = createTitle(startTime);
            let newTitle = document.createElement("H2");
            let titleText = document.createTextNode(titleString);
            newTitle.appendChild(titleText);

            let durationString = createDuration(durationSeconds);
            let newPara = document.createElement("P");
            let durationText = document.createTextNode(durationString);
            newPara.appendChild(durationText);

            let exerciseList = createList(workoutHistory[i].workout);


            newDiv.appendChild(newTitle);
            newDiv.appendChild(newPara);
            newDiv.appendChild(exerciseList);
            
            historyPage.appendChild(newDiv);
        }
    }
}

function createDuration(durationSeconds) {
    let hours = Math.floor(durationSeconds / 3600);

    let remainingSeconds = durationSeconds - (hours * 3600);    
    let minutes = Math.floor(remainingSeconds / 60);

    remainingSeconds = remainingSeconds - (minutes * 60);
    let seconds = Math.floor(remainingSeconds);

    //console.log(seconds);
    //console.log(minutes);
    //console.log(hours);

    let timeString = "";
    
    if (hours > 0) {
        if (hours > 1) {
            timeString = hours.toString() + " hrs ";
        } else {
            timeString = hours.toString() + " hr ";
        }
        
    }
    if (minutes > 0) {
        if (minutes > 1) {
            timeString = timeString + minutes.toString() + " mins ";
        } else {
            timeString = timeString + minutes.toString() + " min ";
        }
    }
    if (hours === 0 && seconds > 0) {
        if (seconds > 1) {
            timeString = timeString + seconds.toString() + " secs ";
        } else {
            timeString = timeString + seconds.toString() + " sec ";
        }
        
    }
    //console.log(timeString);
    return timeString;
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
        workoutHistory.unshift(historyObject);
    } else {
        workoutHistory=[];
        workoutHistory[0] = historyObject;
    }
    localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
}