document.addEventListener('DOMContentLoaded', function () {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const themeNotification = document.getElementById('theme-notification');
    const themeMessage = document.getElementById('theme-message');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
    }

    // Theme notification function
    function showThemeNotification(theme) {
        themeMessage.textContent = theme === 'dark'
            ? 'Dark Mode Activated'
            : 'Light Mode Activated';

        // Force reflow to restart animation
        void themeNotification.offsetWidth;
        themeNotification.classList.add('show');

        setTimeout(() => {
            themeNotification.classList.remove('show');
        }, 4000);
    }

    // Theme toggle event
    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            showThemeNotification('light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            showThemeNotification('dark');
        }
    });

    // Semester data with subjects and credit hours
    // Semester data with subjects and credit hours
    const semesterData = {
        '1': [
            { name: 'Introduction to CT', credit: 3 },
            { name: 'Programming Fundamentals', credit: 4 },
            { name: 'English Composition & Comprehension', credit: 3 },
            { name: 'Calculus & Analytical Geometry', credit: 3 },
            { name: 'Applied Physics', credit: 3 },
            { name: 'Islamic Studies / Ethics', credit: 2 },
        ],
        '2': [
            { name: 'Digital Logic Design', credit: 4 },
            { name: 'Object Oriented Programming', credit: 4 },
            { name: 'Communication & Presentation Skills', credit: 3 },
            { name: 'Probability & Statistics', credit: 3 },
            { name: 'Urdu', credit: 2 },
            { name: 'Pakistan Studies', credit: 2 }
        ],
        '3': [
            { name: 'Comp Organization & Assembly Lang.', credit: 4 },
            { name: 'Data Structures & Algorithms', credit: 4 },
            { name: 'Discrete Structures', credit: 3 },
            { name: 'Technical & Business Writing', credit: 3 },
            { name: 'Differential Equations', credit: 3 }
        ],
        '4': [
            { name: 'Design & Analysis of Algorithms', credit: 3 },
            { name: 'Theory of Automata', credit: 3 },
            { name: 'Database Systems', credit: 4 },
            { name: 'Linear Algebra', credit: 3 },
            { name: 'University Elective - II', credit: 3 }
        ],
        '5': [
            { name: 'Computer Networks', credit: 4 },
            { name: 'Multi-variate Calculus', credit: 3 },
            { name: 'Operating Systems', credit: 4 },
            { name: 'Introduction to Software Engineering', credit: 3 },
            { name: 'CS Elective – 1 (e.g., Visual Programming)', credit: 3 }
        ],
        '6': [
            { name: 'Artificial Intelligence', credit: 4 },
            { name: 'Compiler Construction', credit: 3 },
            { name: 'Numerical Computing', credit: 3 },
            { name: 'CS Elective – 2', credit: 3 },
            { name: 'Professional Practices', credit: 3 }
        ],
        '7': [
            { name: 'CS Elective – 3', credit: 3 },
            { name: 'CS Elective – 4', credit: 3 },
            { name: 'Final Year Project – I', credit: 3 },
            { name: 'University Elective - III', credit: 3 },
            { name: 'Parallel & Distributed Computing', credit: 3 }
        ],
        '8': [
            { name: 'CS Elective – 5', credit: 3 },
            { name: 'University Elective IV', credit: 3 },
            { name: 'Final Year Project – II', credit: 3 },
            { name: 'Information Security', credit: 3 }
        ]
    };


    // Store semester GPAs for CGPA calculation
    const semesterGPAs = {};

    // DOM elements
    const semesterSelect = document.getElementById('semester');
    const subjectsContainer = document.getElementById('subjects-container');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const subjectResultsDiv = document.getElementById('subject-results');
    const semesterGpaSpan = document.getElementById('semester-gpa');
    const cgpaSpan = document.getElementById('cgpa');

    // Initialize with first semester
    loadSubjects(semesterSelect.value);

    // Event listeners
    semesterSelect.addEventListener('change', function () {
        loadSubjects(this.value);
    });

    calculateBtn.addEventListener('click', calculateGPA);

    // Function to load subjects based on semester selection
   function loadSubjects(semester) {
    subjectsContainer.innerHTML = '';
    const subjects = semesterData[semester];

    subjects.forEach((subject, index) => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.innerHTML = `
            <div class="subject-header">
                <h3>${subject.name}</h3>
            </div>
            <div class="subject-inputs">
                <div>
                    <label for="marks-${index}">Marks Obtained (1-100):</label>
                    <input type="number" id="marks-${index}" min="1" max="100" 
                           oninput="validateMarkInput(this)" placeholder="Enter marks">
                </div>
                <div>
                    <label>Credit Hours:</label>
                    <input type="text" value="${subject.credit}" readonly>
                </div>
            </div>
        `;
        subjectsContainer.appendChild(subjectCard);
    });
    resultsDiv.classList.add('hidden');
}

    // Function to calculate GPA
    function calculateGPA() {
        const semester = semesterSelect.value;
        const subjects = semesterData[semester];
        let totalGradePoints = 0;
        let totalCreditHours = 0;
        let allValid = true;

        // Clear previous results
        subjectResultsDiv.innerHTML = '';

        subjects.forEach((subject, index) => {
            const marksInput = document.getElementById(`marks-${index}`);
            const marks = parseFloat(marksInput.value);

            if (isNaN(marks)) {
                marksInput.style.borderColor = 'var(--error-color)';
                allValid = false;
                return;
            } else {
                marksInput.style.borderColor = '';
            }

            const grade = getGrade(marks);
            const gradePoints = getGradePoints(grade);
            const creditHours = subject.credit;

            totalGradePoints += gradePoints * creditHours;
            totalCreditHours += creditHours;

            // Add to results display
            const resultDiv = document.createElement('div');
            resultDiv.className = 'subject-result';
            resultDiv.innerHTML = `
                <span>${subject.name}</span>
                <span>Grade: ${grade} (${gradePoints.toFixed(1)})</span>
            `;
            subjectResultsDiv.appendChild(resultDiv);
        });

        if (!allValid) {
            alert('Please enter valid marks for all subjects');
            return;
        }

        const gpa = totalGradePoints / totalCreditHours;
        semesterGPAs[semester] = gpa;

        // Update display
        semesterGpaSpan.textContent = gpa.toFixed(2);

        // Calculate CGPA
        const cgpa = calculateCGPA();
        cgpaSpan.textContent = cgpa.toFixed(2);

        // Show results
        resultsDiv.classList.remove('hidden');
        showCelebration(gpa);
    }

    // Function to get grade from marks
    function getGrade(marks) {
        if (marks >= 90) return 'A+';
        if (marks >= 80) return 'A';
        if (marks >= 70) return 'B+';
        if (marks >= 60) return 'B';
        if (marks >= 55) return 'C+';
        if (marks >= 50) return 'C';
        return 'F';
    }

    // Function to get grade points from grade
    function getGradePoints(grade) {
        switch (grade) {
            case 'A+': return 4.0;
            case 'A': return 4.0;
            case 'B+': return 3.5;
            case 'B': return 3.0;
            case 'C+': return 2.5;
            case 'C': return 2.0;
            default: return 0.0;
        }

    }

    // Function to calculate CGPA from all semester GPAs
    function calculateCGPA() {
        const semesters = Object.keys(semesterGPAs);
        if (semesters.length === 0) return 0;

        let totalGPA = 0;
        semesters.forEach(sem => {
            totalGPA += semesterGPAs[sem];
        });

        return totalGPA / semesters.length;
    }
});

