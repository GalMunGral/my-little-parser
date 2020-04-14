function test(a, b) {
    let c = a * b;
    let d = b * (b + (c - a) * (c + b));
    return c + d;
}
var a = test(1, 2);
