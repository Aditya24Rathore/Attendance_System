// Toggle Dark Mode
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Load students from Local Storage
function loadStudents() {
  const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
  const studentsContainer = document.getElementById('studentsContainer');
  studentsContainer.innerHTML = ''; // Clear previous rows
  storedStudents.forEach((student, index) => addStudentRow(student, index + 1));
}

// Save students to Local Storage
function saveStudents(students) {
  localStorage.setItem('students', JSON.stringify(students));
}

// Add a new student row
function addStudentRow(student = {}, rowIndex) {
  const studentsContainer = document.getElementById('studentsContainer');
  const row = document.createElement('div');
  row.className = 'row';

  row.innerHTML = `
    <span>${rowIndex || studentsContainer.children.length + 1}</span>
    <input type="text" placeholder="Name" value="${student.name || ''}" required>
    <input type="text" placeholder="Roll No." value="${student.rollNo || ''}" required>
    <div class="status-buttons">
      <button type="button" class="present" onclick="setStatus(this, 'Present')">Present</button>
      <button type="button" class="absent" onclick="setStatus(this, 'Absent')">Absent</button>
      <input type="hidden" class="status" value="${student.status || ''}">
    </div>
  `;
  studentsContainer.appendChild(row);
}

// Set attendance status
function setStatus(button, status) {
  const statusInput = button.parentElement.querySelector('.status');
  statusInput.value = status;

  const buttons = button.parentElement.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.classList.contains('present')) {
      btn.style.backgroundColor = status === 'Present' ? '#2E7D32' : '#4CAF50';
    } else if (btn.classList.contains('absent')) {
      btn.style.backgroundColor = status === 'Absent' ? '#D32F2F' : '#FF4C4C';
    }
  });
}

// Collect attendance data and generate Excel
function submitAttendance() {
  const studentsContainer = document.getElementById('studentsContainer');
  const rows = studentsContainer.querySelectorAll('.row');
  const students = [];

  rows.forEach(row => {
    const name = row.querySelector('input[placeholder="Name"]').value;
    const rollNo = row.querySelector('input[placeholder="Roll No."]').value;
    const status = row.querySelector('.status').value;

    if (name && rollNo) {
      students.push({ name, rollNo, status });
    }
  });

  // Save the students list to Local Storage
  saveStudents(students);

  // Generate and download Excel file
  generateExcel(students);
}

// Generate Excel file (using SheetJS)
function generateExcel(students) {
  const workbook = XLSX.utils.book_new();
  const worksheetData = students.map((student, index) => ({
    '#': index + 1,
    'Name': student.name,
    'Roll No.': student.rollNo,
    'Status': student.status || 'Absent',
  }));
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
  XLSX.writeFile(workbook, `Attendance_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Load students on page load
document.addEventListener('DOMContentLoaded', loadStudents);
