document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Semester data with subjects and credit hours
    const semesterData = {
        '1': [
            { name: 'Mathematics I', credit: 4 },
            { name: 'Physics', credit: 3 },
            { name: 'Programming Fundamentals', credit: 4 },
            { name: 'English Composition', credit: 3 },
            { name: 'Introduction to Computing', credit: 3 }
        ],
        '2': [
            { name: 'Mathematics II', credit: 4 },
            { name: 'Digital Logic Design', credit: 3 },
            { name: 'Object-Oriented Programming', credit: 4 },
            { name: 'Communication Skills', credit: 3 },
            { name: 'Islamic Studies', credit: 2 }
        ],
        '3': [
            { name: 'Data Structures', credit: 4 },
            { name: 'Computer Organization', credit: 3 },
            { name: 'Discrete Mathematics', credit: 3 },
            { name: 'Probability & Statistics', credit: 3 },
            { name: 'Pakistan Studies', credit: 2 }
        ],
        '4': [
            { name: 'Algorithms', credit: 4 },
            { name: 'Operating Systems', credit: 3 },
            { name: 'Database Systems', credit: 4 },
            { name: 'Computer Networks', credit: 3 },
            { name: 'Technical Writing', credit: 3 }
        ],
        '5': [
            { name: 'Software Engineering', credit: 3 },
            { name: 'Theory of Automata', credit: 3 },
            { name: 'Web Technologies', credit: 3 },
            { name: 'Artificial Intelligence', credit: 3 },
            { name: 'Numerical Computing', credit: 3 }
        ],
        '6': [
            { name: 'Computer Graphics', credit: 3 },
            { name: 'Data Mining', credit: 3 },
            { name: 'Compiler Construction', credit: 3 },
            { name: 'Professional Practices', credit: 3 },
            { name: 'Elective I', credit: 3 }
        ],
        '7': [
            { name: 'Information Security', credit: 3 },
            { name: 'Machine Learning', credit: 3 },
            { name: 'Distributed Systems', credit: 3 },
            { name: 'Elective II', credit: 3 },
            { name: 'Final Year Project I', credit: 3 }
        ],
        '8': [
            { name: 'Big Data Analytics', credit: 3 },
            { name: 'Cloud Computing', credit: 3 },
            { name: 'Elective III', credit: 3 },
            { name: 'Elective IV', credit: 3 },
            { name: 'Final Year Project II', credit: 3 }
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
    semesterSelect.addEventListener('change', function() {
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
                        <label for="marks-${index}">Marks Obtained (0-100):</label>
                        <input type="number" id="marks-${index}" min="0" max="100" placeholder="Enter marks">
                    </div>
                    <div>
                        <label>Credit Hours:</label>
                        <input type="text" value="${subject.credit}" readonly>
                    </div>
                </div>
            `;
            subjectsContainer.appendChild(subjectCard);
        });
        
        // Hide previous results when changing semester
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
    }
    
    // Function to get grade from marks
    function getGrade(marks) {
        if (marks >= 85) return 'A';
        if (marks >= 80) return 'A-';
        if (marks >= 75) return 'B+';
        if (marks >= 70) return 'B';
        if (marks >= 65) return 'B-';
        if (marks >= 60) return 'C+';
        if (marks >= 55) return 'C';
        if (marks >= 50) return 'C-';
        if (marks >= 40) return 'D';
        return 'F';
    }
    
    // Function to get grade points from grade
    function getGradePoints(grade) {
        switch(grade) {
            case 'A': return 4.0;
            case 'A-': return 3.7;
            case 'B+': return 3.3;
            case 'B': return 3.0;
            case 'B-': return 2.7;
            case 'C+': return 2.3;
            case 'C': return 2.0;
            case 'C-': return 1.7;
            case 'D': return 1.0;
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