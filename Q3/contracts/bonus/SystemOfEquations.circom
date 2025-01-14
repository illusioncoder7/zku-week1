pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib-matrix/circuits/matMul.circom"; 
// hint: you can use more than one templates in circomlib-matrix to help you
include "../../node_modules/circomlib-matrix/circuits/matSub.circom";
include "../../node_modules/circomlib-matrix/circuits/matElemPow.circom";
include "../../node_modules/circomlib-matrix/circuits/matElemSum.circom";
include "../../node_modules/circomlib-matrix/circuits/transpose.circom";

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
    component pro = matMul(n, n, 1);

    // Calculate A * x = b'
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            pro.a[i][j] <== A[i][j];
        }
        pro.b[i][0] <== x[i];
    }

    component comparators[n];
    var results[1][n];
    
    // Generate array of subtractions results b[i] - b'[i]
    // and check if sum(b[i] - b'[i]) == 0 and sum((b[i] - b'[i])^2) == 0 for all i
    component diff = matSub(n, 1);
    component diffSum = matElemSum(n, 1);
    component powSum = matElemSum(n, 1);
    component elemPow = matElemPow(n, 1, 2);
    component isZero = IsEqual();
    component isZeroPow = IsEqual();

    // Calculate b - b'
    for (var i = 0; i < n; i++) {
        diff.a[i][0] <== b[i];
        diff.b[i][0] <== pro.out[i][0];
    }

    // Sum the b[i] - b'[i] and calculate (b - b')^2
    for (var i = 0; i < n; i++) {
        diffSum.a[i][0] <== diff.out[i][0];
        elemPow.a[i][0] <== diff.out[i][0];
    }

    // Sum the (b[i] - b'[i])^2
    for (var i = 0; i < n; i++) {
        powSum.a[i][0] <== elemPow.out[i][0];
    }

    // Check if diffSum(b[i] - b'[i]) == 0
    isZero.in[0] <== diffSum.out;
    isZero.in[1] <== 0;

    // Check if diffSum((b[i] - b'[i])^2) == 0
    isZeroPow.in[0] <== powSum.out;
    isZeroPow.in[1] <== 0;
    
    // Check if both comparisons returned 1
    out <== isZero.out * isZeroPow.out;
}

component main {public [A, b]} = SystemOfEquations(3);