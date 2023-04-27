//check if we are mid-strava upload each time the page is loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded");
    var urlString = window.location;
    var urlParameters = (new URL(urlString)).searchParams;
    var code = urlParameters.get('code');
    var scope = urlParameters.get('scope');
    var err = urlParameters.get('error');
    var state = urlParameters.get('state');
    
    console.log(code);
    console.log(scope);
    console.log(state);
    
    if (code != null && scope != null) {
        getAccessToken(code, scope, state);
    }
});



var workout = [];
var selectExerciseDiv = document.getElementById("select_exercise");

var endWorkoutButton = document.getElementById("end_workout");
endWorkoutButton.addEventListener("click", endWorkout);

let beginExercise = document.getElementById("begin_exercise");
beginExercise.addEventListener("click", startExercise);

function startExercise() {
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

    } else {
        alert("Please select at least one exercise");
    }
}

function endWorkout() {
    console.log(workout);
    var workoutString = JSON.stringify(workout);
    console.log(workoutString);
    stravaUpload(workoutString);
}

function createDescription(workoutString) {
    var workout = JSON.parse(workoutString);
    console.log(workout);
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
                } else {
                    description = description + " Set " + (j+1) + ": " + currentExercise[j].Reps + " Reps" + "\n";                                    
                }

            } else {
                if (currentExercise[j].Weight) {
                    description = description + " Set " + (j+1) + ": " + currentExercise[j].Reps + " Rep at "+ currentExercise[j].Weight + "kg"+"\n";                                    
                } else {
                    description = description + " Set " + (j+1) + ": " + currentExercise[j].Reps + " Rep" + "\n";                                    
                }
            }
        }
    }
    console.log(description);
    return description;
}

function stravaUpload(workoutString) {
    var key = Date.now();
    localStorage.setItem(key, workoutString);
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
        uploadFile(xhr.responseText, key);
    });
    xhr.send(JSON.stringify(data));
}

function uploadFile(responseJSON, key) {
    var workoutString = localStorage.getItem(key);
    var description = createDescription(workoutString);
    
    console.log(responseJSON);
    var responseObj = JSON.parse(responseJSON);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.strava.com/api/v3/activities", true);
    xhr.setRequestHeader("Authorization", "Bearer "+responseObj.access_token);
    var data = new FormData();
    data.append("sport_type", "WeightTraining");
    data.append("name", "Strong Log Workout");
    data.append("description", description);
    data.append("start_date_local", Date.now().toISOString());
    data.append("elapsed_time", 3600);
    data.append("trainer", "0");
    data.append("commute", "0");
    xhr.addEventListener('load', function(event) {
        console.log(xhr.responseText);
    });
    xhr.send(data);
}


function displayRecord() {
    let recordDiv = document.getElementById("current_record");
    while (recordDiv.firstChild) {
        recordDiv.removeChild(recordDiv.firstChild);
    }

    newHeading = document.createElement("H2");
    content = document.createTextNode("Completed Today");
    newHeading.appendChild(content);
    recordDiv.appendChild(newHeading);

    newList = document.createElement("UL");
    
    
    for (i=0; i<workout.length; i++) {
        newItem = document.createElement("LI");
        if (workout[i].Reps > 1) {
            if (workout[i].Weight) {
                content = document.createTextNode(workout[i].Exercise + " " + workout[i].Reps + " reps at " + workout[i].Weight + "kg");
            } else {
                content = document.createTextNode(workout[i].Exercise + " " + workout[i].Reps + " reps");
            }
        } else {
            if (workout[i].Weight) {
                content = document.createTextNode(workout[i].Exercise + " " + workout[i].Reps + " rep at " + workout[i].Weight + "kg");
            } else {
                content = document.createTextNode(workout[i].Exercise + " " + workout[i].Reps + " rep");
            }
        }
        

        
        newItem.appendChild(content);
        newList.appendChild(newItem);
    }
    recordDiv.appendChild(newList);
}

function saveSet(event) {
    let exercise = event.target.parentNode.className;
    let reps = event.target.parentNode.querySelector("#reps").value;
    let weight = event.target.parentNode.querySelector("#weight").value;
    console.log(exercise);
    console.log(reps);
    console.log(weight);
    if (reps === 0) {
        alert("Please enter at least one rep");
    } else {
        workout.push({Exercise: exercise,
                      Reps: reps,
                      Weight: weight});
        console.log(workout);
        displayRecord();
    }
}

function completedExercises(event) {
    let parentDiv = event.target.parentNode;
    selectExerciseDiv.style.display = 'inline-block';
    endWorkoutButton.style.display = 'inline-block';
    if (workout.length > 0) {
        console.log(workout.length);
        endWorkoutButton.removeAttribute("disabled");
    }

    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
}

function createExerciseScreen(selectedExercises) {
    let exercisingDiv = document.getElementById("exercising");
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
        newRepsInput.setAttribute("min", "0");
        newDiv.appendChild(newRepsInput);

        newWeightLabel = document.createElement("LABEL");
        content = document.createTextNode("Weight:");
        newWeightLabel.appendChild(content);
        newDiv.appendChild(newWeightLabel);

        newWeightInput = document.createElement("INPUT");
        newWeightInput.setAttribute("id", "weight");
        newWeightInput.setAttribute("type", "number");
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
