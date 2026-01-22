const API = "/api";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const name = localStorage.getItem("name");

if (!token) window.location.href = "login.html";
if (role === "admin") window.location.href = "admin.html";

document.getElementById("welcomeText").innerText = `welcome, ${name}`;
document.getElementById("date").valueAsDate = new Date();

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

async function submitReport() {
  const date = document.getElementById("date").value;
  const work = document.getElementById("work").value.trim();
  const msg = document.getElementById("msg");

  msg.innerText = "";

  if (!date || !work) {
    msg.innerText = "please fill date and work report";
    msg.style.color = "#fca5a5";
    return;
  }

  try {
    const res = await fetch(`${API}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ date, work })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.msg || "failed to submit report";
      msg.style.color = "#fca5a5";
      return;
    }

    msg.innerText = "report submitted successfully ✅";
    msg.style.color = "#86efac";

    document.getElementById("work").value = "";
    loadReports();
  } catch (err) {
    msg.innerText = "backend not running or network issue";
    msg.style.color = "#fca5a5";
  }
}

async function loadReports() {
  const table = document.getElementById("reportTable");
  table.innerHTML = `<tr><td colspan="3">loading...</td></tr>`;

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
        </tr>
      `
      )
      .join("");
  } catch (err) {
    table.innerHTML = `<tr><td colspan="3">error loading reports</td></tr>`;
  }
}

loadReports();
