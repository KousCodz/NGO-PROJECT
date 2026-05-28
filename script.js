// Load Visitors From Local Storage
let visitors = JSON.parse(localStorage.getItem("visitors")) || [];

// Save Visitors
function saveVisitors() {
  localStorage.setItem("visitors", JSON.stringify(visitors));
}

// Add Visitor
function addVisitor() {

  const visitorName = document.getElementById("visitorName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const resident = document.getElementById("resident").value.trim();
  const purpose = document.getElementById("purpose").value.trim();

  // Validation
  if (!visitorName || !phone || !resident || !purpose) {
    alert("Please fill all fields");
    return;
  }

  const now = new Date();

  visitors.unshift({
    visitorName,
    phone,
    resident,
    purpose,
    entryTime: now.toLocaleString(),
    exitTime: "-",
    date: now.toISOString()
  });

  // Save Data
  saveVisitors();

  updateTable();
  updateCards();

  // Clear Inputs
  document.getElementById("visitorName").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("resident").value = "";
  document.getElementById("purpose").value = "";

  document.getElementById("visitorName").focus();
}

// Mark Exit
function markExit(index) {

  if (visitors[index].exitTime !== "-") {
    alert("Exit already marked");
    return;
  }

  visitors[index].exitTime = new Date().toLocaleString();

  // Save Data
  saveVisitors();

  updateTable();
  updateCards();
}

// Delete Visitor
function deleteVisitor(index) {

  const confirmDelete = confirm("Are you sure you want to delete this record?");

  if (confirmDelete) {

    visitors.splice(index, 1);

    // Save Data
    saveVisitors();

    updateTable();
    updateCards();
  }
}

// Update Table
function updateTable() {

  const table = document.getElementById("visitorTable");

  table.innerHTML = "";

  visitors.forEach((visitor, index) => {

    table.innerHTML += `
      <tr>
        <td>${visitor.visitorName}</td>
        <td>${visitor.phone}</td>
        <td>${visitor.resident}</td>
        <td>${visitor.purpose}</td>
        <td>${visitor.entryTime}</td>
        <td>${visitor.exitTime}</td>

        <td style="display:flex; gap:10px; flex-wrap:wrap;">

          <button onclick="markExit(${index})">
            Exit
          </button>

          <button
            onclick="deleteVisitor(${index})"
            style="background:linear-gradient(to right,#ef4444,#dc2626);">
            Delete
          </button>

        </td>
      </tr>
    `;
  });
}

// Update Cards
function updateCards() {

  document.getElementById("totalVisitors").innerText = visitors.length;

  // Today's Visitors
  const today = new Date().toISOString().split("T")[0];

  const todayVisitors = visitors.filter(visitor =>
    visitor.date.split("T")[0] === today
  ).length;

  document.getElementById("todayVisitors").innerText = todayVisitors;

  // Active Visitors
  const activeVisitors = visitors.filter(
    visitor => visitor.exitTime === "-"
  ).length;

  document.getElementById("activeVisitors").innerText = activeVisitors;
}

// Enter Key Navigation
const inputs = document.querySelectorAll(".form-container input");

inputs.forEach((input, index) => {

  input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

      event.preventDefault();

      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else {
        addVisitor();
      }
    }

  });

});

// Print By Date
function printByDate() {

  const selectedDate = document.getElementById("filterDate").value;

  if (!selectedDate) {
    alert("Please select a date");
    return;
  }

  const filteredVisitors = visitors.filter(visitor => {

    return visitor.date.split("T")[0] === selectedDate;

  });

  if (filteredVisitors.length === 0) {
    alert("No records found for selected date");
    return;
  }

  let printContent = `
    <h2>Visitor Record - ${selectedDate}</h2>

    <table border="1" cellspacing="0" cellpadding="10" width="100%">
      <tr>
        <th>Visitor</th>
        <th>Phone</th>
        <th>Resident</th>
        <th>Purpose</th>
        <th>Entry Time</th>
        <th>Exit Time</th>
      </tr>
  `;

  filteredVisitors.forEach(visitor => {

    printContent += `
      <tr>
        <td>${visitor.visitorName}</td>
        <td>${visitor.phone}</td>
        <td>${visitor.resident}</td>
        <td>${visitor.purpose}</td>
        <td>${visitor.entryTime}</td>
        <td>${visitor.exitTime}</td>
      </tr>
    `;
  });

  printContent += `</table>`;

  const printWindow = window.open("", "", "width=1000,height=700");

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Visitor Data</title>

        <style>

          body{
            font-family:Arial;
            padding:20px;
          }

          table{
            border-collapse:collapse;
            width:100%;
          }

          th{
            background:#7e22ce;
            color:white;
          }

          th, td{
            padding:10px;
            text-align:left;
          }

        </style>

      </head>

      <body>
        ${printContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

// Load Existing Data On Refresh
updateTable();
updateCards();
