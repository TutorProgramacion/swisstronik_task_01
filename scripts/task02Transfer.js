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
    const replace_contractAddress = '0xa4E62cB305a5E869aE8e5784897387b8f9469134'; // Prev contract created
    const [signer] = await hre.ethers.getSigners();

    const replace_contractFactory = await hre.ethers.getContractFactory("CMAToken");
    const contract = replace_contractFactory.attach(replace_contractAddress);

    const amount = 1 * 10 ** 18

    const replace_functionName = "transfer";
    const replace_functionArgs = ["0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1", `${amount}`];
    const transaction = await sendShieldedTransaction(signer, replace_contractAddress, contract.interface.encodeFunctionData(replace_functionName, replace_functionArgs), 0);

    await transaction.wait();

    console.log("Transaction hash: " + transaction.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});