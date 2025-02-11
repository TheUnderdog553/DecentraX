export const IoTRegistryABI = [
    {
      "inputs": [
        {"internalType": "string","name": "deviceId","type": "string"}
      ],
      "name": "isRegistered",
      "outputs": [{"internalType": "bool","name": "","type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "string","name": "deviceId","type": "string"}
      ],
      "name": "registerDevice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const;