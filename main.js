var workout = [];
var endWorkoutButton = document.getElementById("end_workout");
endWorkoutButton.addEventListener("click", endWorkout);

//checks when page is loaded
document.addEventListener("DOMContentLoaded", function() {
    //retrieve or set default units
    units = JSON.parse(localStorage.getItem("units"));
    console.log(units);
    if (units === null) {
        units = {};
        units.name = "kg ";
        units.factor = 1;
    } else {
        let radio = document.getElementById(units.name);
        radio.setAttribute("checked", true);
    }
    
    displayWorkoutHistory();
    generateExerciseList();
    generateWorkoutExercises();
    checkWindowHeight()

    

    
    //check if we are mid-strava upload
    var urlString = window.location;
    var urlParameters = (new URL(urlString)).searchParams;
    var code = urlParameters.get('code');
    var scope = urlParameters.get('scope');
    var err = urlParameters.get('error');
    var state = urlParameters.get('state');
    
    //console.log(code);
    //console.log(scope);
    //console.log(state);
    
    if (code !== null && scope !== null) {
        getAccessToken(code, scope, state);
    } else {
        //check if we are mid-exercise
        let currentExercises = JSON.parse(localStorage.getItem("currentExercises"));
        //console.log(currentExercises);
        if (currentExercises !== null) {
            switchToExerciseScreen(currentExercises);
        }
        
        //check if we are mid-workout
        let workoutString = localStorage.getItem("workout_string");
        if (workoutString !== null) {
            workout = JSON.parse(workoutString);
            let exerciseRecord = document.getElementById("exercise_record");
            let recordDiv = createRecord(workout);
            exerciseRecord.appendChild(recordDiv);
            checkWindowHeight()
            if (workout.length > 0) {
                endWorkoutButton.removeAttribute("disabled");    
            }            
        }
        //check if a timer is running
        checkForRunningTimer();
    }
});

function createLocalTime(startTime) {
    //required format is 2013-10-20T19:20:30+01:00;
    let t = new Date(startTime);
    let z = t.getTimezoneOffset() * 60 * 1000;
    let tLocal = t-z
    tLocal = new Date(tLocal);
    let iso = tLocal.toISOString();
    iso = iso.split(".")[0]
 
    console.log(t.getTimezoneOffset()/60);

    let timeDifference = toHoursMinutes(t.getTimezoneOffset());
    console.log(timeDifference)
    console.log(iso);
    return iso+timeDifference;
}

function toHoursMinutes(totalMinutes) {
    absMinutes = Math.abs(totalMinutes);
    let minutes = absMinutes % 60;
    let hours = Math.floor(absMinutes / 60);
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2,"0");
    
    let timeString = hours+":"+minutes
    //if negative offset prepend a +, if positive offset prepend a -
    if (totalMinutes>0) {
        timeString = "-"+timeString
    } else {
        timeString = "+"+timeString;
    }
    console.log(timeString);
    return timeString;
}



var selectExerciseDiv = document.getElementById("select_exercise");



let beginExercise = document.getElementById("begin_exercise");
beginExercise.addEventListener("click", startExercise);

let slider = document.getElementById("slider");
let main = document.getElementById("main");
let footer = document.getElementById("footer");

let stravaUploadDiv = document.getElementById("upload_screen");
stravaUploadDiv.style.display = 'none';

function startExercise() {
    if (localStorage.getItem("start_time") === null || workout.length === 0 ) {
        let startTime = Date.now();
        localStorage.setItem("start_time", startTime);
    }
    
    let selection = document.getElementById("exercises");
    let collection = selection.selectedOptions;
    let selectedExercises = [];
    if (collection.length > 0) {
        for (let i=0; i<collection.length; i++) {
            console.log(collection[i].innerText);
            selectedExercises.push(collection[i].innerText);
        }
        console.log(selectedExercises);

        localStorage.setItem("currentExercises", JSON.stringify(selectedExercises));

        switchToExerciseScreen(selectedExercises)

        if (workout.length > 0) {
            let exercisingDiv = document.getElementById("exercise_record");
            let recordDiv = createRecord(workout);
            exercisingDiv.appendChild(recordDiv);
            checkWindowHeight()
        }

    } else {
        alert("Please select at least one exercise");
    }
}

