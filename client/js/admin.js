const API = "/api";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const name = localStorage.getItem("name");

if (!token) window.location.href = "login.html";
if (role !== "admin") window.location.href = "employee.html";

document.getElementById("welcomeText").innerText = `admin: ${name}`;

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

async function loadReports() {
  const table = document.getElementById("reportTable");
  table.innerHTML = `<tr><td colspan="4">loading...</td></tr>`;

  try {
    const res = await fetch(`${API}/reports`, {
      headers: { Authorization: "Bearer " + token }
    });

    const reports = await res.json();

    table.innerHTML = reports
      .map(
        (r) => `
        <tr>
          <td>${r.employeeName}</td>
          <td>${r.date}</td>
          <td>${r.work}</td>
          <td>
            <button class="action-btn edit-btn" onclick="editReport('${r._id}', \`${r.work}\`)">edit</button>
            <button class="action-btn delete-btn" onclick="deleteReport('${r._id}')">delete</button>
          </td>
        </tr>
      `
      )
      .join("");
  } catch (err) {
    table.innerHTML = `<tr><td colspan="4">error loading reports</td></tr>`;
  }
}

async function editReport(id, oldWork) {
  const newWork = prompt("edit report:", oldWork);
  if (!newWork) return;

  await fetch(`${API}/reports/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ work: newWork })
  });

  loadReports();
}

async function deleteReport(id) {
  const confirmDelete = confirm("are you sure you want to delete this report?");
  if (!confirmDelete) return;

  await fetch(`${API}/reports/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  loadReports();
}

loadReports();
