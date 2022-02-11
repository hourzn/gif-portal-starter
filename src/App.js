import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'hourzn';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
    'https://media2.giphy.com/media/iI4YsRrxiHXwjMX1j3/giphy.webp',
    'https://media2.giphy.com/media/rPbVaGPnheoQ2dFkND/200w.webp?cid=ecf05e4747ep5th5bbacw5vntfp14xyz7v2wjqbss795b5d9&rid=200w.webp&ct=g',
];

const App = () => {
    // states
    const [walletAddress, setwalletAddress] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [gifList, setGifList] = useState([]);

    // input handle function
    const onInputChange = (e) => {
        const { value } = e.target;
        setInputValue(value);
    };
    // add gifs on submit then clear input value
    const sendGif = async () => {
        if (inputValue.length > 0) {
            console.log('Gif link:', inputValue);
            setGifList([...gifList, inputValue]);
            setInputValue('');
        } else {
            console.log('Empty input. Try again.');
        }
    };
    // check to see if user has phantom wallet if not tell them.
    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window;
            if (solana) {
                if (solana.isPhantom) {
                    console.log('Phantom Wallet Found.');
                    const response = await solana.connect({ onlyIfTrusted: true });
                    console.log('connected with public key', response.publicKey.toString());

                    setwalletAddress(response.publicKey.toString());
                }
            } else {
                alert('Phantom Wallet not found.');
            }
        } catch (error) {
            console.error(error);
        }
    };
    // conncet wallet to our app
    const connectWallet = async () => {
        const { solana } = window;

        if (solana) {
            const response = await solana.connect();
            console.log('connected with public key:', response.publicKey.toString());

            setwalletAddress(response.publicKey.toString());
        }
    };
    // render this component if wallet is not connected
    const renderNotConnectedContainer = () => (
        <button className='cta-button connect-wallet-button' onClick={connectWallet}>
            Connect to Wallet
        </button>
    );
    // render this component if wallet is connected
    const renderConnectedContainer = () => (
        <div className='connected-container'>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    sendGif();
                }}
            >
                <input type='text' placeholder='Enter gif link!' value={inputValue} onChange={onInputChange} />
                <button type='submit' className='cta-button submit-gif-button'>
                    Submit
                </button>
            </form>
            <div className='gif-grid'>
                {/* Map through gifList instead of TEST_GIFS */}
                {gifList.map((gif) => (
                    <div className='gif-item' key={gif}>
                        <img src={gif} alt={gif} />
                    </div>
                ))}
            </div>
        </div>
    );
    // check to see if our wallet is connected and make sure to call once only by passing an empty array
    useEffect(() => {
        const onLoad = async () => {
            await checkIfWalletIsConnected();
        };
        window.addEventListener('load', onLoad);
        return () => window.removeEventListener('load', onLoad);
    }, []);
    // if our wallet address changes we want to call use effect again to rerender.
    useEffect(() => {
        if (walletAddress) {
            console.log('Fetching GIF list...');

            // Call Solana program here.

            // Set state
            setGifList(TEST_GIFS);
        }
    }, [walletAddress]);
    return (
        <div className='App'>
            <div className='container'>
                <div className={walletAddress ? 'authed-container' : 'container'}>
                    <div className='header-container'>
                        <p className='header'>🖼 NFT Portal</p>
                        <p className='sub-text'>View your GIF collection in the metaverse ✨</p>
                        {!walletAddress && renderNotConnectedContainer()}
                        {walletAddress && renderConnectedContainer()}
                    </div>
                    <div className='footer-container'>
                        <img alt='Twitter Logo' className='twitter-logo' src={twitterLogo} />
                        <a
                            className='footer-text'
                            href={TWITTER_LINK}
                            target='_blank'
                            rel='noreferrer'
                        >{`built on @${TWITTER_HANDLE}`}</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
