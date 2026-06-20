const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const searchInput = document.getElementById("search");
const filterCourse = document.getElementById("filterCourse");

let students =
JSON.parse(localStorage.getItem("students")) || [];

displayStudents();

form.addEventListener("submit", function(e){

    e.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        roll: document.getElementById("roll").value,
        course: document.getElementById("course").value
    };

    students.push(student);

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    form.reset();
    displayStudents();
});

function displayStudents(){

    table.innerHTML = "";

    let filteredStudents = students.filter(student => {

        let searchMatch =
        student.name.toLowerCase()
        .includes(searchInput.value.toLowerCase());

        let courseMatch =
        filterCourse.value === "all" ||
        student.course === filterCourse.value;

        return searchMatch && courseMatch;
    });

    document.getElementById("studentCount").textContent =
    filteredStudents.length;

    filteredStudents.forEach((student,index)=>{

        table.innerHTML += `
        <tr>
            <td>${student.name}</td>
            <td>${student.roll}</td>
            <td>${student.course}</td>
            <td>
                <button
                class="edit-btn"
                onclick="editStudent(${index})">
                Edit
                </button>

                <button
                class="delete-btn"
                onclick="deleteStudent(${index})">
                Delete
                </button>
            </td>
        </tr>
        `;
    });
}

function deleteStudent(index){

    students.splice(index,1);

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    displayStudents();
}

function editStudent(index){

    let newName =
    prompt("Edit Name", students[index].name);

    let newRoll =
    prompt("Edit Roll Number", students[index].roll);

    let newCourse =
    prompt("Edit Course", students[index].course);

    if(newName && newRoll && newCourse){

        students[index].name = newName;
        students[index].roll = newRoll;
        students[index].course = newCourse;

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

        displayStudents();
    }
}

searchInput.addEventListener(
    "keyup",
    displayStudents
);

filterCourse.addEventListener(
    "change",
    displayStudents
);

function exportCSV(){

    let csv = "Name,Roll Number,Course\n";

    students.forEach(student => {

        csv += `${student.name},${student.roll},${student.course}\n`;

    });

    let blob = new Blob(
        [csv],
        {type:"text/csv"}
    );

    let link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "students.csv";

    link.click();
}