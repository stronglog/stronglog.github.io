let removeExerciseButton = document.getElementById("remove_exercise");
removeExerciseButton.addEventListener("click", removeExercise);

function generateWorkoutExercises() {
    let workoutExercises = JSON.parse(localStorage.getItem("workout_exercises"));
    if (workoutExercises !== null) {
        let selection = document.getElementById("exercises");
        while (selection.firstChild) {
            selection.removeChild(selection.firstChild);
        }
        for (let i=0; i<workoutExercises.length; i++) {
            let newOption = document.createElement("OPTION");
            newOption.innerText = workoutExercises[i];
            selection.appendChild(newOption);
            
            let removeExerciseButton = document.getElementById("remove_exercise");
            removeExerciseButton.removeAttribute("disabled");
            
            let beginExercise = document.getElementById("begin_exercise");
            beginExercise.removeAttribute("disabled");
            
        }       
    }
}





function removeExercise() {
    let selection = document.getElementById("exercises");
    let collection = Array.from(selection.selectedOptions);
    console.log(collection);

    for (let item of collection) {
        console.log(item);
        selection.removeChild(item);

        let workoutExercises = JSON.parse(localStorage.getItem("workout_exercises"));
        let index = workoutExercises.indexOf(item.innerText);
        workoutExercises.splice(index, 1);
        localStorage.setItem("workout_exercises", JSON.stringify(workoutExercises));
        
        
    }
    if (selection.children.length === 0) {
        //console.log("empty");
        let newOption = document.createElement("OPTION");
        newOption.innerText = "--Add Exercises--";
        newOption.setAttribute("disabled", true);
        selection.appendChild(newOption);
        localStorage.removeItem("workout_exercises")

        let removeExerciseButton = document.getElementById("remove_exercise");
        removeExerciseButton.setAttribute("disabled", true);
            
        let beginExercise = document.getElementById("begin_exercise");
        beginExercise.setAttribute("disabled", true);
        
    }

}


let goAddExercisesButton = document.getElementById("go_add_exercises");
goAddExercisesButton.addEventListener("click", goToAddExercisesPage);


function goToAddExercisesPage() {
    goToPage(1);
}


function goToPage(pageNumber) {
    let targetTab = document.getElementById("tab_"+pageNumber);
    let allTabs = targetTab.parentElement.children;

    console.log(allTabs);
    
    Array.from(allTabs).forEach(function (currentItem, currentIndex) {
        console.log(currentItem);
        currentItem.style.background = "#aaa"
        currentItem.style.borderBottom = "none";
    });
    
    targetTab.style.background = "#eee";
    targetTab.style.borderBottom = "solid black 2px";

    //console.log(targetTab.id)
    //let tabNumber = targetTab.id.split("_")[1];

    localStorage.setItem("tabNumber", pageNumber);
    
    let targetPageId = "page_"+pageNumber;
    console.log(targetPageId);
    
    let targetPage = document.getElementById(targetPageId);
    console.log(targetPage);
    
    if (targetPage.scrollHeight > targetPage.clientHeight) {
        //console.log("overflow");
        targetPage.style.overflowY = "scroll";
    } else {
        //console.log("no overflow");
        targetPage.style.overflowY = "hidden";
    }

    targetPage.scrollIntoView();
}



function filterList() {
    let addExerciseButton = document.getElementById("add_exercise")

    let searchString = document.getElementById("search_string");
    let filter = searchString.value.toUpperCase();

    let list = document.getElementById("exercise_list");
    let listItems = list.getElementsByTagName("li");

    let notFound = true;
    
    for (let i=0; i<listItems.length; i++) {
        let itemText = listItems[i].textContent.toUpperCase();
        
        if (itemText.indexOf(filter) > -1) {
            listItems[i].style.display = "";
            notFound = false;
            if (addExerciseButton !== null) {
                addExerciseButton.style.display = "none";
            }
        } else {
            listItems[i].style.display = "none";
        }
    }
    if (notFound) {
        console.log("exercise not found");
        let page1 = document.getElementById("page_1");


        if (addExerciseButton === null) {
            let newAddExerciseButton = document.createElement("BUTTON");
            newAddExerciseButton.setAttribute("id", "add_exercise");
            
            let content = document.createTextNode("Add Exercise");
            newAddExerciseButton.appendChild(content);
            newAddExerciseButton.addEventListener("click", addExerciseToList);
            page1.appendChild(newAddExerciseButton);
        } else {
            addExerciseButton.style.display = "";
        }
    }
}

