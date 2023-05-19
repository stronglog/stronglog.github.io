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
goAddExercisesButton.addEventListener("click", goToPage1);

function goToPage1() {
    let targetTab = document.getElementById("tab_1");
    let allTabs = targetTab.parentElement.children;

    console.log(allTabs);
    
    Array.from(allTabs).forEach(function (currentItem, currentIndex) {
        console.log(currentItem);
        currentItem.style.background = "#aaa"
        currentItem.style.borderBottom = "none";
    });
    
    targetTab.style.background = "#eee";
    targetTab.style.borderBottom = "solid black 2px";

    console.log(targetTab.id)
    let tabNumber = targetTab.id.split("_")[1];

    localStorage.setItem("tabNumber", tabNumber);
    
    let targetPageId = "page_"+tabNumber;
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
    exerciseList.unshift(exerciseName);
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
            console.log("remove");
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

    for (let i=0; i<exerciseList.length; i++) {
        let newItem = document.createElement("LI");
        newItem.innerText = exerciseList[i];
        newItem.addEventListener("click", addExerciseToWorkout);
        list.appendChild(newItem);
        
    }
}
