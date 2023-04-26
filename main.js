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

function endWorkout(workout) {
    var workoutString = JSON.stringify(workout);
    console.log(workoutString);
    stravaUpload(workoutString);
}

function stravaUpload(workoutString) {
    var key = Date.now();
    localStorage.setItem(key, workoutString);
    console.log("redirect to strava oauth login");
    window.location.href = "https://www.strava.com/oauth/authorize?client_id=37683&response_type=code&redirect_uri=https://intervalplayer.com&approval_prompt=force&scope=activity:write&state="+key;
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