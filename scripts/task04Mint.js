const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
    const rpcLink = hre.network.config.url;
    const [encryptedData] = await encryptDataField(rpcLink, data);
    return await signer.sendTransaction({
        from: signer.address,
        to: destination,
        data: encryptedData,
        value,
    });
};

async function main() {
    const contractAddress = '0x4fDaAC5eBA0a71A50321FA0Af73f88836A0C69C2'; // Prev contract perc-20 created
    const [signer] = await ethers.getSigners()

    const contractFactory = await ethers.getContractFactory('PCMA')
    const contract = contractFactory.attach(contractAddress)

    const mintFunctionName = 'mint'

    const mintTx = await sendShieldedTransaction(
        signer,
        contractAddress,
        contract.interface.encodeFunctionData(mintFunctionName),
        0
    )

    await mintTx.wait()

    console.log('Mint Transaction Hash: ', mintTx.hash)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