function switchToExerciseScreen(selectedExercises) {
    selectExerciseDiv.style.display = 'none';
    let workoutButtons = document.getElementById("workout_buttons");
    workoutButtons.style.display = 'none';
    createExerciseScreen(selectedExercises);
    displayExerciseHistory(selectedExercises);
}

function endWorkout() {
    console.log(workout);
    var workoutString = JSON.stringify(workout);
    console.log(workoutString);

    let endTime = Date.now();
    let startTime = localStorage.getItem("start_time");
    localStorage.removeItem("start_time");
    localStorage.removeItem("workout_string");

    let durationSeconds = (endTime - startTime) / 1000;
    console.log(durationSeconds);

    localSaveWorkoutHistory(workout, startTime, durationSeconds);
    
    workout = [];
    
    createRecord(workout);
    endWorkoutButton.setAttribute("disabled", true);
    displayWorkoutHistory()

    if (window.confirm("Upload this workout to Strava?")) {
        stravaUpload(workoutString, startTime, durationSeconds);
    }
}


function createDescription(workoutString) {
    var workout = JSON.parse(workoutString);
    console.log(workout);
    let cumulativeWeight = 0;
    var description = "";
    var exercise = "";
    var exerciseList = {};
    for (let i=0; i<workout.length; i++) {
        exercise = workout[i].Exercise;
        if (exercise in exerciseList) {
            //add set
            var j = exerciseList[exercise].length;
            exerciseList[exercise][j] = {
                    Reps: workout[i].Reps,
                    Weight: workout[i].Weight
                };

            
        } else {
            //add exercise            
            console.log(exercise);
            exerciseList[exercise] = [];

            //add set
            var j = exerciseList[exercise].length;
            exerciseList[exercise][j] = {
                    Reps: workout[i].Reps,
                    Weight: workout[i].Weight
                };
        }
        console.log(exerciseList);
    }
    let keys = Object.keys(exerciseList);

    for (let i=0; i<keys.length; i++) {
        description = description+keys[i]+"\n";

        for  (j=0; j<exerciseList[keys[i]].length; j++) {
            let currentExercise = exerciseList[keys[i]];
            if (currentExercise[j].Reps > 1) {
                if (currentExercise[j].Weight) {
                    description = description + " Set " + (j+1) + ": " + currentExercise[j].Reps + " Reps at "+ currentExercise[j].Weight + "kg"+"\n";                                    
                    cumulativeWeight = cumulativeWeight + (currentExercise[j].Reps * currentExercise[j].Weight);
                } else {
                    description = description + " Set " + (j+1) + ": " + currentExercise[j].Reps + " Reps" + "\n";                                    
                }

            } else {
                if (currentExercise[j].Weight) {
                    description = description + " Set " + (j+1) + ": " + currentExercise[j].Reps + " Rep at "+ currentExercise[j].Weight + "kg"+"\n";                                    
                    cumulativeWeight = cumulativeWeight + (currentExercise[j].Reps * currentExercise[j].Weight);
                } else {
                    description = description + " Set " + (j+1) + ": " + currentExercise[j].Reps + " Rep" + "\n";                                    
                }
            }
        }
    }
    if (cumulativeWeight > 0) {
        description = "\nTotal weight lifted: " + cumulativeWeight + "kg \n" + description;
    }
    description = "Free online workout log: https://stronglog.github.io/ \n" + description;
    console.log(description);
    return description;
}

function stravaUpload(workoutString, startTime, durationSeconds) {
    var key = Date.now();

    localStorage.setItem(key, workoutString);
    localStorage.setItem(key+"_startTime", startTime)
    localStorage.setItem(key+"_duration", durationSeconds);

    console.log("redirect to strava oauth login");
    window.location.href = "https://www.strava.com/oauth/authorize?client_id=37683&response_type=code&redirect_uri=https://stronglog.github.io/&approval_prompt=force&scope=activity:write&state="+key;
}


function getAccessToken(code, scope, key) {
    console.log(code);
    console.log(scope);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.strava.com/oauth/token?", true);
    var data = {
        "client_id":"37683",
        "client_secret":"68670894f9fb4523eca81114bf9b2e3b303da3c0",
        "code":code,
        "grant_type":"authorization_code"
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', function(event) {
        console.log(xhr.responseText);
        editTitleDescription(xhr.responseText, key);
    });
    xhr.send(JSON.stringify(data));
}

