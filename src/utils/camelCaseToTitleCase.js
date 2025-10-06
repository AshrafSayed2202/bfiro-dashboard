export const camelCaseToTitleCase = (camelCaseStr) => {
    const result = camelCaseStr
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, function (str) {
            return str.toUpperCase();
        });
    return result;
};
