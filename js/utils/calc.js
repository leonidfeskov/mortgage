define([
    'utils/calcPercentage'
],
function(
    calcPercentage
) {
    function round(n) {
        return Math.round(n * 100) / 100;
    }

    function formatedMonth(month) {
        if (month > 9) {
            return month;
        }
        return '0' + month;
    }

    function calc(userData) {
        var sum = userData.sum || 0;
        var rent = userData.rent || 0;
        var deposit = userData.deposit || 0;
        var credit = userData.credit || 0;
        var total = userData.total || 0;
        var exist = userData.exist || 0;

        var data = [];
        var statistics = {
            monthsRent: 0,
            overRent: 0,
            monthsCredit: 0,
            overCredit: 0
        };

        var isCalculatedDeposit = false;
        var isCalculatedCredit = false;

        var now = new Date();

        // рассчитываем начальные данные для первой строки
        data[0] = {};
        data[0].number = 1;
        data[0].date = now.getDate() + '.' + formatedMonth(now.getMonth() + 1) + '.' + now.getFullYear();
        data[0].deposit = exist;
        data[0].income = calcPercentage(data[0].deposit, deposit, now);
        data[0].credit = total - exist;
        data[0].percentage = calcPercentage(data[0].credit, credit, now);
        data[0].overRent = rent;
        data[0].overCredit = data[0].percentage;

        var row = 1;
        while (data[row-1].deposit < total || data[row-1].credit > 0) {
            data[row] = {};

            data[row].number = row + 1;

            var nextMonth = new Date(now.getFullYear(), now.getMonth() + row, now.getDate());
            data[row].date = nextMonth.getDate() + '.' + formatedMonth(nextMonth.getMonth() + 1) + '.' + nextMonth.getFullYear();

            data[row].deposit = round(data[row - 1].deposit + data[row - 1].income + (sum - rent));

            data[row].income = calcPercentage(data[row].deposit, deposit, nextMonth);

            data[row].credit = round(data[row - 1].credit - sum + data[row - 1].percentage);

            data[row].percentage = calcPercentage(data[row].credit, credit, nextMonth);

            data[row].overRent = round(data[row - 1].overRent + rent);

            data[row].overCredit = round(data[row - 1].overCredit + data[row].percentage);

            if (!isCalculatedDeposit && data[row].deposit >= total) {
                statistics.monthsRent = row;
                statistics.overRent = data[row].overRent;
                isCalculatedDeposit = true;
            }

            if (!isCalculatedCredit && data[row].credit <= 0) {
                statistics.monthsCredit = row;
                statistics.overCredit = data[row].overCredit;
                isCalculatedCredit = true;
            }

            row++;
        }

        return {
            statistics: statistics,
            table: data
        };
    }

    return calc;
});