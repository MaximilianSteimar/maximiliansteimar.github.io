import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://timetracker-6af44-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

window.einstempeln = function () {
    const user = document.getElementById("user").value;
    const now = Date.now();
    const today = new Date().toISOString().split("T")[0];

    set(ref(database, user + "/" + today + "/" + now), {
        user: user,
        date: now,
        type: "einstempeln"
    });
};

window.ausstempeln = function () {
    const user = document.getElementById("user").value;
    const now = Date.now();
    const today = new Date().toISOString().split("T")[0];

    set(ref(database, user + "/" + today + "/" + now), {
        user: user,
        date: now,
        type: "ausstempeln"
    });
};

window.nachträglich = function () {
    const user = document.getElementById("user").value;
    const time = document.getElementById("nachträglichTime").value;
    const date = document.getElementById("nachträglichDate").value;
    const type = document.getElementById("einoderaus").value;

    const timestamp = new Date(date + "T" + time + ":00").getTime();

    set(ref(database, user + "/" + date + "/" + timestamp), {
        user: user,
        date: timestamp,
        type: type
    });
}

async function ladeTag(user, datum) {
    const snapshot = await get(child(ref(database), user + "/" + datum));
    if (!snapshot.exists()) return [];

    return Object.values(snapshot.val())
        .sort((a, b) => a.date - b.date);
}

function berechneStunden(events) {
  let totalMs = 0;
  let start = null;

  for (const e of events) {
    if (e.type === "einstempeln") start = e.date;

    if (e.type === "ausstempeln" && start) {
      totalMs += e.date - start;
      start = null;
    }
  }

  // ⏱️ noch eingestempelt → bis jetzt rechnen
  if (start) {
    totalMs += Date.now() - start;
  }

  return totalMs / 1000 / 60 / 60;
}


window.zeigeTagesstunden = async function () {
    const user = document.getElementById("user").value;
    const today = new Date().toISOString().split("T")[0];

    const events = await ladeTag(user, today);
    const stunden = berechneStunden(events);

    alert("Heute gearbeitet: " + stunden.toFixed(2) + " Std ⏱️");
};

window.zeigeGesamtstunden = async function () {
    const user = document.getElementById("user").value;

    const snapshot = await get(ref(database, user));
    if (!snapshot.exists()) {
        document.getElementById("gesamtstunden").innerText = "Gesamt: 0 Std";
        return;
    }

    const tageObjekt = snapshot.val(); // { "2026-02-05": {...}, "2026-02-06": {...}, ... }
    let gesamt = 0;

    for (const tag in tageObjekt) {
        const events = Object.values(tageObjekt[tag])
            .sort((a, b) => a.date - b.date);
        gesamt += berechneStunden(events);
    }

    alert("Gesamt: " + gesamt.toFixed(2) + " Std ⏱️");
};