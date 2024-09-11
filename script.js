window.addEventListener('load', async () => {
    // 检查 MetaMask 是否存在
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const contractAddress = '0x55f53e163Ccc5eA2B4EEe34cAAF8a83dF741cfbF';
        const abi = [
            {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
            {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ETHWithdrawn","type":"event"},
            {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"chain","type":"string"},{"indexed":false,"internalType":"address","name":"usdtAddress","type":"address"},{"indexed":false,"internalType":"address","name":"usdcAddress","type":"address"}],"name":"TokenAddressesUpdated","type":"event"},
            {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenWithdrawn","type":"event"},
            {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
            {"inputs":[],"name":"recipientAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
            {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sendETH","outputs":[],"stateMutability":"nonpayable","type":"function"},
            {"inputs":[{"internalType":"string","name":"chain","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sendUSDC","outputs":[],"stateMutability":"nonpayable","type":"function"},
            {"inputs":[{"internalType":"string","name":"chain","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sendUSDT","outputs":[],"stateMutability":"nonpayable","type":"function"},
            {"inputs":[],"name":"setTokenAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},
            {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"usdcAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
            {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"usdtAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
            {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"},
            {"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"},
            {"stateMutability":"payable","type":"receive"}
        ];

        const contract = new web3.eth.Contract(abi, contractAddress);

        // 连接钱包并设置当前账户
        async function connectWallet() {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                document.getElementById('walletAddress').innerText = accounts[0];
            } catch (error) {
                console.error("Error connecting wallet:", error);
                document.getElementById('status').innerText = 'Error connecting wallet. Check console for details.';
            }
        }

        document.getElementById('connectButton').addEventListener('click', connectWallet);

        // 处理交易
        async function sendTransaction(tokenType, amount) {
            try {
                const accounts = await web3.eth.getAccounts();
                const fromAddress = accounts[0];
                let tx;
                if (tokenType === 'ETH') {
                    tx = await contract.methods.sendETH(web3.utils.toWei(amount, 'ether')).send({ from: fromAddress });
                } else if (tokenType === 'USDT') {
                    tx = await contract.methods.sendUSDT('arbitrum', web3.utils.toWei(amount, 'ether')).send({ from: fromAddress });
                } else if (tokenType === 'USDC') {
                    tx = await contract.methods.sendUSDC('arbitrum', web3.utils.toWei(amount, 'ether')).send({ from: fromAddress });
                }
                document.getElementById('transactionStatus').innerText = `Transaction successful: ${tx.transactionHash}`;
            } catch (error) {
                console.error("Error during transaction:", error);
                document.getElementById('transactionStatus').innerText = "Transaction failed. Check console for details.";
            }
        }

        document.getElementById('sendETH').addEventListener('click', () => sendTransaction('ETH', document.getElementById('amountETH').value));
        document.getElementById('sendUSDT').addEventListener('click', () => sendTransaction('USDT', document.getElementById('amountUSDT').value));
        document.getElementById('sendUSDC').addEventListener('click', () => sendTransaction('USDC', document.getElementById('amountUSDC').value));
    } else {
        console.log('MetaMask not detected.');
        document.getElementById('status').innerText = 'MetaMask not detected. Please install MetaMask.';
    }
});
