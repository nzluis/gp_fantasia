import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Spinner from '../components/Spinner/Spinner';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Gif } from '@giphy/react-components';

export default function Menu() {
    const [gif, setGif] = useState(null);
    const [loading, setLoading] = useState(true);

    const giphyFetch = new GiphyFetch('ucmBcFceCXNR9S1w724bgnDTMYepCt3j');

    useEffect(() => {
        // Fetch a random GIF with the keyword "motogp"
        async function fetchRandomGif() {
            try {
                const randomTag = `motogp-${Math.random()}`;
                const { data } = await giphyFetch.random({
                    tag: randomTag,
                    type: 'gifs',
                });
                setGif(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
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
                    style={{
                        width: '260px',
                        maxWidth: '80%',
                        marginBottom: '20px',
                        mixBlendMode: 'multiply',
                    }}
                />
                {loading ? (
                    <Spinner />
                ) : (
                    gif && (
                        <div>
                            <Gif gif={gif} width={300} />
                        </div>
                    )
                )}
            </div>
        </>
    );
}
