import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [videoSrc, setVideoSrc] = useState('');


  useEffect(() => {
    const getBlob = async () => {
      const result = await fetch('http://localhost:3000/mov_bbb.mp4');
      const blob = await result.blob();
      const objUrl = URL.createObjectURL(blob);
      setVideoSrc(objUrl);
      console.log(objUrl);
    } 

    getBlob();
  }, []);

  return (
  <>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <video src={videoSrc} controls />
  </>
)};

export default Home;
