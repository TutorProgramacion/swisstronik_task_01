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
    const contractAddress = '0xa4E62cB305a5E869aE8e5784897387b8f9469134'; // Prev contract created
    const [signer] = await hre.ethers.getSigners();

    const contractFactory = await hre.ethers.getContractFactory("CMAToken");
    const contract = contractFactory.attach(contractAddress);

    const functionName = "mint1000tokens";
    const mint1000TokensTx = await sendShieldedTransaction(
        signer,
        contractAddress,
        contract.interface.encodeFunctionData(functionName),
        0
    );

    await mint1000TokensTx.wait();

    console.log("Transaction Receipt: ", mint1000TokensTx.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