function createLocalDateTimeString(timeStampMilli) {
    //console.log(timeStampMilli);
    let startDateTime = new Date(+timeStampMilli);
    //console.log(startDateTime);
    
    let options = {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };
    
    let localDateTime = new Intl.DateTimeFormat(undefined, options).format(startDateTime);

    return localDateTime;
}


function editTitleDescription(responseJSON, key) {
    stravaUploadDiv.style.display = 'inline-block';
        
    slider.style.display = 'none';
    main.style.display = 'none';
    footer.style.display = 'none';
    
    let workoutTitle = document.getElementById("workout_title");
    let workoutDescription = document.getElementById("workout_description");

  
    var workoutString = localStorage.getItem(key);
    var description = createDescription(workoutString);

    
    let startTime = parseInt(localStorage.getItem(key+"_startTime"));
    console.log(startTime);
    let localDateTime = createLocalDateTimeString(startTime);

    workoutTitle.value = "Workout (" + localDateTime + ")";
    workoutDescription.value = description;

    let uploadObject = {};
    uploadObject.responseJSON = responseJSON;
    uploadObject.key = key;
    
    let upload = document.getElementById("upload");
    upload.addEventListener("click", event => {
        uploadObject.title = workoutTitle.value;
        uploadObject.description = workoutDescription.value;
        uploadFile(uploadObject);
    });

    let cancel = document.getElementById("cancel");
    cancel.addEventListener("click", event => {
        let uploadObject = null;
        uploadFile(uploadObject);
    });
}

function uploadFile(uploadObject) {
    if (uploadObject !== null) {
        var responseJSON = uploadObject.responseJSON;
        var key = uploadObject.key;

        var description = uploadObject.description;
        var title = uploadObject.title;

        let startTime = parseInt(localStorage.getItem(key+"_startTime"));
        
        let dateTimeString = createLocalTime(startTime);

        let durationSeconds = parseInt(localStorage.getItem(key+"_duration"));
        console.log(durationSeconds);
        
        console.log(responseJSON);
        var responseObj = JSON.parse(responseJSON);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://www.strava.com/api/v3/activities", true);
        xhr.setRequestHeader("Authorization", "Bearer "+responseObj.access_token);
        var data = new FormData();
        data.append("sport_type", "WeightTraining");
        data.append("name", title);
        data.append("description", description);
        data.append("start_date_local", dateTimeString);
        //elapsed time in seconds
        data.append("elapsed_time", durationSeconds);
        data.append("trainer", "0");
        data.append("commute", "0");
        xhr.addEventListener('load', function(event) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            if(xhr.status === 201) {
                alert("Strava Upload Successful");
                localStorage.removeItem(key)
                localStorage.removeItem(key+"_startTime")
                localStorage.removeItem(key+"_duration")
                window.location.replace("https://stronglog.github.io");
            }
        });
        xhr.send(data);
    } else {
        alert("Strava upload cancelled");
        localStorage.removeItem(key)
        localStorage.removeItem(key+"_startTime")
        localStorage.removeItem(key+"_duration")
        window.location.replace("https://stronglog.github.io");
    }
}


function createRecord(workout) {
    let recordDiv = document.getElementById("current_record");

    if (recordDiv === null) {
        recordDiv = document.createElement("DIV");
        recordDiv.setAttribute("id", "current_record")
    }

    while (recordDiv.firstChild) {
        recordDiv.removeChild(recordDiv.firstChild);
    }

    if (workout.length > 0) {
        //check for currently selected units before creating display
        //...to do

        console.log(workout);
        
        newHeading = document.createElement("H3");
        content = document.createTextNode("Sets Completed");
        newHeading.appendChild(content);
        recordDiv.appendChild(newHeading);

        newList = document.createElement("OL");    
        
        for (let i=0; i<workout.length; i++) {
            newItem = document.createElement("LI");

            const array = new Uint16Array(1);
            self.crypto.getRandomValues(array);
            //console.log(array);

            
            newItem.setAttribute("id", "set" + array[0]);
            if (workout[i].Reps > 1) {
                if (workout[i].Weight > 0) {
                    newItem.innerText = workout[i].Exercise + " " + workout[i].Reps + " reps at " + Math.round((workout[i].Weight*units.factor)*100)/100 + units.name;
                } else {
                    newItem.innerText = workout[i].Exercise + " " + workout[i].Reps + " reps ";
                }
            } else {
                if (workout[i].Weight > 0) {
                    newItem.innerText = workout[i].Exercise + " " + workout[i].Reps + " rep at " + Math.round((workout[i].Weight*units.factor)*100)/100 + units.name;
                } else {
                    newItem.innerText = workout[i].Exercise + " " + workout[i].Reps + " rep ";
                }
            }
            newItem.innerHTML = newItem.innerHTML + ` <svg xmlns="http://www.w3.org/2000/svg" onclick="editSet()" width="1em" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                </svg>` + ` <svg xmlns="http://www.w3.org/2000/svg" onclick="deleteSet()" width="1em" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                                </svg>`
            newList.appendChild(newItem);
            //console.log(newList);
        }
        recordDiv.appendChild(newList);
    }
    
    return recordDiv;
}

