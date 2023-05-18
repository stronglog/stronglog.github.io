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





function generateExerciseList() {
    let exerciseList = JSON.parse(localStorage.getItem("exercise_list"));
    console.log(exerciseList);
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
        list.appendChild(newItem);
    }
}
