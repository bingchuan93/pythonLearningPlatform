import _ from 'lodash';

export const getRegRemoveSpecialChar = (value) => {
    return new RegExp('^.*' + value.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&") + '.*$', 'i');
}

export const composeSubscriptionFiltersFieldsSort = (columns, filtered, sorted) => {
    const filters = {};
    filtered.forEach((f) => {
        const searchAlgorithm = _.find(columns, function (o) {
            return (o.id == f.id || o.accessor == f.id);
        }).searchAlgorithm;
        if (searchAlgorithm == 'text') {
            const inputArr = _.compact(f.value.toLowerCase().split(' '));
            filters.$text = { $search: "\"" + inputArr.join("\"") + "\"" }
        }
        else if (searchAlgorithm == 'boolean') {
            if (f.value !== 'boolean-all') {
                filters[f.id] = (f.value === 'true') ? true : false;
            }
        }
        else if (searchAlgorithm == 'number') {
            filters[f.id] = Number(f.value);
        }
        else if (searchAlgorithm == 'date') {
            if (f.value) {
                filters[f.id] = { $eq: new Date(f.value) };
            }
        }
        else if (searchAlgorithm == 'minDate') {
            if (f.value) {
                filters[f.id] = { $gte: new Date(f.value.setHours(0, 0, 0, 0)) };
            }
        }
        else if (searchAlgorithm == 'maxDate') {
            if (f.value) {
                filters[f.id] = { $lte: new Date(f.value.setHours(24, 0, 0, -1)) };
            }
        }
        else if (searchAlgorithm == 'string') {
            filters[f.id] = String(f.value);
        }
        else if (searchAlgorithm == 'regexp') {
            filters[f.id] = { $regex: new RegExp(f.value, 'i') };
        }
        else {
            filters[f.id] = { $regex: getRegRemoveSpecialChar(f.value) };
        }
    });
    let fields = {};
    if (filters.$text) {
        fields = {
            score: { $meta: 'textScore' }
        }
    }

    let sort = {};
    if (filters.$text) {
        sort = {
            score: { $meta: 'textScore' }
        }
    }

    if (sorted.length == 1) {
        sort[sorted[0].id] = (sorted[0].desc ? -1 : 1);
    }
    return { filters, fields, sort };
}
