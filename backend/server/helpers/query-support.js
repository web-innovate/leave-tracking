function getQueryData(schema, sensitiveFields = []) {
    const { obj, paths } = schema;
    const fields = Object.keys(obj).filter(e => sensitiveFields.indexOf(e) === -1);

    const data = {};

    fields.forEach(field => {
        data[field] = fetchFieldQueryData(paths[field]);
    });

    return data;
}

function fetchFieldQueryData(path) {
    const type = path.instance;

    switch(path.instance) {
    case 'String':
        return { type, operations: getStringQueryData() };
    case 'Number':
        return { type, operations: getNumberQueryData() };
    case 'Date':
        return { type, operations: getDateQueryData() };
    case 'Array':
        return { type, item_type: path.caster.instance, operations: fetchArrayQueryData() };
    }
}

function fetchArrayQueryData() {
    return ['in', 'not_in'];
}

function getStringQueryData() {
    return [
        'contains', 'not_contains', 'equals', 'not_equals'
    ];
}

function getNumberQueryData() {
    return [
        'greater_than', 'less_than', 'equals', 'not_equals'
    ];
}

function getDateQueryData() {
    return [
        'before', 'after', 'equals', 'not_equals'
    ];
}

export default { getQueryData };
