const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");

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
    const contractAddress = '0xd93dFBeE11219677e495b55d0FB062808cE52aAC'; // Prev contract perc-20 created
    const [signer] = await ethers.getSigners()

    const contractFactory = await ethers.getContractFactory('PrivateNFT')
    const contract = contractFactory.attach(contractAddress)

    const mintFunctionName = 'mint'
    const recipientAddress = signer.address

    const mintTx = await sendShieldedTransaction(
        signer,
        contractAddress,
        contract.interface.encodeFunctionData(mintFunctionName, [recipientAddress]),
        0
    )

    await mintTx.wait()

    console.log('Mint Transaction Hash: ', mintTx.hash)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


