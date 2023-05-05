var workout = [];
var endWorkoutButton = document.getElementById("end_workout");
endWorkoutButton.addEventListener("click", endWorkout);

//checks when page is loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded");
    //check if we are mid-strava upload
    var urlString = window.location;
    var urlParameters = (new URL(urlString)).searchParams;
    var code = urlParameters.get('code');
    var scope = urlParameters.get('scope');
    var err = urlParameters.get('error');
    var state = urlParameters.get('state');
    
    console.log(code);
    console.log(scope);
    console.log(state);
    
    if (code !== null && scope !== null) {
        getAccessToken(code, scope, state);
    } else {
        //check if we are mid-workout
        let workoutString = localStorage.getItem("workout_string");
        if (workoutString !== null) {
            workout = JSON.parse(workoutString);
            let exercisingDiv = document.getElementById("exercise_details");
            let recordDiv = createRecord(workout);
            exercisingDiv.appendChild(recordDiv);
            if (workout.length > 0) {
                endWorkoutButton.removeAttribute("disabled");    
            }            
        }
    }
});

function createLocalTime() {
    //required format is 2013-10-20T19:20:30+01:00;
    let t = new Date();
    let z = t.getTimezoneOffset() * 60 * 1000;
    let tLocal = t-z
    tLocal = new Date(tLocal);
    let iso = tLocal.toISOString();
    iso = iso.split(".")[0]
 
    console.log(t.getTimezoneOffset()/60);

    let timeDifference = toHoursMinutes(t.getTimezoneOffset());
    
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
}



var selectExerciseDiv = document.getElementById("select_exercise");



let beginExercise = document.getElementById("begin_exercise");
beginExercise.addEventListener("click", startExercise);

let stravaUploadDiv = document.getElementById("upload_screen");
stravaUploadDiv.style.display = 'none';

function startExercise() {
    if (localStorage.getItem("start_time") === null) {
        let startTime = Date.now();
        localStorage.setItem("start_time", startTime);
    }

    
    let selection = document.getElementById("exercises");
    let collection = selection.selectedOptions;
    let selectedExercises = [];
    if (collection.length > 0) {
        for (i=0; i<collection.length; i++) {
            console.log(collection[i].innerText);
            selectedExercises.push(collection[i].innerText);
        }
        console.log(selectedExercises);
        selectExerciseDiv.style.display = 'none';
        endWorkoutButton.style.display = 'none';
        createExerciseScreen(selectedExercises);

        if (workout.length > 0) {
            let exercisingDiv = document.getElementById("exercise_details");
            let recordDiv = createRecord(workout);
            exercisingDiv.appendChild(recordDiv);
        }

    } else {
        alert("Please select at least one exercise");
    }
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
    
    stravaUpload(workoutString, durationSeconds);
}




function createDescription(workoutString) {
    var workout = JSON.parse(workoutString);
    console.log(workout);
    let cumulativeWeight = 0;
    var description = "";
    var exercise = "";
    var exerciseList = {};
    for (i=0; i<workout.length; i++) {
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

    for (i=0; i<keys.length; i++) {
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
        description = "Total weight lifted: " + cumulativeWeight + "kg \n" + description;
    }
    description = description + "\nFree online workout log: https://stronglog.github.io/"
    console.log(description);
    return description;
}

function stravaUpload(workoutString, duration) {
    var key = Date.now();
    localStorage.setItem(key, workoutString);
    localStorage.setItem(key+"_duration", duration);
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

function editTitleDescription(responseJSON, key) {
    stravaUploadDiv.style.display = 'inline-block';
    selectExerciseDiv.style.display = 'none';
    endWorkoutButton.style.display = 'none';
    
    let workoutTitle = document.getElementById("workout_title");
    let workoutDescription = document.getElementById("workout_description");
    let currentDateTime = new Date();

    var workoutString = localStorage.getItem(key);
    var description = createDescription(workoutString);

    let options = {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };
    
    let localDateTime = new Intl.DateTimeFormat(undefined, options).format(currentDateTime);
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
        
        let dateTimeString = createLocalTime();

        let durationSeconds = localStorage.getItem(key+"_duration");
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
                window.location.replace("https://stronglog.github.io");
            }
        });
        xhr.send(data);
    } else {
        alert("Strava upload cancelled");
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
        newHeading = document.createElement("H2");
        content = document.createTextNode("Sets Completed");
        newHeading.appendChild(content);
        recordDiv.appendChild(newHeading);

        newList = document.createElement("OL");    
        
        for (i=0; i<workout.length; i++) {
            newItem = document.createElement("LI");

            const array = new Uint16Array(1);
            self.crypto.getRandomValues(array);
            console.log(array);
            
            newItem.setAttribute("id", "set" + array[0]);
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
            newItem.innerHTML = newItem.innerHTML + `<svg xmlns="http://www.w3.org/2000/svg" onclick="editSet()" width="1em" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                </svg>` + `<svg xmlns="http://www.w3.org/2000/svg" onclick="deleteSet()" width="1em" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                                </svg>`
            newList.appendChild(newItem);
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

    workout[index].Exercise = newName;
    workout[index].Reps = newReps;
    workout[index].Weight = newWeight;

    createRecord(workout);
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
        '<input type="number" id="edit_weight" value="' + weight + '" class="fourWide">' + "kg " +
        
        `<svg xmlns="http://www.w3.org/2000/svg" onclick="acceptEdit()" width="1em" viewBox="0 0 16 16">
        	<path d="M2 10 L6 14 L14 3" stroke="black" stroke-width="4" fill="none"/> 
        </svg>`
        + `<svg xmlns="http://www.w3.org/2000/svg" onclick="discardEdit()" width="1em" viewBox="0 0 16 16">
        	<path d="M4 4 L14 14" stroke="black" stroke-width="4" fill="none"/>
            <path d="M4 14 L14 4" stroke="black" stroke-width="4" fill="none"/> 
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
    console.log(exercise);
    console.log(reps);
    console.log(weight);
    if (reps < 1) {
        alert("Please enter at least one rep");
    } else {
        workout.push({Exercise: exercise,
                      Reps: reps,
                      Weight: weight});
        console.log(workout);
        localStorage.setItem("workout_string", JSON.stringify(workout));
        let recordDiv = createRecord(workout);
        exercisingDiv.appendChild(recordDiv);
    }
}

function completedExercises(event) {
    let parentDiv = event.target.parentNode;
    selectExerciseDiv.style.display = 'inline-block';
    endWorkoutButton.style.display = 'inline-block';
    if (workout.length > 0) {
        console.log(workout.length);
        endWorkoutButton.removeAttribute("disabled");
        let recordDiv = createRecord(workout);
        selectExerciseDiv.appendChild(recordDiv);
        
    }

    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
}

function createExerciseScreen(selectedExercises) {
    let exercisingDiv = document.getElementById("exercise_details");
    let newHeading = "";
    let newRepsLabel = "";
    let newWeightLabel = "";
    let content = "";
    for (i=0; i<selectedExercises.length; i++) {
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