function addExerciseToList() {
    let searchString = document.getElementById("search_string");
    let exerciseName = searchString.value;
    
    let exerciseList = JSON.parse(localStorage.getItem("exercise_list"));
    exerciseList.push(exerciseName);
    exerciseList.sort();
    localStorage.setItem("exercise_list", JSON.stringify(exerciseList));

    let list = document.getElementById("exercise_list");

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    searchString.value = "";
    
    let addExerciseButton = document.getElementById("add_exercise")
    addExerciseButton.style.display = "none";

    generateExerciseList();
    
}


function addExerciseToWorkout() {
    console.log(event.target.innerText);
    let workout = document.getElementById("exercises");

    let exercisePresent = false;

    for (const child of  workout.children) {
        if (child.innerText === event.target.innerText) {
            exercisePresent = true;
        }
        if (child.innerText === "--Add Exercises--") {
            workout.removeChild(child);
            
            let beginExercise = document.getElementById("begin_exercise");
            beginExercise.removeAttribute("disabled");

            let removeExercise = document.getElementById("remove_exercise");
            removeExercise.removeAttribute("disabled");
            
        }
    }
    if (!exercisePresent) {
        let workoutExercises = JSON.parse(localStorage.getItem("workout_exercises"));
        if (workoutExercises === null) {
            workoutExercises = [];
        }
        workoutExercises.push(event.target.innerText)
        localStorage.setItem("workout_exercises", JSON.stringify(workoutExercises));

        let newOption = document.createElement("OPTION");
        newOption.innerText = event.target.innerText;
        workout.appendChild(newOption);
    }

    
}


function generateExerciseList() {
    let exerciseList = JSON.parse(localStorage.getItem("exercise_list"));
    //console.log(exerciseList);
    if (exerciseList === null) {
        exerciseList = [
            "Ab Wheel Rollout",
            "Back Extension",
            "Back Squat",
            "Backward Lunge",
            "Barbell Curl",
            "Bodyweight Row",
            "Bodyweight Squat",
            "Bulgarian Split Squat",
            "Calf Raise",
            "Chin Up",
            "Clean and Jerk",
            "Deadlift",
            "Double Dumbbell Shoulder Press",
            "Dumbbell Curl",
            "Dumbbell Lateral Raise",
            "Dumbbell Row",
            "Face Pull",
            "Farmers Walk",
            "Forward Lunge",
            "Front Squat",
            "Goblet Squat",
            "Hammer Curl",
            "Hanging Leg Raise",
            "Hip Thrust",
            "Kettlebell Swing",
            "Lat Pulldown",
            "Leg Abductor",
            "Leg Adductor",
            "Leg Extension",
            "Leg Press",
            "Overhead Press",
            "Plank",
            "Pull Up",
            "Push Up",
            "Reverse Curl",
            "Reverse Hyper",
            "Romanian Deadlift",
            "Side Plank",
            "Single Dumbbell Shoulder Press",
            "Single Leg Deadlift",
            "Sit Up",
            "Snatch",
            "Split Squat",
            "Trap Bar Deadlift",
            "Tricep Pushdown",
            "Walking Lunge"];
        localStorage.setItem("exercise_list", JSON.stringify(exerciseList));
    }
    
    let list = document.getElementById("exercise_list");

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    for (let i=0; i<exerciseList.length; i++) {
        let newItem = document.createElement("LI");
        newItem.innerHTML = exerciseList[i] + `<svg xmlns="http://www.w3.org/2000/svg" onclick="deleteExercise()" width="1em" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                                </svg>`;
        newItem.addEventListener("click", addExerciseToWorkout);
        list.appendChild(newItem);
        
    }
}

function deleteExercise() {
    event.stopPropagation();
    //console.log(event.target);
    var listItem;
    if (event.target.tagName === "path") {
        listItem = event.target.parentElement.parentElement;
    } else {
        listItem = event.target.parentElement;
    }
    console.log(listItem);

    let exerciseList = JSON.parse(localStorage.getItem("exercise_list"));
    console.log(exerciseList);
    let index = exerciseList.indexOf(listItem.innerText);
    console.log(index);
    
    exerciseList.splice(index, 1);
    localStorage.setItem("exercise_list", JSON.stringify(exerciseList));

    generateExerciseList();
    
}