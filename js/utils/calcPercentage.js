define([], function() {
    function round(n) {
        return Math.round(n * 100) / 100;
    }

    function calcPercentage(sum, percent, date) {
        var daysPerMonth =  33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();
        var daysPerYear = date.getFullYear() % 4 === 0 ? 366 : 365;
        return round(sum * percent / 100 / daysPerYear * daysPerMonth);
    }

    return calcPercentage;
});