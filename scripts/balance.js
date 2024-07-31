const { ethers, network } = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedQuery = async (provider, destination, data) => {

    const rpclink = network.config.url
    const [encryptedData, usedEncryptedKey] = await encryptDataField(rpclink, data)

    const response = await provider.call({
        to: destination,
        data: encryptedData,
    })

    return await decryptNodeResponse(rpclink, response, usedEncryptedKey)
}

async function main() {
    const contractAddress = '0xa4E62cB305a5E869aE8e5784897387b8f9469134'
    const [signer] = await ethers.getSigners()

    const contractFactory = await ethers.getContractFactory('CMAToken')
    const contract = contractFactory.attach(contractAddress)

    const functionName = 'balanceOf'
    const functionArgs = [signer.address]
    const responseMessage = await sendShieldedQuery(
        signer.provider,
        contractAddress,
        contract.interface.encodeFunctionData(functionName, functionArgs)
    )

    const totalBalance = contract.interface.decodeFunctionResult(functionName, responseMessage)[0]

    console.log('Total Balance is:', ethers.formatUnits(totalBalance, 18))
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})