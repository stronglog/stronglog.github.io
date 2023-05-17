
//createExerciseHistory();

function createLocalTimeString(timeStampMilli) {
    //console.log(timeStampMilli);
    let startDateTime = new Date(+timeStampMilli);
    //console.log(startDateTime);
    
    let options = {
        hour: "numeric",
        minute: "numeric",
    };
    
    let localTime = new Intl.DateTimeFormat(undefined, options).format(startDateTime);

    return localTime;
}

function createLocalDateString(timeStampMilli) {
    //console.log(timeStampMilli);
    let startDateTime = new Date(+timeStampMilli);
    //console.log(startDateTime);
    
    let options = {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    };
    
    let localDate = new Intl.DateTimeFormat(undefined, options).format(startDateTime);

    return localDate;
}

function displayExerciseHistory(selectedExercises) {
    let historyPage = document.getElementById("page_3");

    while (historyPage.firstChild) {
       historyPage.removeChild(historyPage.firstChild);
    }

    let exerciseHistory = createExerciseHistory();
    console.log(selectedExercises);
    for (let i=0; i<selectedExercises.length; i++) {
        let key = findKey(exerciseHistory, selectedExercises[i]);
        if (key !== false) {
            let newDiv = document.createElement("DIV");
            let newTitle = document.createElement("H2");
            let titleText = document.createTextNode(key);
            newTitle.appendChild(titleText);
            newDiv.appendChild(newTitle);

            let newList = document.createElement("OL"); 

            for (let j=0; j<exerciseHistory[key].length; j++) {
                
                let newItem = document.createElement("LI");
                
                console.log(exerciseHistory[key][j]);
                
                let localDateTime = createLocalDateTimeString(exerciseHistory[key][j].DateTime);
                
                if (exerciseHistory[key][j].Reps > 1) {
                    if (exerciseHistory[key][j].Weight > 0) {
                        newItem.innerText = localDateTime + " " + exerciseHistory[key][j].Reps + " reps at " + exerciseHistory[key][j].Weight + "kg ";
                    } else {
                        newItem.innerText = localDateTime + " " + exerciseHistory[key][j].Reps + " reps ";
                    }
                } else {
                    if (exerciseHistory[key][j].Weight > 0) {
                        newItem.innerText = localDateTime + " " + exerciseHistory[key][j].Reps + " rep at " + exerciseHistory[key][j].Weight + "kg ";
                    } else {
                        newItem.innerText = localDateTime + " " + exerciseHistory[key][j].Reps + " rep ";
                    }
                }
                newList.appendChild(newItem);
            }
            newDiv.appendChild(newList);
            historyPage.appendChild(newDiv);
        }
    }
}

function createExerciseHistory() {
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
                //console.log(k);
                exerciseList[exerciseName][k] = {};
                exerciseList[exerciseName][k]["DateTime"] = workoutHistory[i].workout[j].DateTime;
                exerciseList[exerciseName][k]["Reps"] = workoutHistory[i].workout[j].Reps;
                exerciseList[exerciseName][k]["Weight"] = workoutHistory[i].workout[j].Weight;
                
            }            
        }
    }
    console.log(exerciseList);

    return exerciseList;
}

function findKey(inputObject, item) {
    for (key in inputObject) {
        if (key === item) {
            console.log(key);
            return key
        }
    }
    return false;
}

function displayWorkoutHistory() {
    let workoutHistory = JSON.parse(localStorage.getItem("workoutHistory"));
    //console.log(workoutHistory);
    let historyPage = document.getElementById("page_3");

    if (workoutHistory !== null) {      
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
    } else {
        while (historyPage.firstChild) {
           historyPage.removeChild(historyPage.firstChild);
        }
        let newPara = document.createElement("P");
        let newText = document.createTextNode("Complete a workout to make history!");
        newPara.appendChild(newText);
        historyPage.appendChild(newPara);
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