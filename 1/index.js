"use strict";
const sum_to_n_a = function(n) {
    if ( n < 0 )
        throw new TypeError('n should be greater or equal 0');
    return ( n * (n + 1 ) ) / 2
};

const sum_to_n_b = function(n) {
    if ( n < 0 )
        throw new TypeError('n should be greater or equal 0');
    let sum = 0;
    while (n > 0)
        sum += n--;
    return sum;
};

const sum_to_n_c = function(n) {
    if ( n < 0 )
        throw new TypeError('n should be greater or equal 0');

    if ( n === 1 ) {
        return 1;
    }

    return n + sum_to_n_c(n-1);
};

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(6));
console.log(sum_to_n_c(7));
