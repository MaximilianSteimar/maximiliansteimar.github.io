function age() {
    var day = parseInt(document.getElementById("MyDay").value);
    var month = parseInt(document.getElementById("MyMonth").value) - 1; // wichtig!
    var year = parseInt(document.getElementById("MyYear").value);

    var birth = moment({ year: year, month: month, day: day });
    var now = moment();

    var years = now.diff(birth, 'years');
    var months = now.diff(birth, 'months');
    var weeks = now.diff(birth, 'weeks');
    var days = now.diff(birth, 'days');

    var breaths = days * 22000 //source: https://www.lung.ca/lung-health/lung-info/breathing

    document.getElementById("result").innerHTML =
        `You're <b>${years}</b> years old 🥳<br>
        <br>
            That's <br>
            <b>${numberWithCommas(months)}</b> months, <br>
            <b>${numberWithCommas(weeks)}</b> weeks or <br>
            <b>${numberWithCommas(days)}</b> days 📅<br>
            <br>
            You've breathed around <b>${numberWithCommas(breaths)}</b> times 🍃`;
}

// Source - https://stackoverflow.com/a/2901298
// Posted by Elias Zamaria, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-05, License - CC BY-SA 4.0

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