function validateMarkInput(input) {
    const value = parseInt(input.value);
    if (isNaN(value)) {
        input.value = '';
        return;
    }
    if (value < 1) input.value = 1;
    if (value > 100) input.value = 100;
}

const welcomeMessage = document.querySelector('.welcome-message');
const welcomeCloseBtn = document.querySelector('.welcome-close-btn');


window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        welcomeMessage.classList.add('active');
    }, 300);
});


welcomeCloseBtn.addEventListener('click', () => {
    welcomeMessage.classList.remove('active');
});


welcomeMessage.addEventListener('click', (e) => {
    if (e.target === welcomeMessage) {
        welcomeMessage.classList.remove('active');
    }
});

const text = "Calculate Grade Point Average for more than 1 semester without refreshing to get the Cumulative Grade Point Average for all semesters.";
const typingTarget = document.getElementById("typing-text");

let index = 0;

function typeText() {
    if (index < text.length) {
        typingTarget.textContent += text.charAt(index);
        index++;
        setTimeout(typeText, 40);
    } else {
        setTimeout(() => {
            typingTarget.textContent = "";
            index = 0;
            typeText();
        }, 6000);
    }
}

window.onload = typeText;


// Custom dropdown functionality
document.addEventListener('DOMContentLoaded', function () {
    const selectSelected = document.getElementById('semester-selected');
    const selectOptions = document.getElementById('semester-options');
    const hiddenSelect = document.getElementById('semester');

    // Click handler for selected element
    selectSelected.addEventListener('click', function (e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.classList.toggle('select-arrow-active');
        selectOptions.classList.toggle('select-items-active');
    });

    // Click handlers for options
    Array.from(selectOptions.children).forEach(option => {
        option.addEventListener('click', function () {
            const value = this.getAttribute('data-value');
            const text = this.textContent;

            // Update display
            selectSelected.textContent = text;
            selectSelected.classList.remove('select-arrow-active');
            selectOptions.classList.remove('select-items-active');

            // Update hidden select
            hiddenSelect.value = value;

            // Trigger change event
            const event = new Event('change');
            hiddenSelect.dispatchEvent(event);

            // Update selected class
            Array.from(selectOptions.children).forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', function () {
        selectSelected.classList.remove('select-arrow-active');
        selectOptions.classList.remove('select-items-active');
    });

    // Function to close all other selects
    function closeAllSelect(elm) {
        const allSelects = document.getElementsByClassName('select-items-active');
        const allSelected = document.getElementsByClassName('select-arrow-active');

        for (let i = 0; i < allSelects.length; i++) {
            if (elm !== allSelected[i] && allSelects[i] !== selectOptions) {
                allSelects[i].classList.remove('select-items-active');
            }
        }
        for (let i = 0; i < allSelected.length; i++) {
            if (elm !== allSelected[i]) {
                allSelected[i].classList.remove('select-arrow-active');
            }
        }
    }


    selectOptions.children[0].classList.add('selected');
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


function showCelebration(gpa) {
    const celebration = document.querySelector('.celebration-container');
    const message = document.querySelector('.celebration-text');

    if (gpa >= 4.0) {
        message.textContent = 'Thora kam parho!';
    }
    else if (gpa >= 3.5) {
        message.textContent = 'Lage raho boss!';
    } else if (gpa >= 3.0) {
        message.textContent = 'Sahi ja rhe ho!';
    } else if (gpa >= 2.5) {
        message.textContent = 'Parh le bhai!';
    } else if (gpa >= 2.0) {
        message.textContent = 'Uni b aa jaya karo!';
    } else {
        message.textContent = 'Chor do uni!';
    }

    celebration.classList.add('show');

    setTimeout(() => {
        celebration.classList.remove('show');
    }, 4000);
}
