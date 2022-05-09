const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16,plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // generates proof and public signals for input a=1,b=2 with tha wasm and zkey
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");
        // prints the public signal (which is output in our case)in console
        console.log('1x2 =',publicSignals[0]);
        // converts the public signals to BigInteger for verifier contract parameter
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // converts the  proof to BigInteger
        const editedProof = unstringifyBigInts(proof);
        // preparing calldata from the biginteger proofs and signals for making a call  to the verifier smart contract 
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        // separating the input signals and the proof from call the data
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        // making parameters for calling the verifyProof method
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);
        // calling the verifyProof method with the previously prepared parameters and expecting it to be true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    let Verifier,verifier;

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        // generate proof and public signals for input of a=10,b=20,c=30
        const { proof, publicSignals } = await groth16.fullProve({"a":"10","b":"20","c":"30"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");
        // prints the public signal (which is output in our case)in console,should give 10*20*30=6000
        console.log('10*20*30 =',publicSignals[0]);
        // converts the public signals to BigInteger for verifier contract parameter
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // converts the  proof to BigInteger
        const editedProof = unstringifyBigInts(proof);
        // preparing calldata from the biginteger proofs and signals for making a call  to the verifier smart contract 
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        // separating the input signals and the proof from call the data
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        // making parameters for calling the verifyProof method
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);
        // calling the verifyProof method with the previously prepared parameters,and expecting it to be true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;

    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        // calling the verifyProof and expecting it to be false
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {
    let Verifier,verifier;

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        // generate proof and public signals for input of a=10,b=20,c=30
        const { proof, publicSignals } = await groth16.fullProve({"a":"10","b":"20","c":"30"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");
        // prints the public signal (which is output in our case)in console,should give 10*20*30=6000
        console.log('10*20*30 =',publicSignals[0]);
        // converts the public signals to BigInteger for verifier contract parameter
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // converts the  proof to BigInteger
        const editedProof = unstringifyBigInts(proof);
        // preparing calldata from the biginteger proofs and signals for making a call  to the verifier smart contract 
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        // separating the input signals and the proof from call the data
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        // making parameters for calling the verifyProof method
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);
        // calling the verifyProof method with the previously prepared parameters,and expecting it to be true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        // calling the verifyProof and expecting it to be false
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});