'use strict';

(function() {

    function round(n) {
        return Math.round(n * 100) / 100;
    }

    function formatedMonth(month) {
        if (month > 9) {
            return month;
        }
        return '0' + month;
    }

    function formatedPrice(n) {
        return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');
    }

    function calcPercentage(sum, percent, date) {
        var daysPerMonth =  33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();
        var daysPerYear = date.getFullYear() % 4 == 0 ? 366 : 365;
        return round(sum * percent / 100 / daysPerYear * daysPerMonth);
    }

    function showError(input, message) {
        input.closest('.form-group').addClass('has-error');
        input.closest('.form-group')
            .find('.js-input-error')
            .html(message)
            .show();
    }

    var $data = $('.js-mortgage-data');

    function calc() {
        var sum = parseFloat($('.js-input-sum').val()) || 0;
        var rent = parseFloat($('.js-input-rent').val()) || 0;
        var deposit = parseFloat($('.js-input-deposit').val()) || 0;
        var credit = parseFloat($('.js-input-credit').val()) || 0;
        var total = parseFloat($('.js-input-total').val()) || 0;
        var exist = parseFloat($('.js-input-exist').val()) || 0;

        var now = new Date();

        $('.mortgage-input-data .form-group').removeClass('has-error')
            .find('.js-input-error').hide();

        var isValid = true;

        if (sum < 5000) {
            showError($('.js-input-sum'), 'Откладывайте хотя бы по&nbsp;5&nbsp;000&nbsp;руб.');
            isValid = false;
        }

        if (sum - rent < 5000) {
            showError($('.js-input-sum'), 'Сумма не может быть меньше аренды квартиры.');
            showError($('.js-input-rent'), 'Аренда не может быть больше общей суммы в месяц.');
            isValid = false;
        }

        if (sum <= calcPercentage(total - exist, credit, now)) {
            showError($('.js-input-sum'), 'Вы не сможете платить ипотеку с такой суммой.');
            isValid = false;
        }

        if (deposit < 0 || deposit > 100) {
            showError($('.js-input-deposit'), 'Введите число от 0 до 100.');
            isValid = false;
        }

        if (credit < 0 || credit > 100) {
            showError($('.js-input-credit'), 'Введите число от 0 до 100.');
            isValid = false;
        }

        if (total < 500000) {
            showError($('.js-input-total'), 'Какая-то дешевенькая квартира.');
            isValid = false;
        }

        if (exist < 0) {
            exist = 0;
        }

        if (!isValid) {
            $data.html('');

            $('.js-statistics-deposit-months').html(0 + '&nbsp;месяцев');
            $('.js-statistics-deposit-overpayment').html(0 + '&nbsp;руб.');

            $('.js-statistics-credit-months').html(0 + '&nbsp;месяцев');
            $('.js-statistics-credit-overpayment').html(0 + '&nbsp;руб.');
            return;
        }

        var data = [];
        var statistics = {
            deposit: {
                overpayment: 0,
                monthCount: 0
            },
            credit: {
                overpayment: 0,
                monthCount: 0
            }
        };

        var html = '';

        var cols = ['number', 'date', 'deposit', 'income', 'credit', 'percentage', 'overRent', 'overCredit'];
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

        html += '<tr>';
        for (var j = 0; j < cols.length; j++) {
            html += '<td>' + (j < 2 ? data[0][cols[j]]: formatedPrice(data[0][cols[j]])) + '</td>';
        }
        html += '</tr>';

        var row = 1;
        var highlightedDeposit = 0;
        var highlightedCredit = 0;
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

            html += '<tr>';
            for (var j = 0; j < cols.length; j++) {
                var col = cols[j];

                if (data[row].deposit >= total && (col === 'deposit' || col === 'overRent') && highlightedDeposit < 2) {
                    html += '<td class="bg-success" title="Поздравляю! Вы накопили необходимую сумму.">';
                    statistics.deposit.monthCount = data[row].number;
                    statistics.deposit.overpayment = data[row].overRent;
                    highlightedDeposit++;
                } else if (data[row].credit <= 0 && (col === 'credit' || col === 'overCredit') && highlightedCredit < 2) {
                    html += '<td class="bg-info" title="Поздравляю! Вы выплатили ипотеку.">';
                    statistics.credit.monthCount = data[row].number;
                    statistics.credit.overpayment = data[row].overCredit;
                    highlightedCredit++;
                } else {
                    html += '<td>';
                }

                html += (j < 2 ? data[row][col]: formatedPrice(data[row][col])) + '</td>'
            }
            html += '</tr>';

            row++;
        }

        $data.html(html);

        $('.js-statistics-deposit-months').html(statistics.deposit.monthCount + '&nbsp;месяцев');
        $('.js-statistics-deposit-overpayment').html(formatedPrice(statistics.deposit.overpayment) + '&nbsp;руб.');

        $('.js-statistics-credit-months').html(statistics.credit.monthCount + '&nbsp;месяцев');
        $('.js-statistics-credit-overpayment').html(formatedPrice(statistics.credit.overpayment) + '&nbsp;руб.');
    }

    $(function() {
        calc();

        $('.js-btn-calc').on('click', calc);
        $('.js-input-sum, .js-input-rent, .js-input-deposit, .js-input-credit, .js-input-total, .js-input-exist').on('change', calc);

        var $tableHead = $('.mortgage-table-head');
        var tableHead = {
            pos: $tableHead.offset().top,
            width: $tableHead.width(),
            height: $tableHead.height(),
            isFixed: false
        };

        $(window).scroll(function(e) {
            var scrollTop = window.pageYOffset;
            if (scrollTop >= tableHead.pos) {
                $tableHead.addClass('fixed');
                if (!tableHead.isFixed) {
                    $tableHead.width(tableHead.width);
                    $tableHead.before('<div class="mortgage-table-head-dummy" style="height: ' + tableHead.height + 'px"></div>');
                    tableHead.isFixed = true;
                }
            } else {
                $tableHead.removeClass('fixed');
                $('.mortgage-table-head-dummy').remove();
                tableHead.isFixed = false;
            }
        });

        $('[data-toggle="tooltip"]').tooltip({
            container: 'body'
        });
    });

})();