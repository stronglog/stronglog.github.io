let units = {};

let kgSelect = document.getElementById("kg");
kgSelect.addEventListener("change", changeUnits);


let lbsSelect = document.getElementById("lbs");
lbsSelect.addEventListener("change", changeUnits);

function changeUnits() {
    units.name = event.target.id ;
    if (units.name === "lbs") {
        units.factor = 2.2;
    } else {
        units.name = "kg"
        units.factor = 1;
    }
    console.log(units);
    localStorage.setItem("units", JSON.stringify(units));

    let currentExercises = JSON.parse(localStorage.getItem("currentExercises"));
    if (currentExercises !== null) {
        createExerciseScreen(currentExercises);
        displayExerciseHistory(currentExercises);
    } else {
        console.log("no workout in progress");
        displayWorkoutHistory();
    }

    console.log(workout);

    let exercisingDiv = document.getElementById("exercise_record");
    let recordDiv = createRecord(workout);
    exercisingDiv.appendChild(recordDiv);
    checkWindowHeight()


}