define([
    'jquery',
    'backbone',
    'utils/urlParse',
    'utils/calcPercentage'
], function(
    $,
    Backbone,
    urlParse,
    calcPercentage
) {
    var sum = urlParse.getUrlParameter('sum') ? parseInt(urlParse.getUrlParameter('sum')) : 80000;
    var rent = urlParse.getUrlParameter('rent') !== null ? parseInt(urlParse.getUrlParameter('rent')) : 16000;
    var deposit = urlParse.getUrlParameter('deposit') !== null ? parseFloat(urlParse.getUrlParameter('deposit')) : 7;
    var credit = urlParse.getUrlParameter('credit') !== null ? parseFloat(urlParse.getUrlParameter('credit')) : 12;
    var total = urlParse.getUrlParameter('total') !== null ? parseInt(urlParse.getUrlParameter('total')) : 4500000;
    var exist = urlParse.getUrlParameter('exist') !== null ? parseInt(urlParse.getUrlParameter('exist')) : 1000000;

    var Panel = Backbone.Model.extend({
        defaults: {
            sum: {
                label: 'Сумма в месяц',
                value: sum,
                units: 'руб.',
                hint: 'Сумма в месяц, которую Вы готовы откладывать или платить по ипотеке. ' +
                'Если Вы решили копить, то прибавьте к этой сумме стоимость вашей текущей аренды квартиры.'
            },
            rent: {
                label: 'Аренда квартиры',
                value: rent,
                units: 'руб.',
                hint: 'Если Вы копите деньги, укажите стоимость текущей аренды квартиры.'
            },
            deposit: {
                label: '% по вкладу',
                value: deposit,
                units: '%',
                hint: 'Наверное Вы храните деньги в банке. Укажите годовой процент по вкладу.'
            },
            credit: {
                label: '% по ипотеке',
                value: credit,
                units: '%',
                hint: 'Если берете ипотеку, укажите процентую ставку.'
            },
            total: {
                label: 'Стоимость квартиры',
                value: total,
                units: 'руб.',
                hint: 'Полная стоимость квартиры, которую хотите купить.'
            },
            exist: {
                label: 'Уже есть',
                value: exist,
                units: 'руб.',
                hint: 'Если у вас уже есть какие-то сбережения, укажите сколько.'
            }
        },

        validate: function(attrs, options) {
            var errors = {};
            var now = new Date();

            if (attrs.sum.value < 5000) {
                errors.sum = 'Откладывайте хотя бы по&nbsp;5&nbsp;000&nbsp;руб.';
            }

            if (attrs.sum.value - attrs.rent.value < 5000) {
                errors.sum = 'Сумма не может быть меньше аренды квартиры.';
                errors.rent = 'Аренда не может быть больше общей суммы в месяц.';
            }

            if (attrs.sum.value <= calcPercentage(total - exist, credit, now)) {
                errors.sum = 'Вы не сможете платить ипотеку с такой суммой.';
            }

            if (attrs.sum.deposit < 0 || attrs.sum.deposit > 100) {
                errors.deposit = 'Введите число от 0 до 100.';
            }

            if (attrs.sum.credit < 0 || attrs.sum.credit > 100) {
                errors.credit = 'Введите число от 0 до 100.';
            }

            if (attrs.sum.total < 500000) {
                errors.total = 'Какая-то дешевенькая квартира.';
            }

            if (attrs.sum.exist < 0) {
                errors.exist = 'Не может быть отрицательное число.';
            }

            if (!$.isEmptyObject(errors)) {
                return errors;
            }
        }
    });

    return new Panel();
});