function acceptEdit() {
    console.log("accept edit");

    if (event.target.tagName === "path") {
        listItem = event.target.parentElement.parentElement;
    } else {
        listItem = event.target.parentElement;
    }
    console.log(listItem);

    let list = listItem.parentElement;

    let index = getIndexOfListItemFromId(list, listItem.id);

    let newName = listItem.querySelector("#edit_name").value;
    let newReps = listItem.querySelector("#edit_reps").value;
    let newWeight = listItem.querySelector("#edit_weight").value;

    console.log(newWeight);

    workout[index].Exercise = newName;
    workout[index].Reps = newReps;
    workout[index].Weight = Math.round((newWeight / units.factor)*100)/100;

    console.log(workout[index].Weight);
    
    createRecord(workout);
    checkWindowHeight()
}

function getIndexOfListItemFromId(list, itemId) {
    let listNodes = list.childNodes;

    console.log(list);
    console.log(itemId);
    console.log(listNodes);

    let index = null;
    
    listNodes.forEach(function (currentItem, currentIndex) {
        if (currentItem.id === itemId) {
            console.log("its a match at index "+currentIndex);
            index = currentIndex;
        }    
    });
    
    return index;
}

function discardEdit() {
    console.log("discard edit");
    createRecord(workout);
}

function editSet() {
    console.log("edit set");
    console.log(event.target.tagName);
    var listItem;
    if (event.target.tagName === "path") {
        listItem = event.target.parentElement.parentElement;
    } else {
        listItem = event.target.parentElement;
    }
    console.log(listItem);
    
    let initialText = listItem.innerText;
    console.log(initialText);
    console.log(initialText.length);

    let index = getIndexOfListItemFromId(listItem.parentElement, listItem.id)
    console.log(index);
    
    let name = workout[index].Exercise;
    let reps = workout[index].Reps;
    let weight = workout[index].Weight;
    
    listItem.innerHTML = '<input type="text" id="edit_name" value="' + name + '" size="' + name.length + '">' +
        '<input type="number" id="edit_reps" value="' + reps + '" class="fourWide">' + "Reps at " +
        '<input type="number" id="edit_weight" value="' + weight*units.factor + '" class="fourWide">' + units.name +
        
        ` <svg xmlns="http://www.w3.org/2000/svg" onclick="acceptEdit()" width="1em" viewBox="0 0 16 16">
        	<path d="M2 10 L6 14 L14 3" stroke="currentColor" stroke-width="4" fill="none"/> 
        </svg>`
        + ` <svg xmlns="http://www.w3.org/2000/svg" onclick="discardEdit()" width="1em" viewBox="0 0 16 16">
        	<path d="M4 4 L14 14" stroke="currentColor" stroke-width="4" fill="none"/>
            <path d="M4 14 L14 4" stroke="currentColor" stroke-width="4" fill="none"/> 
        </svg>`
}

function deleteSet() {
    console.log("delete set");
    console.log(event.target.tagName);
    var listItem;
    if (event.target.tagName === "path") {
        listItem = event.target.parentElement.parentElement;
    } else {
        listItem = event.target.parentElement;
    }
    
    let index = getIndexOfListItemFromId(listItem.parentElement, listItem.id)
    console.log(index);
    
    let set = Number.parseInt(index)+1;
    if (window.confirm("Do you really want to delete set "+ set + "?")) {
        workout.splice(index, 1);
        createRecord(workout);
        checkWindowHeight()
    }
    
    localStorage.setItem("workout_string", JSON.stringify(workout));
    
    if (workout.length < 1) {
        endWorkoutButton.setAttribute("disabled", true);
    }
}

