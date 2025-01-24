import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Gif } from '@giphy/react-components';

export default function Menu() {
    const [gif, setGif] = useState(null);

    const giphyFetch = new GiphyFetch('ucmBcFceCXNR9S1w724bgnDTMYepCt3j');

    useEffect(() => {
        // Fetch a random GIF with the keyword "motogp"
        async function fetchRandomGif() {
            const randomTag = `motogp-${Math.random()}`;
            const { data } = await giphyFetch.random({
                tag: randomTag,
                type: 'gifs',
            });
            setGif(data);
        }
        fetchRandomGif();
    }, []);
    return (
        <>
            <Navbar />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <img
                    src='/motogp.svg'
                    alt='Moto GP'
                    style={{ width: '300px', marginBottom: '20px' }}
                />
                {gif && (
                    <div>
                        <Gif gif={gif} width={300} />
                    </div>
                )}
            </div>
        </>
    );
}
