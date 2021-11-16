import { Provider } from "@ethersproject/abstract-provider"
import { AlchemyProvider, getNetwork } from "@ethersproject/providers"
import { Contract, ethers } from "ethers"
import { getEthereumNetwork } from "../../lib/utils"
import { createBackgroundAsyncThunk } from "../utils"

function getProvider(): Provider {
  // I want this function to accept chainId and then do a search like
  // Networks[chainId] which returns an RPC URL
  const provider: Provider = new ethers.providers.JsonRpcProvider(
    "some rpc url here"
  )
  return provider
}

function getAlchemyProvider(): AlchemyProvider {
  const provider = new AlchemyProvider(
    getNetwork(Number(getEthereumNetwork().chainID)),
    process.env.ALCHEMY_KEY
  )
  return provider
}

const getContract = async (address: string, abi: any[]): Promise<Contract> => {
  const provider = getAlchemyProvider()
  return new ethers.Contract(address, abi, provider)
}

const createFetchContractThunk = (contractName: string, abi: any[]): any => {
  return createBackgroundAsyncThunk(
    `***SOMESLICE***/fetch${
      contractName.charAt(0).toUpperCase() + contractName.slice(1)
    }`,
    async ({ address }: { address: string }) => {
      const contract = await getContract(address, abi)
      return contract
    }
  )
}

export {
  getProvider,
  getAlchemyProvider,
  getContract,
  createFetchContractThunk,
}
