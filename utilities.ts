export function use_default_config(a, d) {
    for (let i in d) {
        if (a[i] === undefined) { a[i] = d[i]; }
    }
    return a;
};