function saveSet() {
    let exercisingDiv = document.getElementById("exercise_details");
    let exercise = event.target.parentNode.className;
    let reps = event.target.parentNode.querySelector("#reps").value;
    let weight = event.target.parentNode.querySelector("#weight").value;

    weight = Math.round((weight / units.factor)*100)/100
    console.log(exercise);
    console.log(reps);
    console.log(weight);
    if (reps < 1) {
        alert("Please enter at least one rep");
    } else {
        workout.push({
            Exercise: exercise,
            Reps: reps,
            Weight: weight,
            DateTime: Date.now()
        });
        console.log(workout);
        localStorage.setItem("workout_string", JSON.stringify(workout));
        let recordDiv = createRecord(workout);
        exercisingDiv.appendChild(recordDiv);
        checkWindowHeight()
    }
}

function completedExercises(event) {
    localStorage.removeItem("currentExercises");
    displayWorkoutHistory();
    
    let parentDiv = event.target.parentNode;
    selectExerciseDiv.style.display = 'inline-block';
    
    let workoutButtons = document.getElementById("workout_buttons");
    workoutButtons.style.display = 'inline-block';

    if (workout.length > 0) {
        console.log(workout.length);
        endWorkoutButton.removeAttribute("disabled");
        let recordDiv = createRecord(workout);
        let exerciseRecord = document.getElementById("exercise_record");
        exerciseRecord.appendChild(recordDiv);
        checkWindowHeight()
        
    }

    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
}

function createExerciseScreen(selectedExercises) {
    let exercisingDiv = document.getElementById("exercise_details");

    while (exercisingDiv.firstChild) {
        exercisingDiv.removeChild(exercisingDiv.firstChild);
    }
    
    let newHeading = "";
    let newRepsLabel = "";
    let newWeightLabel = "";
    let content = "";
    for (let i=0; i<selectedExercises.length; i++) {
        newDiv = document.createElement("DIV");
        newDiv.setAttribute("class", selectedExercises[i]);
        
        newHeading = document.createElement("H2");
        content = document.createTextNode(selectedExercises[i]);
        newHeading.appendChild(content);
        newDiv.appendChild(newHeading);

        newRepsLabel = document.createElement("LABEL");
        content = document.createTextNode("Reps:");
        newRepsLabel.appendChild(content);
        newDiv.appendChild(newRepsLabel);

        newRepsInput = document.createElement("INPUT");
        newRepsInput.setAttribute("id", "reps");
        newRepsInput.setAttribute("type", "number");
        newRepsInput.setAttribute("class", "fourWide");
        newRepsInput.setAttribute("min", "0");
        newDiv.appendChild(newRepsInput);

        newWeightLabel = document.createElement("LABEL");
        content = document.createTextNode("Weight:");
        newWeightLabel.appendChild(content);
        newDiv.appendChild(newWeightLabel);

        newWeightInput = document.createElement("INPUT");
        newWeightInput.setAttribute("id", "weight");
        newWeightInput.setAttribute("type", "number");
        newWeightInput.setAttribute("class", "fourWide");
        newDiv.appendChild(newWeightInput);

        let newText = document.createTextNode(units.name + " ");
        newDiv.appendChild(newText);

        newSaveSetButton = document.createElement("BUTTON");
        newSaveSetButton.setAttribute("id", "save_set");
        content = document.createTextNode("Save Set");
        newSaveSetButton.appendChild(content);
        newSaveSetButton.addEventListener("click", saveSet);
        newDiv.appendChild(newSaveSetButton);

        exercisingDiv.appendChild(newDiv);

    }

    if (selectedExercises.length > 1) {
        newParagraph = document.createElement("P");
        content = document.createTextNode("When you have finished with these exercises press \"Completed\"");
        newParagraph.appendChild(content);
        exercisingDiv.appendChild(newParagraph);
    } else {
        newParagraph = document.createElement("P");
        content = document.createTextNode("When you have finished with this exercise press \"Completed\"");
        newParagraph.appendChild(content);
        exercisingDiv.appendChild(newParagraph);
    }

    newCompletedButton = document.createElement("BUTTON");
    newCompletedButton.setAttribute("id", "completed");
    content = document.createTextNode("Completed");
    newCompletedButton.appendChild(content);
    newCompletedButton.addEventListener("click", completedExercises);
    exercisingDiv.appendChild(newCompletedButton);

}
